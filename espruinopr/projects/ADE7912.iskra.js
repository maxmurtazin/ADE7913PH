const READ_LOOP = 533;
let ADE7912 = require('ADE7912');
let ade7912 = ADE7912.create();

let v1;
let v2;

// sensor names:
const ph1 = {
  cs: 0,
}

const ph2 = {
  cs: 1,
}

ade7912.resetDevices();
ade7912.initDevices();

setInterval(function() {
  v1 = ade7912.readADResult(ph1.cs);
  console.log('v1', v1);
}, READ_LOOP);

setTimeout(function () {
  setInterval(function () {
    v2 = ade7705.readADResult(ph2.cs);
    console.log('v2', v2);
  }, READ_LOOP);
}, READ_LOOP)