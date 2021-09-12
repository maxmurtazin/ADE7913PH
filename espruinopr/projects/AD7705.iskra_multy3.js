const READ_LOOP = 2*533;

var AD7705 = require('AD7705_multy3');
var ad7705 = AD7705.create(2.5);

var v1;
var v2;

var ph1;
var ph2;

ad7705.reset();
console.log('RESET');
//ad7705.init(ad7705.CHN_AIN1);
//console.log('INIT 1');
setInterval(function() {
  v1 = ad7705.readADResult(ad7705.CHN_AIN1);
  ph1 = 8.074*v1-9.884 ;
  console.log('v1', v1);
  console.log('ph1', ph1);
}, READ_LOOP);

setTimeout(function () {
  //ad7705.init(ad7705.CHN_AIN2);
 // console.log('INIT 2');
  setInterval(function () {
    v2 = ad7705.readADResult(ad7705.CHN_AIN2);
    ph2 = 8.074*v2-9.884 ; 
    console.log('v2', v2);
    console.log('ph2', ph2);
  }, READ_LOOP);
}, READ_LOOP/2);

// const READ_LOOP = 1533;

// var AD7705 = require('AD7705');
// var ad7705 = AD7705.create(2.5);

// ad7705.reset();
// ad7705.init(ad7705.CHN_AIN1, ad7705.GAIN_1, ad7705.UPDATE_RATE_50);
// ad7705.init(ad7705.CHN_AIN2, ad7705.GAIN_1, ad7705.UPDATE_RATE_50);

// ph1 = function CH1_read () {
//   ad7705.init(ad7705.CHN_AIN1, ad7705.GAIN_1, ad7705.UPDATE_RATE_50);
//   ad7705.getReady();
//   ph = (ad7705.readResult(ad7705.CHN_AIN1));
// };

// ph2 = function CH1_read () {
//   ad7705.init(ad7705.CHN_AIN2, ad7705.GAIN_1, ad7705.UPDATE_RATE_50);
//   ad7705.getReady();
//   ph = (ad7705.readResult(ad7705.CHN_AIN2));
// };

// setInterval(function() {
//   console.log(ph1, ph2);
// }, READ_LOOP);
