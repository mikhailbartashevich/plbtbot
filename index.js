require('newrelic');
const TeleBot = require('telebot');
const request = require('request');
const http = require('http');
const bot = new TeleBot('538233729:AAHJqMW2om913dzeTOECVxUm3Nb6AMTy7Xo');

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets'
];
const TOKEN_PATH = 'token.json';

let interval = 0;
let intervalTime = 0;

// Command keyboard
const replyMarkup = bot.keyboard([
  ['/kitty', '/kittygif', '/plbt', '/xrp', '/btc', '/fiat']
], { resize: true, once: false });

// On command "start" or "help"
bot.on(['/start', '/help'], function (msg) {

  return bot.sendMessage(msg.chat.id,
    '😺 Use commands: /kitty, /kittygif, /plbt, /xrp, /btc, /fiat usd_pln pair, and /price crypto', { replyMarkup }
  );

});

function showKitty(id, cmd) {
  const API = 'https://thecatapi.com/api/images/get?format=src&type=';

  let promise;
  // Photo or gif?
  if (cmd == '/kitty') {
    promise = bot.sendPhoto(id, API + 'jpg', {
      fileName: 'kitty.jpg',
      serverDownload: true
    });
  } else {
    promise = bot.sendDocument(id, API + 'gif#', {
      fileName: 'kitty.gif',
      serverDownload: true
    });
  }

  // Send "uploading photo" action
  bot.sendAction(id, 'upload_photo');
  return promise;
}

// On command "kitty" or "kittygif"
bot.on(['/kitty', '/kittygif'], function (msg) {
  let id = msg.chat.id;
  let cmd = msg.text.split(' ')[0];
  return showKitty(id, cmd).catch(error => {
    console.log('[error]', error);
    // Send an error
    bot.sendMessage(id, `😿 An error ${error} occurred, try again.`);
  });

});

function checkPlbtPrice(id) {
  request({ url: 'https://api.coinmarketcap.com/v2/ticker/1784/', json: true }, function (err, res, json) {
    let price = json.data.quotes.USD.price;
    let title = 'ГКТИ';
    let message = `The price is ${price}.`;
    if (price > 4) {
      message += ` Yura is a rich man.`;
      title = 'ГКТИиЮ';
    }
    bot.sendMessage(id, message);
    if (price < 3.9) {
      bot.sendMessage(id, `😿 Here is a kitty for Yura.`);
      showKitty(id, '/kitty').catch(error => console.log('[error]', error));
    }
    bot.setChatTitle(id, title).catch(error => console.log('Error:', error));
  });
}

bot.on(['/plbt'], function (msg) {
  let id = msg.chat.id;
  checkPlbtPrice(id);
});

function checkXrpPrice(id) {
  request({ url: 'https://api.coinmarketcap.com/v2/ticker/52/', json: true }, function (err, res, json) {
    let price = json.data.quotes.USD.price;
    let title = 'ГКТИ';
    let message = `The price is ${price}.`;
    if (price > 1.5) {
      message += ` To the moon!`;
      title = 'КТИ';
    }
    bot.sendMessage(id, message);
    if (price < 0.9) {
      bot.sendMessage(id, `😿 Here is a kitty for Gore Traders.`);
      showKitty(id, '/kitty').catch(error => console.log('[error]', error));
    }
    bot.setChatTitle(id, title).catch(error => console.log('Error:', error));
  });
}

bot.on(['/xrp'], function (msg) {
  let id = msg.chat.id;
  checkXrpPrice(id);
});

bot.on(['/remont'], function (msg) {
  let id = msg.chat.id;
  checkRemontPrice(id);
});

function checkRemontPrice(id) {
  const renovationURL = `https://sheets.googleapis.com/v4/spreadsheets/1ZXASrDKPS2oF-UkrydC2N6khMuyJnanRctiEqu1wvEw/values/H16?key=AIzaSyBT95iNZMJphiiXzbKUTffs8T3TFVwf8XM`;

  request({ url: renovationURL, json: true }, function (err, res, json) {
    const total = json.values[0][0];
    bot.sendMessage(id, `Yura the Rich spent already for renovation: ${total}`);
  });

}

function checkBtcPrice(id) {
  request({ url: 'https://api.coinmarketcap.com/v2/ticker/1/', json: true }, function (err, res, json) {
    let price = json.data.quotes.USD.price;
    let message = `The price is ${price}.`;
    if (price > 10000) {
      message += ` To the moon!`;
    }
    bot.sendMessage(id, message);
    if (price < 9000) {
      bot.sendMessage(id, `MtGox, Seriously ?! 😿 Here is a kitty for the team.`);
      showKitty(id, '/kitty').catch(error => console.log('[error]', error));
    }

    let photo = 'https://i.obozrevatel.com/2014/12/17/281603.jpg?size=600x400';
    if (price > 8000) {
      photo = 'https://www.outerplaces.com/media/k2/items/cache/7db160bf373b0765b084bfc22d0899cc_L.jpg';
    }
    bot.setChatPhoto(id, photo, { serverDownload: true }).catch(error => console.log('[error]', error));
  });
}

bot.on(['/btc'], function (msg) {
  let id = msg.chat.id;
  checkBtcPrice(id);
});

function checkFiatPrice(id, pair) {
  request({ url: `http://free.currencyconverterapi.com/api/v5/convert?q=${pair}&compact=y`, json: true },
    function (err, res, json) {
      const keys = Object.keys(json);
      const key = keys.length ? keys[0] : '';
      let message = '';

      if (key) {
        const price = json[key].val;
        message = `The price is ${price}.`;

        if (pair.toLowerCase() === 'usd_pln') {
          if (price > 3.75) {
            message += ` You are too rich for the kitty!`;
          } else {
            message += ` 😿 Here is a kitty for the team.`;
            showKitty(id, '/kitty').catch(error => console.log('[error]', error));
          }
        }
      } else {
        message = `No such fiat pair.`;
      }

      bot.sendMessage(id, message);
    });
}

bot.on(['/fiat'], function (msg) {
  const id = msg.chat.id;
  const pair = msg.text.split(' ')[1] || 'usd_pln';
  checkFiatPrice(id, pair);
});

bot.on(['/plbtInterval'], function (msg) {
  let id = msg.chat.id;
  const time = msg.text.split(' ')[1] || 10000;
  intervalTime = parseInt(time, 10);
  clearInterval(interval);
  interval = setInterval(() => checkPlbtPrice(id), intervalTime);
  bot.sendMessage(id, `Interval ${intervalTime} started.`);
});

bot.on(['/stopInterval'], function (msg) {
  let id = msg.chat.id;
  clearInterval(interval);
  bot.sendMessage(id, `Interval ${intervalTime} stopped.`);
});

bot.on(['/price'], function (msg) {
  let id = msg.chat.id;
  let crypto = msg.text.split(' ')[1] || '';

  request({ url: 'https://api.coinmarketcap.com/v2/listings/', json: true }, function (err, res, json) {
    const cryptos = json.data;
    const toFind = cryptos.find(cr => cr.symbol.toLowerCase() === crypto.toLowerCase());

    if (toFind) {
      request({ url: `https://api.coinmarketcap.com/v2/ticker/${toFind.id}/`, json: true }, function (err, res, json) {
        let price = json.data.quotes.USD.price;
        bot.sendMessage(id, `The price is ${price}.`);
      });
    } else {
      bot.sendMessage(id, `Crypto is not found.`);
    }

  });

});

bot.on(['text'], function (msg) {
  const id = msg.chat.id;
  const text = msg.text.toLowerCase();
  if (text.indexOf('запомните этот твит') > -1) {
    rememberTweet(id, msg);
  }
  if (text.indexOf('картош') > -1 || text.indexOf('картоф') > -1 || text.indexOf('бульб') > -1 || text.indexOf('картох') > -1 ) {
    kartoshkaJoke(id, msg);
  }

  if (text.indexOf('ебучие джуны') > -1 || text.indexOf('ебучий джун') > -1 ) {
    eJunior(id, msg);
  }
});

bot.on(['/split'], function (msg) {
  let id = msg.chat.id;
  let price = msg.text.split(' ')[1] || '';
  splitwise(price);
});

const Splitwise = require('splitwise');
const splitwiseAPI = Splitwise({
  consumerKey: 'CaTRJTDOXpcqK0iz5oBsE53kC6CrxWoIc9MtMZwV',
  consumerSecret: 'HXorLklyzQBnu8y7YBFb8Kt9lMp3yrzN9DIOLAWC'
});

function splitwise() {
  splitwiseAPI.getCurrentUser().then(console.log) // => { id: ... }
}

function eJunior(id, msg) {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), processEJunior, msg);
  });
  
}

function kartoshkaJoke(id, msg) {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), processKartoshkaJoke, msg);
  });
  
}

function rememberTweet(id, msg) {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), appendTweet, msg);
  });
  
}

// Start getting updates
bot.start();

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Welcome to @PolybiusBot. It is a Telegram bot. To use it open Telegram app.');
  res.end();
}).listen(process.env.PORT || 3000);


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, data) {
  const { client_secret, client_id, redirect_uris } = credentials;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    try {
      JSON.parse(token)
    } catch (errr) {
      return getNewToken(oAuth2Client, callback);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, data);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function appendTweet(auth, msg, range = 'A1') {
  const request = {
    spreadsheetId: '1zH0oBaRmZxAJFtRnnMTTZk81kwTO_nTslLeVNDA8Ysw',  // TODO: Update placeholder value.
    range,
    insertDataOption: 'INSERT_ROWS',
    valueInputOption: 'RAW',  // TODO: Update placeholder value.
    resource: {
      values: [[
        new Date().toLocaleDateString() + ' ' + msg.from.first_name + ': ' + msg.text
      ]]
    },
    auth,
  };
  console.log('range', JSON.stringify(request));
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.append(request, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    bot.sendMessage(msg.chat.id, `Remembered. https://docs.google.com/spreadsheets/d/1zH0oBaRmZxAJFtRnnMTTZk81kwTO_nTslLeVNDA8Ysw`);
  });
}

function processEJunior(auth, msg) {
  const photo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Paris_Tuileries_Garden_Facepalm_statue.jpg/300px-Paris_Tuileries_Garden_Facepalm_statue.jpg';
  const callbackMessage = 'Опять ебучий джун?';
  const range = 'C:C';
  processMessage(auth, msg, 'C2', range, photo, callbackMessage)
}

function processKartoshkaJoke(auth, msg) {
  const photo = 'http://www.forumdaily.com/wp-content/uploads/2015/08/aleksandr-lukashenko-s-synom-dobyvaet-kartoshku_rect_ffaaec783c367451f74a5ba4605cbe90.jpeg';
  const callbackMessage = 'Что это, еще одна бульба-шутка?';
  const range = 'B:B';
  processMessage(auth, msg, 'B2', range, photo, callbackMessage)
}

function processMessage(auth, msg, countRange, range, photo, callbackMessage = '') {
  const id = msg.chat.id;
  const sheetsRequest = {
    spreadsheetId: '1zH0oBaRmZxAJFtRnnMTTZk81kwTO_nTslLeVNDA8Ysw',  // TODO: Update placeholder value.
    range: countRange,
    valueInputOption: 'RAW',  // TODO: Update placeholder value.
    resource: {
      values: [[
        1
      ]]
    },
    auth,
  };
  const sheets = google.sheets({version: 'v4', auth});

  const kartoskaJokesURL = `https://sheets.googleapis.com/v4/spreadsheets/1zH0oBaRmZxAJFtRnnMTTZk81kwTO_nTslLeVNDA8Ysw/values/${countRange}?key=AIzaSyBT95iNZMJphiiXzbKUTffs8T3TFVwf8XM`;

  request({ url: kartoskaJokesURL, json: true }, (err, res, json) => {
    const total = +json.values[0][0];
    
    bot.sendPhoto(id, photo, {
      fileName: 'image.jpg',
      serverDownload: true
    });
    bot.sendMessage(id, `${callbackMessage} Нашучено: ${total + 1}`);
    appendTweet(auth, msg, range);

    sheetsRequest.resource = {
      values: [[
        total + 1
      ]]
    };

    sheets.spreadsheets.values.update(sheetsRequest, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  });

}