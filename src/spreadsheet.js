const readline = require('readline')
const path = require('path')
const { google } = require('googleapis')
const fs = require('fs')

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
]

const TOKEN = {
  access_token: process.env.SPREADSHEET_ACCESS_TOKEN,
  token_type: "Bearer",
  refresh_token: process.env.SPREADSHEET_REFRESH_TOKEN,
  scope: SCOPES.join(' '),
  expiry_date: 1534498917009
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize (credentials, callback, data) {
  const { client_secret, client_id, redirect_uris } = credentials
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  )
  oAuth2Client.setCredentials(TOKEN)
  callback(oAuth2Client, data)
}


// function getNewToken (oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES
//   })
//   console.log('Authorize this app by visiting this url:', authUrl)
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   })
//   rl.question('Enter the code from that page here: ', code => {
//     rl.close()
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) {
//         return console.error('Error while trying to retrieve access token', err)
//       }
//       oAuth2Client.setCredentials(token)
//       // Store the token to disk for later program executions
//       fs.writeFile(
//         path.resolve(__dirname, TOKEN_PATH),
//         JSON.stringify(token),
//         err => {
//           if (err) console.error(err)
//           console.log('Token stored to', path.resolve(__dirname, TOKEN_PATH))
//         }
//       )
//       callback(oAuth2Client)
//     })
//   })
// }

module.exports = {
  authorize
}
