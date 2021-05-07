const { join } = require('path')
const fs = require('fs')
const csv = require('fast-csv')
const Promise = require('bluebird')

const Auth0 = require('../dist/lib/auth0').default

const { AUTH0_MGMT_TOKEN } = process.env
const auth0 = new Auth0(AUTH0_MGMT_TOKEN)
const filePath = join(__dirname, '..', 'users_to_invite.csv')

const main = () => {
    const inviteUser = (userDraft) =>
      auth0.getUserByEmail(userDraft.email).then(([user]) => auth0.triggerInviteEmail(user).then(() => {
        console.log(`Sent a change password e-mail to user ${user.user_id} (${user.name})`)
      }))

    const handleUserInvite = (userDrafts) =>
      Promise.map(
        userDrafts,
        inviteUser,
        { concurrency: 1 }
      ).catch(console.error)

    const userDrafts = []
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => console.error(error))
      .on('data', (userDraft) => userDrafts.push(userDraft))
      .on('end', () => handleUserInvite(userDrafts))
    }

main()
