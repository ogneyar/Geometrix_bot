let fetch = require('node-fetch');
var parseString = require('xml2js').parseString;
// example xml2js
var xml = "<root>Hello xml2js!</root>"
parseString(xml, function (err, result) {
    // console.log(result);
});

const url = "https://zakupki.gov.ru/epz/order/extendedsearch/rss.html?morphology=on&pageNumber=1&sortDirection=false&recordsPerPage=_10&showLotsInfoHidden=false&OrderPlacementExecutionRequirement=on&orderPlacement94_0=0&orderPlacement94_1=0&orderPlacement94_2=0&sortBy=UPDATE_DATE&fz44=on&fz223=on&af=on&currencyIdGeneral=-1&OrderPlacementSmallBusinessSubject=on&OrderPlacementRnpData=on&search-filter=Дате+размещения&searchString=оплаты+проезда"; // &ca=on 

// const url = "https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits";

// const url = "https://zakupki.gov.ru/epz/order/extendedsearch/rss.html?pageNumber=1";

// const url = "https://zakupki.gov.ru";


async function ttt(url) {

    // let response = await fetch(url);
    
    

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


ttt(url).then((resolve, reject) => {
    if (resolve) {

        // console.log(resolve);
        parseString(resolve, function (err, result) {
            console.log(result.rss.channel[0].item[0].description[0]);
            // parseString(result.rss.channel[0].item[0].description[0], function (err, res) {
            //     console.log(res);
            // });
        });

    }else if (reject) {
        console.log("reject");
    }else {
        console.log("else");
    }
} )
.catch(e => console.log("catch error: ", e));

// console.log( encodeURI(url) );
