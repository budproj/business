const Auth0 = require('../dist/lib/auth0').default
const { join } = require('path')

const { AUTH0_MGMT_TOKEN } = process.env
const auth0 = new Auth0(AUTH0_MGMT_TOKEN)

const filePath = join(__dirname, '..', 'users_to_invite.csv')
auth0.inviteUsersFromFile(filePath)
