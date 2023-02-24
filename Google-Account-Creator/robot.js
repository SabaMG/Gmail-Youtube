var robot = require("robotjs");

// Speed up the mouse.
robot.setMouseDelay(2);

var twoPI = Math.PI * 2.0;
var screenSize = robot.getScreenSize();
var height = (screenSize.height / 2) - 10;
var width = screenSize.width;

async function activate_proxy() {
  console.log("Activating proxy...");

  robot.moveMouse(100, 1060);
  await sleep(1000);
  robot.mouseClick();
  await sleep(1000);
  robot.typeString("proxy");
  await sleep(1000);
  robot.moveMouse(200, 520);
  await sleep(1000);
  robot.mouseClick();
  await sleep(1000);
  robot.moveMouse(700, 700);
  await sleep(1000);
  robot.mouseClick();
  await sleep(1000);

  robot.moveMouse(840, 755);
  robot.mouseClick();
  robot.mouseClick();
  await sleep(1000);
  robot.typeString("11.11.11.11");
  await sleep(1000);

  robot.moveMouse(940, 755);
  robot.mouseClick();
  robot.mouseClick();
  await sleep(1000);
  robot.typeString("10350");
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

init();