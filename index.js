require('newrelic');
const TeleBot = require('telebot');
const request = require('request');
const http = require('http');
const bot = new TeleBot('538233729:AAHJqMW2om913dzeTOECVxUm3Nb6AMTy7Xo');

// Great API for this bot
const API = 'https://thecatapi.com/api/images/get?format=src&type=';

let interval = 0;
let intervalTime = 0;

// Command keyboard
const replyMarkup = bot.keyboard([
  ['/kitty', '/kittygif', '/plbt', '/xrp', '/stopInterval']
], {resize: true, once: false});

// Log every text message
bot.on('text', function (msg) {
  console.log(`[text] ${ msg.chat.id } ${ msg.text }`);
});

// On command "start" or "help"
bot.on(['/start', '/help'], function (msg) {

  return bot.sendMessage(msg.chat.id,
    '😺 Use commands: /kitty, /kittygif, /plbt, /xrp, /plbtInterval time, /stopInterval and /price crypto', {replyMarkup}
  );

});

// On command "kitty" or "kittygif"
bot.on(['/kitty', '/kittygif'], function (msg) {

  let promise;
  let id = msg.chat.id;
  let cmd = msg.text.split(' ')[0];

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

  return promise.catch(error => {
    console.log('[error]', error);
    // Send an error
    bot.sendMessage(id, `😿 An error ${ error } occurred, try again.`);
  });

});

function checkPlbtPrice(id) {
  request({url: 'https://api.coinmarketcap.com/v2/ticker/1784/', json: true}, function(err, res, json) {
    let price = json.data.quotes.USD.price;
    let title = 'ГКТИ';
    let message = `The price is ${price}.`;
    if (price > 4) {
      message += ` Yura is a rich man.`;
      title = 'ГКТИиЮ';
    }
    bot.sendMessage(id, message);
    bot.setChatTitle(id, title).catch(error => console.log('Error:', error));
  });
}

bot.on(['/plbt'], function (msg) {
  let id = msg.chat.id;
  checkPlbtPrice(id);
});

function checkXrpPrice(id) {
  request({url: 'https://api.coinmarketcap.com/v2/ticker/52/', json: true}, function(err, res, json) {
    let price = json.data.quotes.USD.price;
    let title = 'ГКТИ';
    let message = `The price is ${price}.`;
    if (price > 1.5) {
      message += ` To the moon!`;
      title = 'КТИ';
    }
    bot.sendMessage(id, message);
    bot.setChatTitle(id, title).catch(error => console.log('Error:', error));
  });
}

bot.on(['/xrp'], function (msg) {
  let id = msg.chat.id;
  checkXrpPrice(id);
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

  request({url: 'https://api.coinmarketcap.com/v2/listings/', json: true}, function(err, res, json) {
    const cryptos = json.data;
    const toFind = cryptos.find(cr => cr.symbol.toLowerCase() === crypto.toLowerCase());

    if(toFind) {
      request({url: `https://api.coinmarketcap.com/v2/ticker/${toFind.id}/`, json: true}, function(err, res, json) {
        let price = json.data.quotes.USD.price;
        bot.sendMessage(id, `The price is ${price}.`);
      });
    } else {
      bot.sendMessage(id, `Crypto is not found.`);
    }
    
  });

});

// Start getting updates
bot.start();

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Welcome to @PolybiusBot. It is a Telegram bot. To use it open Telegram app.');
  res.end();
}).listen(process.env.PORT || 3000);