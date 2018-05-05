require('newrelic');
const TeleBot = require('telebot');
const request = require('request');
const bot = new TeleBot('538233729:AAHJqMW2om913dzeTOECVxUm3Nb6AMTy7Xo');

// Great API for this bot
const API = 'https://thecatapi.com/api/images/get?format=src&type=';

// Command keyboard
const replyMarkup = bot.keyboard([
    ['/kitty', '/kittygif', '/plbt', '/xrp']
], {resize: true, once: false});

// Log every text message
bot.on('text', function (msg) {
    console.log(`[text] ${ msg.chat.id } ${ msg.text }`);
});

// On command "start" or "help"
bot.on(['/start', '/help'], function (msg) {

    return bot.sendMessage(msg.chat.id,
        '😺 Use commands: /kitty, /kittygif, /plbt, /xrp and /price crypto', {replyMarkup}
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

bot.on(['/plbt'], function (msg) {
  let promise = new Promise();
  let id = msg.chat.id;

  request({url: 'https://api.coinmarketcap.com/v2/ticker/1784/', json: true}, function(err, res, json) {
    let price = json.data.quotes.USD.price;

    if(price > 4) {
      promise = bot.sendMessage(id, `The price is ${price}. Yura is a rich man.`);
      bot.setChatTitle(id, 'ГКТИиЮ');
    } else {
      promise = bot.sendMessage(id, `The price is ${price}.`);
      bot.setChatTitle(id, 'ГКТИ');
    }
  });

  return promise.catch(error => {
      console.log('[error]', error);
  });
  
});

bot.on(['/xrp'], function (msg) {
  let promise = new Promise();
  let id = msg.chat.id;

  request({url: 'https://api.coinmarketcap.com/v2/ticker/52/', json: true}, function(err, res, json) {
    let price = json.data.quotes.USD.price;

    if(price > 1.5) {
      promise = bot.sendMessage(id, `The price is ${price}. To the moon!`);
      bot.setChatTitle(id, 'КТИ');
    } else {
      promise = bot.sendMessage(id, `The price is ${price}.`);
      bot.setChatTitle(id, 'ГКТИ');
    }
  });

  return promise.catch(error => {
    console.log('[error]', error);
  });
  
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

const http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Welcome to @PolybiusBot. It is a Telegram bot. To use it open Telegram app.');
  res.end();
}).listen(process.env.PORT || 3000);