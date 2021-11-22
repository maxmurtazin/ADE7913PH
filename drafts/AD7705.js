// DEVICE EXAMPLE //

// var AD7705 = require('AD7705');
// var ad7705 = AD7705.device({
//   CSpin: B1,
//   DRpin: C3
// });
// ad7705.readChannel(ad7705.CHN_AIN1);

// CHANNEL EXAMPLE //

// var AD7705 = require('AD7705');
// var ch = AD7705.channel({
//   CSpin: B1,
//   DRpin: C3,
//   channel: 'CHN_AIN1'
// });
// ch.read()

// other configurable properties:
// clkdiv, polarity, gain, updateRate,
// SPI, mosiPin, misoPin, sckPin

// main constructor
var AD7705 = function (c) {
  c = c || {};

  this.VRef = c.vref || 2.5;
  this.CSpin = c.CSpin || B1;
  this.DRpin = c.DRpin || C3;
  this.SPI = c.SPI || SPI1;
  this.mosiPin = mosiPin || A7;
  this.misoPin = misoPin || A6;
  this.sckPin = sckPin || A5;
  this.uint8 = new Uint8Array(2);
};

// Channel constructor
var Channel = function(c) {
  *//this = new AD7705(c);
  var ch = 0;
  switch (c.channel) {
    case 'CHN_AIN2':
    case 1:
      ch = this.CHN_AIN2;
      break;
    case 'CHN_M1M1':
    case 2:
      ch = this.CHN_M1M1;
      break;
    case 'CHN_M1M2':
    case 3:
      ch = this.CHN_M1M2;
      break;
    case 'CHN_AIN1':
    case 0:
    default:
      ch = this.CHN_AIN1;
      break;
  }
  this.channel = ch;
};

// From AD7705 manual:

// Do nothing: write 1 to !DRDY

// setNextOperation:
// write 8 bit to communication reg, starting with 0
// !DRDY  RS2  RS1  RS0  R/!W  STBY  CH1  CH0
// 0      (register id)  1(R)  0     (ch sel)

// Channel selection ('channel' prop, ch sel):
AD7705.prototype.CHN_AIN1 = 0x0; // AIN1(+) AIN1(−)
AD7705.prototype.CHN_AIN2 = 0x1; // AIN2(+) AIN2(−)
AD7705.prototype.CHN_M1M1 = 0x2; // AIN1(−) AIN1(−)
AD7705.prototype.CHN_M1M2 = 0x3; // AIN1(−) AIN2(−)

// Register selection (register id):
AD7705.prototype.REG_CMM    = 0x0; // Communication register (8 bits)
AD7705.prototype.REG_SETUP  = 0x1; // Setup register (8 bits)
AD7705.prototype.REG_CLOCK  = 0x2; // Clock register (8 bits)
AD7705.prototype.REG_DATA   = 0x3; // Data register (16 bits)
AD7705.prototype.REG_TEST   = 0x4; // Test register (8 bits)
AD7705.prototype.REG_NOP    = 0x5; // No operation
AD7705.prototype.REG_OFFSET = 0x6; // Offset (zero-scale calibration) register (24 bits)
AD7705.prototype.REG_GAIN   = 0x7; // Gain (full-scale calibration) register (24 bits)

// Setup Register Description:
// MD1  MD0  G2  G1  G0  !B/U  BUF  FSYNC
// (modesel) (gain sel)  (pol) 1    0

// Operating Mode Options (modesel):
AD7705.prototype.MODE_NORMAL         = 0x0; // normal mode
AD7705.prototype.MODE_SELF_CAL       = 0x1; // self-calibration -carry w.
AD7705.prototype.MODE_ZERO_SCALE_CAL = 0x2; // zero-scale system calibration, POR 0x1F4000, set FSYNC high before calibration, FSYNC low after calibration
AD7705.prototype.MODE_FULL_SCALE_CAL = 0x3; // full-scale system calibration, POR 0x5761AB, set FSYNC high before calibration, FSYNC low after calibration

// Gain selection ('gain' prop, gain sel):
AD7705.prototype.GAIN_1 = 0x0;
AD7705.prototype.GAIN_2 = 0x1;
AD7705.prototype.GAIN_4 = 0x2;
AD7705.prototype.GAIN_8 = 0x3;
AD7705.prototype.GAIN_16 = 0x4;
AD7705.prototype.GAIN_32 = 0x5;
AD7705.prototype.GAIN_64 = 0x6;
AD7705.prototype.GAIN_128 = 0x7;

// Bipolar/Unipolar Operation ('polarity' prop, pol):
AD7705.prototype.BIPOLAR = 0x0;
AD7705.prototype.UNIPOLAR = 0x1;

// Clock Register Description:
// ZERO  ZERO  ZERO  CLKDIS  CLKDIV  CLK  FS1  FS0
// 0     0     0     disable clkdiv  (clock+filter)

// Output Update Rates ('updateRate' prop, clock+filter):
AD7705.prototype.UPDATE_RATE_20  = 0x0; // 20 Hz   Low-freq quartz
AD7705.prototype.UPDATE_RATE_25  = 0x1; // 25 Hz   Low-freq quartz
AD7705.prototype.UPDATE_RATE_100 = 0x2; // 100 Hz  Low-freq quartz
AD7705.prototype.UPDATE_RATE_200 = 0x3; // 200 Hz  Low-freq quartz
AD7705.prototype.UPDATE_RATE_50  = 0x4; // 50 Hz  High-freq quartz
AD7705.prototype.UPDATE_RATE_60  = 0x5; // 60 Hz  High-freq quartz
AD7705.prototype.UPDATE_RATE_250 = 0x6; // 250 Hz High-freq quartz
AD7705.prototype.UPDATE_RATE_500 = 0x7; // 500 Hz High-freq quartz

// Clock devider ('clkdiv' prop):
AD7705.prototype.CLK_DIV_1 = 0x1;
AD7705.prototype.CLK_DIV_2 = 0x2;

// METHODS:

AD7705.prototype.setNextOperation = function(
  reg,
  channel,
  readWrite) {
  this.uint8[0] = reg << 4 | readWrite << 3 | channel;
  this.SPI.send(this.uint8[0], this.CSpin);
};

AD7705.prototype.writeClockRegister = function( // manual p.19
  CLKDIS, 
  CLKDIV, 
  outputUpdateRate) {
  this.uint8[0] = CLKDIS << 4 | CLKDIV << 3 | outputUpdateRate;
  this.uint8[0] &= ~(1 << 2); // clear CLK
  this.SPI.send(this.uint8[0], this.CSpin);
};

AD7705.prototype.writeSetupRegister = function(
  operationMode,
  gain,
  polarity,
  buffered,
  fsync) {
  this.uint8[0] = (operationMode << 6) | (gain << 3) | (polarity << 2) | (buffered << 1) | fsync;
  this.SPI.send(this.uint8[0], this.CSpin);
};

AD7705.prototype.getReady = function (dev) {
  while (digitalRead(this.DRpin)==0);
};

AD7705.prototype.dataReady = function(
  channel) {
  this.setNextOperation(this.REG_CMM, channel, 1);
  this.uint8[0] = this.SPI.send(0x0, this.CSpin);
  return (this.uint8[0] & 0x80) == 0x0;
};

AD7705.prototype.readDataRegister = function() {
  this.uint8 = this.SPI.send([0x00, 0x00], this.CSpin);
  var r = this.uint8[0] << 8 | this.uint8[1];
  var r = this.uint8[0] << 8 | this.uint8[1];
  console.log('r',r)
  return r;
};

AD7705.prototype.readChannelRaw = function(
  channel) {
  while (!this.dataReady(channel));
  this.setNextOperation(REG_DATA, channel, 1);
  this.getReady();
  return this.readDataRegister();
};

AD7705.prototype.readChannel = function(
  channel,
  refOffset=0) {
  return this.readChannelRaw(channel) * 1.0 / 65536.0 * this.VRef - refOffset;
  // return (this.readChannelRaw(dev, channel) - 32768) * 1.0 / 32768.0 * this.VRef;
};

AD7705.prototype.reset = function() {
  for (let i = 0; i < 10; i++) {
    this.SPI.send(0xff, this.CSpin);
  }
};

AD7705.prototype.init = function(
  channel,
  clkDivider,
  polarity,
  gain,
  updRate) {
  this.SPI.setup({
    mosi: this.mosiPin,
    miso: this.misoPin,
    sck: this.sckPin,
    mode: 3,
    baud: 9000,
    order: 'msb'});

  this.setNextOperation(this.REG_CLOCK, channel, 0);
  this.writeClockRegister(0, 1, updRate);
  this.setNextOperation(this.REG_SETUP, channel, 0);
  this.writeSetupRegister(MODE_SELF_CAL, gain, polarity, 0, 1); // FSYNC high before calibration
  this.setNextOperation(this.REG_SETUP, channel, 0);
  this.writeSetupRegister(this.MODE_SELF_CAL, gain, polarity, 0, 0); // FSYNC low after calibration
  while (!this.dataReady(channel));
  this.getReady();
};

Channel.prototype.read = function(refOffset=0) {
  return this.readChannel(this.channel, refOffset)
};

// new instances //

exports.device = function(c) {
  c = c || {};
  var ad = new AD7705(c);

  ad.reset();

  ad.init(
    ad.CHN_AIN1,
    c.clkdiv || ad. CLK_DIV_1,
    c.polarity || ad.UNIPOLAR,
    c.gain || ad.GAIN_1,
    c.updateRate || ad.UPDATE_RATE_50);

  ad.init(
    ad.CHN_AIN2,
    c.clkdiv || ad. CLK_DIV_1,
    c.polarity || ad.UNIPOLAR,
    c.gain || ad.GAIN_1,
    c.updateRate || ad.UPDATE_RATE_50);

  return ad;
};

exports.channel = function(c) {
  c = c || {};
  var ch = new Channel(c);

  ch.reset();

  ch.init(
    ch.channel,
    c.clkdiv || ch. CLK_DIV_1,
    c.polarity || ch.UNIPOLAR,
    c.gain || ch.GAIN_1,
    c.updateRate || ch.UPDATE_RATE_50);

  return ch;
};
