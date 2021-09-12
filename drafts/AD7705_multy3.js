//wiring//project n0 minification, module-closure online-whitespace only;
//const CSpin = [B11, B10]; //select chip
const CSpin = [B11, B10, B1]; //select chip
///////////1chip - P0/2chip - P1/3chip - P5//////////

//const DRpin = C3; //data ready pin

const DRpin = [C3, C2, B0]; //data ready pin
////////////1chip- C3-(P4)//2chip - C2(P7)// 3chip - B0(P6) //

SPI1.setup({mosi:A7, miso:A6, sck:A5, mode:3, baud: 9000, order:'msb'});//SPI setup
///////////1chip - A7-(P3)// 2chip - A6-(P2)//3chip - A5-(A5)//////////////////

//SPI.setup({mosi:C6, miso:C2, sck:A4});//SPI setup

var uint8de1 = new Uint8Array(2); //1dev

var uint8de2 = new Uint8Array(2); //2dev

var uint8de3 = new Uint8Array(2); //3dev

// Do nothing: write 1 to !DRDY

// setNextOperation:
// write 8 bit to communication reg, starting with 0
// !DRDY  RS2  RS1  RS0  R/!W  STBY  CH1  CH0
// 0      (register id)  1(R)  0     (ch sel)

// Channel selection (ch sel):
const CHN_AIN1 = 0x0; // AIN1(+) AIN1(−) dev1
const CHN_AIN2 = 0x1; // AIN2(+) AIN2(−) dev1

// const CHN_AIN3 = 0x0; // AIN1(+) AIN1(−) dev2
// const CHN_AIN4 = 0x1; // AIN2(+) AIN2(−) dev2
//
// const CHN_AIN5 = 0x0; // AIN1(+) AIN1(−) dev3
// const CHN_AIN6 = 0x1; // AIN2(+) AIN2(−) dev3


const CHN_M1M1 = 0x2; // AIN1(−) AIN1(−)
const CHN_M1M2 = 0x3; // AIN1(−) AIN2(−)

// Register selection (register id):
const REG_CMM    = 0x0; // Communication register (8 bits)
const REG_SETUP  = 0x1; // Setup register (8 bits)
const REG_CLOCK  = 0x2; // Clock register (8 bits)
const REG_DATA   = 0x3; // Data register (16 bits)
const REG_TEST   = 0x4; // Test register (8 bits)
const REG_NOP    = 0x5; // No operation
const REG_OFFSET = 0x6; // Offset (zero-scale calibration) register (24 bits)
const REG_GAIN   = 0x7; // Gain (full-scale calibration) register (24 bits)

// Setup Register Description:
// MD1  MD0  G2  G1  G0  !B/U  BUF  FSYNC
// (modesel) (gain sel)  (pol) 1    0

// Operating Mode Options (modesel):
const MODE_NORMAL         = 0x0; // normal mode
const MODE_SELF_CAL       = 0x1; // self-calibration -carry w.
const MODE_ZERO_SCALE_CAL = 0x2; // zero-scale system calibration, POR 0x1F4000, set FSYNC high before calibration, FSYNC low after calibration
const MODE_FULL_SCALE_CAL = 0x3; // full-scale system calibration, POR 0x5761AB, set FSYNC high before calibration, FSYNC low after calibration

// Gain selection (gain sel):
const GAIN_1 = 0x0;
const GAIN_2 = 0x1;
const GAIN_4 = 0x2;
const GAIN_8 = 0x3;
const GAIN_16 = 0x4;
const GAIN_32 = 0x5;
const GAIN_64 = 0x6;
const GAIN_128 = 0x7;

// Bipolar/Unipolar Operation (pol):
const BIPOLAR = 0x0;
const UNIPOLAR = 0x1;

// Clock Register Description:
// ZERO  ZERO  ZERO  CLKDIS  CLKDIV  CLK  FS1  FS0
// 0     0     0     disable divider (clock+filter)

// Output Update Rates (clock+filter):
const UPDATE_RATE_20  = 0x0; // 20 Hz   Low-freq quartz
const UPDATE_RATE_25  = 0x1; // 25 Hz   Low-freq quartz
const UPDATE_RATE_100 = 0x2; // 100 Hz  Low-freq quartz
const UPDATE_RATE_200 = 0x3; // 200 Hz  Low-freq quartz
const UPDATE_RATE_50  = 0x4; // 50 Hz  High-freq quartz
const UPDATE_RATE_60  = 0x5; // 60 Hz  High-freq quartz
const UPDATE_RATE_250 = 0x6; // 250 Hz High-freq quartz
const UPDATE_RATE_500 = 0x7; // 500 Hz High-freq quartz

const CLK_DIV_1 = 0x1;
const CLK_DIV_2 = 0x2;

// Test register -- don't touch! Always 0x0
// Offset (zero-scale calibration) register...
// Gain (full-scale calibration) register...
// Calibration Sequences...

// main constructor
var AD7705 = function (vref) {
  this.CSpin = CSpin;
  this.DRpin = DRpin;
  this.CHN_AIN1 = CHN_AIN1;
  this.CHN_AIN2 = CHN_AIN2;
  this.CHN_M1M1 = CHN_M1M1;
  this.CHN_M1M2 = CHN_M1M2;
  this.REG_CMM   = REG_CMM;
  this.REG_SETUP = REG_SETUP;
  this.REG_CLOCK = REG_CLOCK;
  this.REG_DATA  = REG_DATA;
  this.REG_TEST  = REG_TEST;
  this.REG_NOP   = REG_NOP;
  this.REG_OFFSET= REG_OFFSET;
  this.REG_GAIN  = REG_GAIN;
  this.MODE_NORMAL         = MODE_NORMAL;
  this.MODE_SELF_CAL       = MODE_SELF_CAL;
  this.MODE_ZERO_SCALE_CAL = MODE_ZERO_SCALE_CAL;
  this.MODE_FULL_SCALE_CAL = MODE_FULL_SCALE_CAL;
  this.GAIN_1 = GAIN_1;
  this.GAIN_2 = GAIN_2;
  this.GAIN_4 = GAIN_4;
  this.GAIN_8 = GAIN_8;
  this.GAIN_16 = GAIN_16;
  this.GAIN_32 = GAIN_32;
  this.GAIN_64 = GAIN_64;
  this.GAIN_128 = GAIN_128;
  this.UNIPOLAR = UNIPOLAR;
  this.BIPOLAR = BIPOLAR;
  this.UPDATE_RATE_20 = UPDATE_RATE_20;
  this.UPDATE_RATE_25 = UPDATE_RATE_25;
  this.UPDATE_RATE_100 = UPDATE_RATE_100;
  this.UPDATE_RATE_200 = UPDATE_RATE_200;
  this.UPDATE_RATE_50 = UPDATE_RATE_50;
  this.UPDATE_RATE_60 = UPDATE_RATE_60;
  this.UPDATE_RATE_250 = UPDATE_RATE_250;
  this.UPDATE_RATE_500 = UPDATE_RATE_500;
  this.CLK_DIV_1 = CLK_DIV_1;
  this.CLK_DIV_2 = CLK_DIV_2;
  this.VRef = vref;
};

AD7705.prototype.setNextOperation = function(
  reg,
  channel,
  readWrite) {
  uint8de1[0] = reg << 4 | readWrite << 3 | channel;
  uint8de2[0] = reg << 4 | readWrite << 3 | channel;
  uint8de3[0] = reg << 4 | readWrite << 3 | channel;

  console.log('setNextOperation_dev1',uint8de1[0].toString(2)); //1dev
  console.log('setNextOperation_dev1',uint8de2[0].toString(2)); //2dev
  console.log('setNextOperation_dev1',uint8de3[0].toString(2)); //3dev

  // digitalWrite(CSpin[0], 0);
  console.log('setNextOperation SPI1.send reply dev1', SPI1.send(uint8de1[0], CSpin[0])); //1dev
  console.log('setNextOperation SPI1.send reply dev2', SPI1.send(uint8de2[0], CSpin[1])); // 2dev
  console.log('setNextOperation SPI1.send reply dev3' ,SPI1.send(uint8de3[0], CSpin[2])); //3dev
  // digitalWrite(CSpin[0], 1);
};

AD7705.prototype.writeClockRegister = function(
  CLKDIS, 
  CLKDIV, 
  outputUpdateRate) {
  uint8de1[0] = CLKDIS << 4 | CLKDIV << 3 | outputUpdateRate; //1dev
  uint8de2[0] = CLKDIS << 4 | CLKDIV << 3 | outputUpdateRate; //2dev
  uint8de3[0] = CLKDIS << 4 | CLKDIV << 3 | outputUpdateRate; //3dev
//////////////////////////////////////////////
  uint8de1[0] &= ~(1 << 2); // clear CLK
  uint8de2[0] &= ~(1 << 2); // clear CLK
  uint8de3[0] &= ~(1 << 2); //

  // digitalWrite(CSpin[0], 0);
///////////////////////
  console.log('writeClockRegister SPI1.send reply dev1', SPI1.send(uint8de1[0], CSpin[0]));//1dev
  console.log('writeClockRegister SPI1.send reply dev2', SPI1.send(uint8de2[0], CSpin[1]));//2dev
  console.log('writeClockRegister SPI1.send reply dev3' , SPI1.send(uint8de3[0], CSpin[2]));//3dev
  // digitalWrite(CSpin[0], 1);
};

AD7705.prototype.writeSetupRegister = function(
  operationMode,
  gain,
  polarity,
  buffered,
  fsync) {
  uint8de1[0] = (operationMode << 6) | (gain << 3) | (polarity << 2) | (buffered << 1) | fsync;
  uint8de2[0] = (operationMode << 6) | (gain << 3) | (polarity << 2) | (buffered << 1) | fsync;
  uint8de3[0] = (operationMode << 6) | (gain << 3) | (polarity << 2) | (buffered << 1) | fsync;

  console.log('uint8[0]de1',uint8de1[0].toString(2)); //dev1
  console.log('uint8[0]de2',uint8de2[0].toString(2)); //dev2
  console.log('uint8[0]de3',uint8de3[0].toString(2)); //dev3

  // digitalWrite(CSpin[0], 0);
  console.log('writeSetupRegister SPI1.send reply dev1', SPI1.send(uint8de1[0], CSpin[0])); //1dev
  console.log('writeSetupRegister SPI1.send reply dev2', SPI1.send(uint8de2[0], CSpin[1])); //2dev
  console.log('writeSetupRegister SPI1.send reply dev3', SPI1.send(uint8de3[0], CSpin[2])); //3dev
  // digitalWrite(CSpin[0], 1);
};

AD7705.prototype.getReady = function () {
  while (digitalRead(DRpin[0])==0, digitalRead(DRpin[1])==0, digitalRead(DRpin[2])==0);

};

AD7705.prototype.dataReady = function(
  channel) {
  this.setNextOperation(REG_CMM, channel, 1);

  // digitalWrite(CSpin[0], 0);
  uint8de1[0] = SPI1.send(0x0, CSpin[0]);
  uint8de2[0] = SPI1.send(0x0, CSpin[1]);
  uint8de3[0] = SPI1.send(0x0, CSpin[2]);
  console.log('dataReady uint8de1[0]', uint8de1[0]);
  console.log('dataReady uint8de2[0]', uint8de2[0]);
  console.log('dataReady uint8de3[0]', uint8de3[0]);
  // digitalWrite(CSpin[0], 1);

  return (uint8de1[0] & 0x80) == 0x0;
  //return (uint8de2[0] & 0x80) == 0x0;
  // return (uint8de3[0] & 0x80) == 0x0;

};

AD7705.prototype.readADResultFull = function() {
  // digitalWrite(CSpin[0], 0);
  uint8de1 = SPI1.send([0xff, 0xff], CSpin[0]);
  uint8de2 = SPI1.send([0xff, 0xff], CSpin[1]);
  uint8de3 = SPI1.send([0xff, 0xff], CSpin[2]);
  // uint8[0] = SPI1.send(0xff, CSpin[0]);
  // uint8[1] = SPI1.send(0xff, CSpin[0]);
  // digitalWrite(CSpin[0], 1);
  console.log('readADResultFull uint8de1', uint8de1[0].toString(2), uint8de1[1].toString(2));
  console.log('readADResultFull uint8de2', uint8de2[0].toString(2), uint8de2[1].toString(2));
  console.log('readADResultFull uint8de3', uint8de3[0].toString(2), uint8de3[1].toString(2));

  var r1 = uint8de1[0] << 8 | uint8de1[1];
  console.log('r1',r1);

  var r2 = uint8de2[0] << 8 | uint8de2[1];
  console.log('r2',r2);

  var r3 = uint8de3[0] << 8 | uint8de2[1];
  console.log('r3',r3);

  var r = [r1,r2,r3];
  return r; // return 1,2, 3

};

AD7705.prototype.readADResultRaw = function(
  channel) {
  while (!this.dataReady(channel));
  this.setNextOperation(REG_DATA, channel, 1);

  return this.readADResultFull();
};

AD7705.prototype.readADResult = function(
  channel,
  refOffset=0) {
  return this.readADResultRaw(channel) * 1.0 / 65536.0 * this.VRef - refOffset;
  // return (this.readADResultRaw(channel) - 32768) * 1.0 / 32768.0 * this.VRef;
};

AD7705.prototype.reset = function() {
  // digitalWrite(CSpin[0], 0);
  for (i = 0; i < 10; i++) {
    console.log('reset SPI1.send reply', SPI1.send(0xff, CSpin[0]));
  }
  // digitalWrite(CSpin[0], 1);
};

AD7705.prototype.fullInit = function(
  channel,
  clkDivider,
  polarity,
  gain,
  updRate) {
  this.setNextOperation(REG_CLOCK, channel, 0);
  this.writeClockRegister(0, 1, updRate);
  this.setNextOperation(REG_SETUP, channel, 0);
  this.writeSetupRegister(MODE_SELF_CAL, gain, polarity, 0, 1); // FSYNC high before calibration
  this.setNextOperation(REG_SETUP, channel, 0);
  this.writeSetupRegister(MODE_SELF_CAL, gain, polarity, 0, 0); // FSYNC low after calibration
  this.getReady();
  while (!this.dataReady(channel));
}

AD7705.prototype.init = function(
  channel) {
  this.fullInit(channel, CLK_DIV_1, UNIPOLAR, GAIN_1, UPDATE_RATE_50);
}

exports.create = function(vref) {
  return new AD7705(vref);
};
