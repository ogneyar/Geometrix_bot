let fetch = require('node-fetch');
var parseString = require('xml2js').parseString;
// example xml2js
var xml = "<root>Hello xml2js!</root>"
parseString(xml, function (err, result) {
    // console.log(result);
});

// const url = "https://zakupki.gov.ru/epz/order/extendedsearch/rss.html?morphology=on&pageNumber=1&sortDirection=false&recordsPerPage=_10&showLotsInfoHidden=false&OrderPlacementExecutionRequirement=on&orderPlacement94_0=0&orderPlacement94_1=0&orderPlacement94_2=0&sortBy=UPDATE_DATE&fz44=on&fz223=on&af=on&currencyIdGeneral=-1&OrderPlacementSmallBusinessSubject=on&OrderPlacementRnpData=on&search-filter=Дате+размещения&searchString=оплаты+проезда"; // &ca=on 
// const url = "https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits";
// const url = "https://zakupki.gov.ru/epz/order/extendedsearch/rss.html?pageNumber=1";
// const url = "https://zakupki.gov.ru";

const url = "https://zakupki.gov.ru/epz/order/extendedsearch/rss.html?searchString=топографическая+съемка&morphology=on&search-filter=Дате+размещения&pageNumber=1&sortDirection=false&recordsPerPage=_10&showLotsInfoHidden=false&sortBy=UPDATE_DATE&fz44=on&fz223=on&af=on&selectedLaws=FZ44%2CFZ223&currencyIdGeneral=-1&OrderPlacementSmallBusinessSubject=on&OrderPlacementRnpData=on&OrderPlacementExecutionRequirement=on&orderPlacement94_0=0&orderPlacement94_1=0&orderPlacement94_2=0";


async function parse(url) {

    // let response = await fetch(url);
    
    
    // let response = await fetch(encodeURI(url));

    let response = await fetch(encodeURI(url), {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36 OPR/70.0.3728.106",
            "Accept": "*/*",
            "Connection": "keep-alive"
        }
      });
    //   "Accept-Encoding": "gzip, deflate, br",
    //   "Host": "zakupki.gov.ru"
    //   "Origin": "https://sph.hutoryanin.ru"
    //   "Cookie": "routeepz0=0"

    let json = response.text();

    // let json = response.json();
  

    // if (response.ok) { // если HTTP-статус в диапазоне 200-299
    //     let json = await response.json();
    // } else {
    //     console.log("Ошибка HTTP: " + response.status);
    //     return "Error";
    // }

    return json;

}


parse(url).then((resolve, reject) => {
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
                            
                console.log('Автор заявки');
                console.log(author);
                // console.log();

                let s = link.indexOf('=') + 1;
                let num = link.slice(s);
                console.log('Номер заявки');
                console.log(num);
                // console.log();

                let start = description.indexOf('Начальная цена контракта'); // Начальная цена контракта (номер в строке)
                let name = description.slice(start);
                start = name.indexOf('</strong>') + 9; // Наименование Заказчика (номер в строке) 
                let end = name.indexOf('<strong>'); // номер символа в конце нужной строки
                name = name.slice(start, end);
                console.log('Начальная цена контракта');
                console.log(name);
                console.log();

                // console.log('title');
                // console.log(title);
                // console.log();

                // console.log('link');
                // console.log(link);
                // console.log();

                // console.log('description');
                // console.log(description);
                // console.log();

                // console.log('pubDate');
                // console.log(pubDate);
                // console.log();               

            }
            
            // console.log(result.rss.channel[0].item[0]);

        });

    }else if (reject) {
        console.log("reject");
    }else {
        console.log("else");
    }
} )
.catch(e => console.log("catch error: ", e));

// console.log( encodeURI(url) );
