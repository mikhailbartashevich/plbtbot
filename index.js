require('newrelic');
const TeleBot = require('telebot');
const request = require('request');
const http = require('http');
const bot = new TeleBot('538233729:AAHJqMW2om913dzeTOECVxUm3Nb6AMTy7Xo');

let interval = 0;
let intervalTime = 0;

// Command keyboard
const replyMarkup = bot.keyboard([
  ['/kitty', '/kittygif', '/plbt', '/xrp', '/btc', '/stopInterval']
], {resize: true, once: false});

// Log every text message
bot.on('text', function (msg) {
  console.log(`[text] ${ msg.chat.id } ${ msg.text }`);
});

// On command "start" or "help"
bot.on(['/start', '/help'], function (msg) {

  return bot.sendMessage(msg.chat.id,
    '😺 Use commands: /kitty, /kittygif, /plbt, /xrp, /btc, /plbtInterval time, /stopInterval and /price crypto', {replyMarkup}
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
  request({url: 'https://api.coinmarketcap.com/v2/ticker/52/', json: true}, function(err, res, json) {
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

function checkBtcPrice(id) {
  request({url: 'https://api.coinmarketcap.com/v2/ticker/1/', json: true}, function(err, res, json) {
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

    let photo = 'https://cdni.rt.com/files/news/1f/9e/a0/00/50proton-m-rocket-takeoff-crash.jpg'
    if(price > 8000) {
      photo = 'https://www.outerplaces.com/media/k2/items/cache/7db160bf373b0765b084bfc22d0899cc_L.jpg';
    }
    bot.setChatPhoto(id, 'https://www.outerplaces.com/media/k2/items/cache/7db160bf373b0765b084bfc22d0899cc_L.jpg').catch(error => console.log('[error]', error));
  });
}

bot.on(['/btc'], function (msg) {
  let id = msg.chat.id;
  checkBtcPrice(id);
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