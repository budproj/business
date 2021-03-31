const { join } = require('path')
const fs = require('fs')
const csv = require('fast-csv')
const { createConnection } = require('typeorm')
const Promise = require('bluebird')

const dbConfig = require('../dist/src/config/database/config').default
const Auth0 = require('../dist/lib/auth0').default
const { User } = require('../dist/src/domain/user/entities')

const { AUTH0_MGMT_TOKEN } = process.env
const auth0 = new Auth0(AUTH0_MGMT_TOKEN)
const filePath = join(__dirname, '..', 'users_to_invite.csv')

const main = () =>
  createConnection(dbConfig).then((dbConnection) => {
    const createUser = (userDraft) =>
      new Promise((resolve, reject) =>
        auth0
          .createUser(userDraft)
          .then((user) => {
            console.log(`➤ Created user ${userDraft.first_name} with ID ${user.user_id}:`, user)

            auth0
              .addDraftRoleToInvitedUser(user, userDraft.authz_role)
              .then((assignedRoles) => {
                console.log(
                  `➤ Assigned role ${userDraft.authz_role} to user ${user.user_id} (${userDraft.first_name}):`,
                  assignedRoles,
                )
              })
              .catch(reject)

            createDatabaseUser(userDraft, user).then(resolve).catch(reject)
          })
          .catch(reject)
      )

    const createDatabaseUser = (userDraft, authzUser) => {
      const user = {
        firstName: userDraft.first_name,
        lastName: userDraft.last_name,
        gender: userDraft.gender,
        picture: userDraft.picture,
        role: userDraft.company_role,
        authzSub: authzUser.user_id,
      }
      const query = dbConnection.createQueryBuilder(User, 'user').insert().values(user)

      const queryPromise = new Promise((resolve, reject) =>
        query
          .execute()
          .then((result) => {
            console.log(
              `➤ Created database user for user ${authzUser.user_id} (${userDraft.first_name}):`,
              result,
            )
          })
          .then(resolve)
          .catch(reject),
      )

      return queryPromise
    }

    const handleUserDrafts = (userDrafts) =>
      Promise.map(
        userDrafts,
        createUser,
        { concurrency: 1 }
      ).then(() => dbConnection.close()).catch(console.error)

    const userDrafts = []
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => console.error(error))
      .on('data', (userDraft) => userDrafts.push(userDraft))
      .on('end', () => handleUserDrafts(userDrafts))
  })

main()
