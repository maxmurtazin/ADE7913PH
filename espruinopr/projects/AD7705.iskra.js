const READ_LOOP = 2*533;

var AD7705 = require('AD7705');
var ad7705 = AD7705.create(2.5);

var v1;
var v2;

// sensor names:
const ph1 = {
  cs: 0,
  ch: ad7705.CHN_AIN1,
}
const ph2 = {
  cs: 0,
  ch: ad7705.CHN_AIN2,
}
const ph3 = {
  cs: 1,
  ch: ad7705.CHN_AIN1,
}
const ph4 = {
  cs: 1,
  ch: ad7705.CHN_AIN2,
}
const ph5 = {
  cs: 2,
  ch: ad7705.CHN_AIN1,
}
const ph6 = {
  cs: 2,
  ch: ad7705.CHN_AIN2,
}

ad7705.resetDevices();
ad7705.initDevices();
setInterval(function() {
  v1 = ad7705.readADResult(ph1.cs, ph1.ch);
  console.log('v1', v1);
}, READ_LOOP);

setTimeout(function () {
  setInterval(function () {
    v2 = ad7705.readADResult(ph2.cs, ph2.ch);
    console.log('v2', v2);
  }, READ_LOOP);
}, READ_LOOP/2);