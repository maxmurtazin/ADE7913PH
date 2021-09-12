//ISKRA JS//
//ADE7912 one voltage input, 3.3 V -VDD;
//six device, two crystal 4 MHz, 10pins
//3st - crystal 1, 6st -crystal 2;
//CSpins
// one group
// 1st- B11(P0)
// 2st - B10(P1) 
// 3st- C3(P4)
// two group
// 4st - B1(P5) 
// 5st- B0(P6)
// 6st - C2(P7) 

// DRpin _ 1st dev - C7 (P9)
// DRpin _ 4st dev - C6 (P8)

//SCLK - A5 (A5)
// MISO - A7 (P3) - pull out 10KOhm resistor to 3.3 V
// MOSI - A6 (P2)
//////////////////////////////////
//one device
//crystal 4 MHz, 14-13 pins dev ADE7912
//CS- B11(P0)
//SCLK - A5 (A5)
// MISO - A7 (P3) - pull out 10KOhm resistor to 3.3 V
// MOSI - A6 (P2)
 //DRpin _ 1st dev - C7 (P9)
const CSpin = B11; //select chip 
const DRpin = C7; //data ready pin

SPI1.setup({mosi:A7, miso:A6, sck:A5, mode:3, baud: 9000, order:'msb'});//SPI setup

//Command Definitions
//DEFINE COMMAND BYTES FOR ADE7913 5-bit address. reads end 100:
const STATUS0_READ      =(0x9  << 3 | 0b100);
const CONFIG_READ       =(0x8  << 3 | 0b100);
const TEMPOS_READ       =(0x18 << 3 | 0b100);
const IWV_READ          =(0x0  << 3 | 0b100);  // Also starts 'burst' read of (IWV, V1WV, V2WV, ADC_CRC, STATUS0, CNT_SNAPSHOT)
const EMI_CTRL_READ     =(0xE  << 3 | 0b100);
const V1WV_READ         =(0x1  << 3 | 0b100);
const V2WV_READ         =(0x2  << 3 | 0b100);
const ADC_CRC_READ      =(0x4  << 3 | 0b100);
const CNT_SNAPSHOT_READ =(0x7  << 3 | 0b100);

// writes end 000:
const CONFIG_WRITE     =(0x8 << 3 | 0b000);
const EMI_CTRL_WRITE   =(0xE << 3 | 0b000);
const SYNC_SNAP_WRITE  =(0xB << 3 | 0b000);
const LOCK_KEY_WRITE   =(0xA << 3 | 0b000);

// miscelaneous bytes:
// miscelaneous bytes:
const DUMMY_MSG       = 0x00;              // Unused argument to SPI.Transfer()
const LOCK_BYTE       = 0xCA;
const UNLOCK_BYTE     = 0x9C;

// Settings for writing updates to serial, and ADE7913 syncing:
// define as volatile all variables to be updated from iterrupt service routine
const writePeriodMillis = 2000;
const syncPeriodMillis = 10000;
var previousWriteMillis = 0;
var previousSyncMillis = 0;
const rdDelayMicros  = 0;
const nMaxWriteTry = 100;
var microsForBurstRead;
var microsBetweenReads;
var microsPreviousRead;

// Local copies of ADC readings, updated on dataReady interrupt
var long nReads = 0;
// var threeByteWord = IWV;
// var threeByteWord = V1WV;
// var threeByteWord = V2WV;
var readIWV = []; //IWV
var readV1WV = [];// V1WV
var readV2WV = []; //V2WV

var ADC_CRC = new Array(2);
var STATUS0 =new Array(1);
var CNT_SNAPSHOT = new Array(2);
var ADC_CRC_burst = new Array(2);
var CONFIG = new Array(1);
var TEMPOS = new Array(1);
var EMI_CTRL = new Array(1);
///////////////////////////////////////
var AD7912 = function (vref) {

this.CSpin = CSpin;
this.DRpin = DRpin;

this.STATUS0_READ      =STATUS0_READ;
this.CONFIG_READ       =CONFIG_READ;
this.TEMPOS_READ       =TEMPOS_READ;
this.IWV_READ          =IWV_READ;  // Also starts 'burst' read of (IWV, V1WV, V2WV, ADC_CRC, STATUS0, CNT_SNAPSHOT)
this.EMI_CTRL_READ     =EMI_CTRL_READ;
this.V1WV_READ         =V1WV_READ;
this.V2WV_READ         =V2WV_READ;
this.ADC_CRC_READ      =ADC_CRC_READ;
this.CNT_SNAPSHOT_READ =CNT_SNAPSHOT_READ;

// writes end 000:
this.CONFIG_WRITE     =CONFIG_WRITE;
this.EMI_CTRL_WRITE   =EMI_CTRL_WRITE;
this.SYNC_SNAP_WRITE  =SYNC_SNAP_WRITE;
this.LOCK_KEY_WRITE   =LOCK_KEY_WRITE;

// miscelaneous bytes:
// miscelaneous bytes:
this.DUMMY_MSG       = DUMMY_MSG;              // Unused argument to SPI.Transfer()
this.LOCK_BYTE       = LOCK_BYTE;
this.UNLOCK_BYTE     = UNLOCK_BYTE;

this.VRef = vref;
};
// METHODS:
//initialize the ADE7912 
AD7912.prototype.init = function() {

   detachInterrupt(digitalPinToInterrupt(DRpin));///
   SPI1.setup({mosi:A7, miso:A6, sck:A5, mode:3, baud: 9000, order:'msb'});
   digitalWrite(CSpin, 1);
   this.readMultBytesADE7912(STATUS0_READ, STATUS0, 1);
   this.writeADE7912(LOCK_KEY_WRITE, UNLOCK_BYTE);
   this.writeADE7912_check(CONFIG_WRITE, 0b00001000, CONFIG_READ);
   this.readMultBytesADE7912(CONFIG_READ, CONFIG, 1);
   this.readMultBytesADE7912(TEMPOS_READ, TEMPOS, 1);
   this.writeADE7912_check(EMI_CTRL_WRITE, 0b01010101, EMI_CTRL_READ);
   this.readMultBytesADE7912(EMI_CTRL_READ, EMI_CTRL, 1);
   this.writeADE7912(SYNC_SNAP_WRITE, 0b00000001);
   this.writeADE7912(LOCK_KEY_WRITE, LOCK_BYTE);
};
//////////////////////////////////////////////////////////////
AD7912.prototype.readMultBytesADE7912 = function(readFrom,  
  readTo[],  nBytes) {
  var idx = nBytes - 1;                  // fill up bytes from end first
  digitalWrite(CSpin, 0);
  SPI1.send(readFrom);
  while (idx >= 0) {
    readTo[idx] = SPI1.send(DUMMY_MSG);
    idx--;
  }
  digitalWrite(CSpin, 1);
   
};

//////////////////////////////////////////////////////////////
AD7912.prototype.writeADE7912 = function(writeTo, writeMsg) {
  digitalWrite(CSpin, 0);
  SPI1.send(writeTo);
  SPI1.send(writeMsg);
  digitalWrite(CSpin, 1);
};

///////////////////////////////////////////////////////////////////
AD7912.prototype.writeADE7912_check = function(writeTo, 
writeMsg, readFrom) {
  var success = false;
  var nTry = 0;
  do {
    digitalWrite(CSpin, 0);
    SPI1.send(writeTo);
    SPI1.send(writeMsg);
    digitalWrite(CSpin, 1);
    
    // Read-back register to confirm write success
    var readBack[1];
    this.readMultBytesADE7912(readFrom, readBack, 1);
    success = (readBack[0] == writeMsg);
    nTry++;
  } while ((!success) && nTry < nMaxWriteTry);
  return success; 
};
///////////////////////////////////////////////////////////
AD7912.prototype.syncADE7912  = function (){
  // Unlock the config registers:
  this.writeADE7912(LOCK_KEY_WRITE, UNLOCK_BYTE);
  // Broadcast Sync (write 0x01 to SYNC_SNAP):
  // (this step will need to be cleverer when using multiple chips)
  this.writeADE7912(SYNC_SNAP_WRITE, 0b00000001);
  // Relock the registers:
  this.writeADE7912(LOCK_KEY_WRITE, LOCK_BYTE);
};
/////////////////////////////////////////////////////
AD7912.prototype.writeSuccessOne = function () {
  writeADE7913_check(CONFIG_WRITE, 0b00001000, CONFIG_READ);
  readMultBytesADE7913(CONFIG_READ, CONFIG, 1);
};

AD7912.prototype.writeSuccessTwo = function () {
  writeADE7913_check(EMI_CTRL_WRITE, 0b01010101, EMI_CTRL_READ);
  readMultBytesADE7913(EMI_CTRL_READ, EMI_CTRL, 1);
};

/////////////////////////////////////////////////////////////////
//AD7912.prototype.read = function (addr)
AD7912.prototype.read = function ()
{
  // take the SS pin low to select the chip:
  digitalWrite(CSpin,0);
  //  send in the address and value via SPI:
  SPI1.send(0x04); // which register to reac 0x04 = burst mode
  
  read1[0] = SPI1.send(0x00);
  read1[1] = SPI1.send(0x00);
  read1[2] = SPI1.send(0x00);
  
  read2[0] = SPI1.send(0x00);
  read2[1] = SPI1.send(0x00);
  read2[2] = SPI1.send(0x00);
    
  read3[0] = SPI1.send(0x00);
  read3[1] = SPI1.send(0x00);
  read3[2] = SPI1.send(0x00);

 
  // take the SS pin high to de-select the chip:
  digitalWrite(CSpin,1); 
 
  
   console.log ("IWV= ");
   console.log (read1);
  // console.log(read1[0].toString(2),
  // read1[1].toString(2),
  // read1[2].toString(2)) 

   console.log ("V1WV= ");
   console.log(read2);
  //  console.log(read2[0].toString(2),
  // read2[1].toString(2),
  // read2[2].toString(2)) 
   
  
    console.log("V2WV= ");
   console.log(read3);
  //  console.log(read3[0].toString(2),
  // read3[1].toString(2),
  // read3[2].toString(2)) 

value = SPI1.send(DUMMY_MSG);  // LS Byte
digitalWrite(CSpin, 1);


//value = (((tempValue1 <<16)|(tempValue2 <<8)|value)<<8)/ 0x100;
//value = (value - ADE791X_OFFSET_V1WV)*ADE791X_MUL_V1WV; //ADE791X_MUL_V1WV;
//value = (value - 362760.0)*0.006485; //ADE791X_MUL_V1WV;
console.log ('value', value);
console.log ('value_bin', value.toString(2));
return value;
};



exports.create = function(vref) {
  return new AD7912(vref);
};

