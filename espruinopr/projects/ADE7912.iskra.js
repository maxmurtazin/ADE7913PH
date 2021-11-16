// const READ_LOOP = 533;
// let ADE7912 = require('ADE7912');
// let ade7912 = ADE7912.create();
//
// let v1;
// let v2;
//
// // sensor names:
// const ph1 = {
//   cs: 0,
// }
//
// const ph2 = {
//   cs: 1,
// }
//
// ade7912.resetDevices();
// ade7912.initDevices();
//
// setInterval(function() {
//   v1 = ade7912.readADResult(ph1.cs);
//   console.log('v1', v1);
// }, READ_LOOP);
//
// setTimeout(function () {
//   setInterval(function () {
//     v2 = ade7705.readADResult(ph2.cs);
//     console.log('v2', v2);
//   }, READ_LOOP);
// }, READ_LOOP)


// DEVICE EXAMPLE //

var ADE7912 = require('ADE7912');
var ade7912 = ADE7912.device({
  CSpin: B1,
  DRpin: C3
});
ad7705.readChannel(adE7912.CHN_AIN1);

CHANNEL EXAMPLE //

var ADE7912 = require('ADE7912');
var ch = AD7705.channel({
  CSpin: B1,
  DRpin: C3,
 // channel: 'CHN_AIN1'
});
ch.read()

// other configurable properties:
// clkdiv, polarity, gain, updateRate,
// SPI, mosiPin, misoPin, sckPin
