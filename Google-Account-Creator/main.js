//-----------------------------------------------------------------------------------------------------------------------------------------
//  NATIVE

const robot = require("robotjs");
const puppeteer = require("puppeteer-extra");
const proxyloader = require('puppeteer-page-proxy');
const express = require('express')
const {spawn} = require('child_process');

const StealthPlugin = require("puppeteer-extra-plugin-stealth")()
const config = require("./config")
const fs = require('fs')
const readline = require('readline')
const {
  chromepath,
  subsribe,
  copycommnet,
  manualComment,
  autoscroll,
  likeVideos,
} = require("./modules");

const cliSpinners = require("cli-spinners");
const getLastLine = require('./fileTools.js').getLastLine
const Spinners = require("spinnies");
["chrome.runtime", "navigator.languages"].forEach((a) =>
  StealthPlugin.enabledEvasions.delete(a)
);

const spinners = new Spinners(cliSpinners.star.frames, {
  text: "Loading",
  stream: process.stdout,
  onTick: function (frame, index) {
    process.stdout.write(frame);
  },
});

const wait = (seconds) =>
  new Promise((resolve) => setTimeout(() => resolve(true), seconds * 1000));

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const gender = [
  "Male",
  "Female"
]

puppeteer.use(StealthPlugin);

let paths = process.cwd() + "/ublock";

var screenSize = robot.getScreenSize();
var height = (screenSize.height / 2) - 10;
var width = screenSize.width;

robot.setMouseDelay(2);

//-----------------------------------------------------------------------------------------------------------------------------------------
//  CONFIG

const konfigbrowser = {
  defaultViewport: null,
  // devtools: true,
  headless: false,
  executablePath: chromepath.chrome,
  args: [
    "--incognito",
    "--start-maximized"
  ],

  userDataDir: config.userdatadir,
};

//-----------------------------------------------------------------------------------------------------------------------------------------
//  CLASS

class Account {
  constructor(email = "", password="") {
    this.email = email;
    this.password = password;
  }

  saveAsCSV() {
    const csv = `${this.email} ${this.password}\n`;
    try {
      fs.appendFileSync(config.accountFile, csv);
    } catch (err) {
      console.error(err);
    }
  }
}

class Proxy {
  constructor(ip = "", port = "", username = "", password = "") {
    this.port = port;
    this.ip = ip;
    this.username = username;
    this.password = password;
  }
}

// username : lukasderonzier
// password : 4K9ej6jg73

//-----------------------------------------------------------------------------------------------------------------------------------------
//  ROBOT

function generate_proxies() {
  array = [], c = 0;
  proxies = []
  const content = fs.readFileSync("proxies.txt").toString();

  content.split(/([{}])/).filter(Boolean).forEach(e =>
  e == '{' ? c++ : e == '}' ? c-- : c > 0 ? array.push(e) : array.push(e)
  );

  for (var i = 0; i < array.length-1; i+=2){
    subarray = [];
    array[i].split(/([,,])/).filter(Boolean).forEach(e =>
      e == ',' ? c++ : e == ',' ? c-- : c > 0 ? subarray.push(e) : subarray.push(e)
    );

    let ip = subarray[2].split(":")[1];
    let port = subarray[3].split(":")[1];

    ip = ip.replace(/["]/g,'')

    const proxy = new Proxy(ip, port, config.usernameproxy, config.passwordproxy);
    proxies.push(proxy);
  }

  return proxies;
}

firstnames = []
lastnames = []

function generate_names() {

  const text_firstnames = readline.createInterface({
    input: fs.createReadStream('names.txt'),
    output: process.stdout,
    terminal: false
  });
    
  text_firstnames.on('line', (line) => {
      firstnames.push(line)
  });

  const text_lastnames = readline.createInterface({
    input: fs.createReadStream('lastnames.txt'),
    output: process.stdout,
    terminal: false
  });
    
  text_lastnames.on('line', (line) => {
      lastnames.push(line)
  });
}

async function activate_proxy(proxy) {
  console.log("Activating proxy...");

  robot.moveMouse(100, 1060);
  await sleep(1400);
  robot.mouseClick();
  await sleep(1400);
  robot.typeString("proxy");
  await sleep(1400);
  robot.moveMouse(200, 520);
  await sleep(1400);
  robot.mouseClick();
  await sleep(1400);

  robot.moveMouse(840, 755);
  robot.mouseClick();
  robot.mouseClick();
  await sleep(1000);
  robot.typeString(proxy.ip);
  await sleep(1000);

  robot.moveMouse(940, 755);
  robot.mouseClick();
  robot.mouseClick();
  await sleep(1000);
  robot.typeString(proxy.port);
  await sleep(1000);

  robot.moveMouse(746, 987);
  await sleep(1000);
  robot.mouseClick();
  await sleep(1000);

  robot.moveMouse(1510, 70);
  await sleep(1000);
  robot.mouseClick();
  await sleep(1000);

  console.log("...Done. Proxy activated");
}
  
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

//-----------------------------------------------------------------------------------------------------------------------------------------
//  MAIN

function makeid(length) {   // Generates a random character string composed of [length] characters picked randomly from the set [a-zA-Z0-9].
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function communicate(text) {
  const add = text + "\n";
  try {
    fs.appendFileSync(config.exchangeFile, add);
  } catch (err) {
    console.error(err);
  }
}

async function startApp(config, browserconfig) {

  //  INITCONFIG

  useragents = []

  const text = readline.createInterface({
    input: fs.createReadStream('useragents.txt'),
    output: process.stdout,
    terminal: false
  });
    
  text.on('line', (line) => {
      useragents.push(line)
  });

  fs.writeFile(config.exchangeFile, '', (err) => {
    if (err) throw err;
  });

  var count = 0;
  fs.createReadStream(config.accountFile)
  .on('data', function(chunk) {
    for (i=0; i < chunk.length; ++i)
      if (chunk[i] == 10) count++;
  })
  .on('end', function() {
    console.log(count);
  });

  const proxies = generate_proxies();
  console.log(proxies.length);
  if (proxies.length*4 < config.accountNumber)
    console.log("Not enough proxies to create accounts!");

  generate_names();

  await sleep(1000);

  var browser = await puppeteer.launch(browserconfig);
  var page = await browser.newPage();
  
  await page.setViewport({width: 1920,height: 1080 });
  await page.evaluateOnNewDocument(() => {
    delete navigator.__proto__.webdriver;
  });

  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.79 Safari/537.36"
  );

  // GO TO YT

  for (let i = 0; i < config.accountNumber - count; i++) 
  {
    const python = spawn('python', ['main.py']);
    await sleep(1000);
    //for (let i = 0; i < 4; i++)
    //{
    //cp.kill()
    //cp = require('child_process').spawn('python', ['main.py'])
    //}

    if (i % 4 == 0)
    {
        await sleep(1000);

        await page.close();
        page = await browser.newPage();
        
        await page.setViewport({width: 1920,height: 1080 });
        await page.evaluateOnNewDocument(() => {
          delete navigator.__proto__.webdriver;
        });

        await proxyloader(page, 'http://lukasderonzier:4K9ej6jg73@'+proxies[i/4].ip+':'+proxies[i/4].port);
      
        await page.setUserAgent(
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.79 Safari/537.36"
        );
    }

    await page.goto(
      "https://www.youtube.com"
    );

    // CREATE NEW ACCOUNT ID

    const account = new Account(makeid(10), makeid(10));

    // GO TO ACCOUNT CREATE PAGE

    if (await page.$("#buttons > ytd-button-renderer > yt-button-shape > a") == null) console.log('found');
    else 
    {
      console.log('not found');
      await page.waitForTimeout(1000);
      await page.click("#buttons > ytd-button-renderer > yt-button-shape > a > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill");
    }

    /*if (i % 4 == 0)
    {
      await sleep(2000);

      robot.typeString(proxies[i/4].username);
      await sleep(1000);
      robot.moveMouse(870, 248);
      await sleep(1000);
      robot.mouseClick();
      await sleep(1000);

      console.log(robot.getMousePos());
      robot.typeString(proxies[i/4].password);
      await sleep(1000);
      robot.moveMouse(1000, 300);
      await sleep(1000);
      robot.mouseClick();

      await sleep(3000);
    }*/

    await page.waitForTimeout(2000);
    await page.click("#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div > div > ul > li:nth-child(3) > div > div > div.BHzsHc");

    await page.waitForTimeout(2000);
    await page.click("#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.daaWTb > div > div > div:nth-child(1) > div > button > span");

    await page.waitForTimeout(2000);
    await page.click("#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.daaWTb > div > div > div:nth-child(2) > div > ul > li:nth-child(2)");

    await page.waitForTimeout(2000);

    // FILL ACCOUNT INFO

    await page.waitForSelector("#firstName");
    await page.type("#firstName", firstnames[Math.floor(Math.random()*firstnames.length)], { delay: 400 });
    await page.waitForTimeout(2000);
    await page.keyboard.press("Enter");

    await page.waitForSelector("#lastName");
    await page.type("#lastName", lastnames[Math.floor(Math.random()*lastnames.length)], { delay: 400 });
    await page.waitForTimeout(2000);
    await page.keyboard.press("Enter");

    await page.waitForTimeout(2000);
    await page.click("#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div.akwVEf.OcVpRe > div:nth-child(3) > div > div > button > span");

    await page.waitForSelector("#username");
    await page.type("#username", account.email, { delay: 400 });
    await page.waitForTimeout(2000);
    await page.keyboard.press("Enter");

    await page.waitForSelector("#passwd > div.aCsJod.oJeWuf > div > div.Xb9hP > input");
    await page.type("#passwd > div.aCsJod.oJeWuf > div > div.Xb9hP > input", account.password, { delay: 400 });
    await page.waitForTimeout(2000);
    await page.keyboard.press("Enter");

    await page.waitForSelector("#confirm-passwd > div.aCsJod.oJeWuf > div > div.Xb9hP > input");
    await page.type("#confirm-passwd > div.aCsJod.oJeWuf > div > div.Xb9hP > input", account.password, { delay: 400 });
    await page.waitForTimeout(2000);
    await page.keyboard.press("Enter");

    await page.waitForTimeout(2000);

    // GET PHONE NUMBER 

    await page.waitForTimeout(2000);
    communicate("REQUIRE_NUMBER");

    getNumber = true;
    getCode = true;

    number = 0;
    code = 0;
    i = 0
    while (getNumber)
    {
      await sleep(1000);

      var call = "";
      await getLastLine(config.exchangeFile, 1)
          .then((lastLine)=> {
              call = lastLine
              console.log(call)
          })
          .catch((err)=> {
              console.error(err)
          })

      number = parseInt(call) || 0;
      console.log(number);
      if (number != 0)
      {
        getNumber = false;
      }
    }

    await page.waitForTimeout(1000);
    await page.waitForSelector("#phoneNumberId");
    await page.type("#phoneNumberId", number.toString(), { delay: 400 });

    await page.waitForTimeout(1000);
    await page.click("#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button > div.VfPpkd-RLmnJb");

    // GET CODE

    await page.waitForTimeout(2000);
    communicate("REQUIRE_CODE");

    while (getCode)
    {
      await sleep(1000);

      var call = "";
      await getLastLine(config.exchangeFile, 1)
          .then((lastLine)=> {
              call = lastLine
              console.log(call)
          })
          .catch((err)=> {
              console.error(err)
          })

      code = parseInt(call) || 0;
      console.log(code);
      if (code != 0)
      {
        getCode = false;
      }
    }

    await page.waitForTimeout(1000);
    await page.waitForSelector("#code");
    await page.type("#code", code.toString(), { delay: 400 });

    await page.keyboard.press("Enter");
    await page.waitForTimeout(1000);

    // SAVE ACCOUNT DATA

    account.saveAsCSV();

    // ADD USER INFO

    await page.waitForSelector("#day");
    await page.type("#day", Math.random(30).toString(), { delay: 400 });
    await page.waitForTimeout(1000);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);

    let optionValueMonth = await page.$$eval('option', options => options.find(o => o.innerText === months[Math.random(months.length)])?.value)
    await page.select('#month', optionValueMonth);
    await page.waitForTimeout(1000);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#year");
    await page.type("#year", (2002-Math.random(50)).toString(), { delay: 400 });
    await page.waitForTimeout(1000);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1000);

    let optionValueGender = await page.$$eval('option', options => options.find(o => o.innerText === gender[Math.random(2)])?.value)
    await page.select('#gender', optionValueGender);
    await page.waitForTimeout(1000);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1000);

    // EXPRESS CUSTOM

    await page.waitForTimeout(2000);
    await page.click("#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div.dG5hZc > div.daaWTb > div > div > button > span");

    await page.waitForTimeout(2000);
    await page.click("#selectionc11");

    await page.waitForTimeout(2000);
    await page.click("#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div > div > div > button > div.VfPpkd-RLmnJb");

    await page.waitForTimeout(2000);
    await page.click("#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3.F8PBrb > div > div > div:nth-child(2) > div > div > button > span");

    await page.waitForTimeout(2000);
    await page.click("#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button > span");

    // DONE !

    await page.waitForTimeout(1000);

    python.kill();
  }
}

//  CALL

startApp(config, konfigbrowser);

//-----------------------------------------------------------------------------------------------------------------------------------------
//  END
