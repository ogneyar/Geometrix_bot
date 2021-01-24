const fs = require("fs");
let fetch = require('node-fetch');
let parseString = require('xml2js').parseString;
const bodyParser = require("body-parser");
let express = require('express');
let	port = process.env.PORT || 80;
let	host = process.env.HOST || "0.0.0.0";

let BOT_TOKEN;
try {
    const data = fs.readFileSync("env.json");
    BOT_TOKEN = JSON.parse(data).BOT_TOKEN;
} catch (err) {
    console.error(err)
}

let development_mode = true;

let uri = `https://api.telegram.org/bot${BOT_TOKEN}/`;
let getMe = `${uri}getMe`;
let getUpdates = `${uri}getUpdates?offset=`;
const webhook = "https://a0500365.xsph.ru/bot";
let update_id = 0;
let chat_id;
let text;
let update;
let result;
let message;
let brk = "null";
const url = "https://zakupki.gov.ru/epz/order/extendedsearch/rss.html?searchString=топографическая+съемка&morphology=on&search-filter=Дате+размещения&pageNumber=1&sortDirection=false&recordsPerPage=_10&showLotsInfoHidden=false&sortBy=UPDATE_DATE&fz44=on&fz223=on&af=on&selectedLaws=FZ44%2CFZ223&currencyIdGeneral=-1&OrderPlacementSmallBusinessSubject=on&OrderPlacementRnpData=on&OrderPlacementExecutionRequirement=on&orderPlacement94_0=0&orderPlacement94_1=0&orderPlacement94_2=0";


if (development_mode) {

    getWebhookInfo()
        .then(resolve => {
            if (resolve.result.url != "") {
                deleteWebhook().then(resolve => {
                    if (resolve.ok) Bot(update_id);
                    else console.log("Error deleteWebhook");
                });
            }else Bot(update_id);
        });

}else {

    getWebhookInfo()
        .then(resolve => {
            if (resolve.result.url == "") setWebhook(webhook);
        });

    express().use(express.static('/'))
        // создаем парсер для данных application/x-www-form-urlencoded
        .use(bodyParser.urlencoded({ extended: false }))
        // создаем парсер для данных application/json
        .use(bodyParser.json())
        .get('/', (req, res) => res.sendFile(__dirname + '/index.html'))
        .get('/bot', (req, res) => {
            console.log(req.query);
            res.send("req");
            // sendMessage(chat_id, "*ЧАО*", "markdown");
        })
        .post('/bot', (req, res) => {
            if(!req.body) return res.sendStatus(400);
            console.log(req.body);
            res.send("req");
        })
        .get('*', (req, res) => res.sendFile(__dirname + '/index.html'))
        .listen(port, host, () => console.log(`Server run, listen port ${ port }`));

}

// -----------------------------------------
// -------------- ФУНКЦИИ ------------------
// -----------------------------------------

// функция отправляет GET запрос на URL
async function Get(url) {
    let response = await fetch(encodeURI(url), {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36 OPR/70.0.3728.106",
            "Accept": "*/*",
            "Connection": "keep-alive"
        }
      });
    return response.text();
}

// async function async_func() {
//     let promise = new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve("result");
//         }, 3000);    
//     });
//     return promise;
// }

function Bot() {
    let request = getUpdates + (update_id + 1);
    // console.log(request);
    Get(request).then((resolve, reject) => {
        if (resolve) {
            // console.log(resolve);
            update = JSON.parse(resolve);
            if (!update.ok) {
                brk = "break";
                console.log("break");
            }else {
                result = update.result;
                for (let i = 0; i < result.length; i++) {
                    update_id = result[i].update_id;
                    message = result[i].message;
                    text = message.text;
                    chat_id = message.from.id;
                    if (text == "/stop") {
                        brk = "break";
                        console.log("/stop");
                        sendMessage(chat_id, "*ЧАО*", "markdown");
                    }else if (text == "/zakupki") {

                        zakupki();

                    }else {
                        console.log(text);
                        sendMessage(chat_id, `*${text}*`, "markdown");
                    }
                    // console.log(result[i]);
                }
            }
            // async_func().then((res,rej) => {
            new Promise((reso, reje) => {
                    setTimeout(() => {
                        reso("result");
                    }, 3000);
            }).then((res,rej) => {
                if (res) {

                    if (brk != "break") {
                        Bot();
                        console.log("last update id: ", update_id);
                    }else {
                        Get(getUpdates + (update_id + 1)).then((resolve, reject) => {
                            if (resolve) {
                                console.log("exit");
                            }
                        });
                        // sendMessage(chat_id, `*${text}*`, "markdown");
                    }

                }else if (rej) {
                    console.log("rej");
                }else {
                    console.log("else");
                }
            });
    
        }else if (reject) {
            console.log("reject");
        }else {
            console.log("else");
        }
    })
    .catch(e => console.log("catch error: ", e));
}


function zakupki() {

    Get(url).then((resolve, reject) => {
        if (resolve) {
            // console.log(resolve);
            parseString(resolve, function (err, result) {
                for (let i = 0;  i < result.rss.channel[0].item.length; i++) {
                    // let i = 0;
                    let title = result.rss.channel[0].item[i].title[0];
                    let link = result.rss.channel[0].item[i].link[0];
                    let description = result.rss.channel[0].item[i].description[0];
                    let pubDate = result.rss.channel[0].item[i].pubDate[0];
                    let author = result.rss.channel[0].item[i].author[0];

                    let s = link.indexOf('=') + 1;
                    let num = link.slice(s);
                    console.log('Номер заявки');
                    console.log(num);
                    // console.log();

                    if (link.indexOf('https://zakupki.gov.ru') == -1) link = `https://zakupki.gov.ru${link}`
                    console.log('Ссылка');
                    console.log(link);
                    console.log();

                    let start = description.indexOf('Начальная цена контракта'); // Начальная цена контракта (номер в строке)
                    let name = description.slice(start);
                    start = name.indexOf('</strong>') + 9; // Наименование Заказчика (номер в строке) 
                    let end = name.indexOf('<strong>'); // номер символа в конце нужной строки
                    name = name.slice(start, end);
                    // console.log('Начальная цена контракта');
                    // console.log(name);
                    // console.log();

                    

                    sendFormatMessage(description, link);

                }
            });
        }else if (reject) {
            console.log("reject");
        }else {
            console.log("else");
        }
    } )
    .catch(e => console.log("catch error: ", e));


}

function call(url) {
    return Get(url)
        .then(resolve => JSON.parse(resolve) );
}

function getWebhookInfo() {
    return call(`${uri}getWebhookInfo`);
}

function setWebhook(url) {
    return call(`${uri}setWebhook?url=${url}`);
}

function deleteWebhook() {
    return call(`${uri}deleteWebhook`);
}

function sendMessage(chat_id, text, parse_mode = '') { 
    return call(`${uri}sendMessage?chat_id=${chat_id}&text=${text}&parse_mode=${parse_mode}`);
}

function sendFormatMessage(response, link) {
    // let response = result.rss.channel[0].item[0].description[0];
    // let link = result.rss.channel[0].item[0].link[0];

    response = response.replace(/<br\/?>/g, "\n");
    response = response.replace(/<\/?strong>/g, "*");
    response = response.replace(/<\/?b>/g, "*");

    let start = response.indexOf('<a href=');
    let end = response.indexOf('>', start) + 1;
    let target = response.indexOf('</a>');

    let insert = response.slice(end, target);
    insert = insert.replace(/\*/g, "");

    let name = response.slice(0, start);

    name += `[${insert}](${link})`;

    name += response.slice(target);
    response = name.replace(/<\/?a>/g, "");

    sendMessage(chat_id, response, "markdown");
}