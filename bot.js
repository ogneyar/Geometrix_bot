const fs = require("fs");
const { Telegraf } = require('telegraf');

let BOT_TOKEN;
try {
    const data = fs.readFileSync("env.json");
    BOT_TOKEN = JSON.parse(data).BOT_TOKEN;
} catch (err) {
    console.error(err)
}

const bot = new Telegraf(BOT_TOKEN)

bot.start((ctx) => ctx.reply('Welcome')); //ответ бота на команду /start

bot.help((ctx) => ctx.reply('Send me a sticker')); //ответ бота на команду /help

bot.on('sticker', (ctx) => ctx.reply('')); //bot.on это обработчик введенного юзером сообщения, в данном случае он отслеживает стикер, можно использовать обработчик текста или голосового сообщения

bot.hears('hi', (ctx) => ctx.reply('Hey there')); // bot.hears это обработчик конкретного текста, данном случае это - "hi"

bot.launch(); // запуск бота


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))



