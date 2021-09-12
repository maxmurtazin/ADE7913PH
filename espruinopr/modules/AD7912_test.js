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
const CSpin = [B11, B10]; //select chip
const DRpin = C7; //data ready pin

//var  threeByteWord = Uint32Array(4);//

// union threeByteWord
// {
//   int32_t value;
//   byte bytes[4];
// };

SPI1.setup({mosi:A7, miso:A6, sck:A5, mode:3, baud: 9000, order:'msb'});//SPI setup

//Command Definitions
const ADE791X_READ    =0x04;
const ADE791X_WRITE   =0x00;

// Register Definitions
const ADE791X_REG_IWV            =0x00;    /* Instantaneous value of Current I. */
const ADE791X_REG_V1WV           =0x01;    /* Instantaneous value of Voltage V1 */
const ADE791X_REG_V2WV           =0x02;    /* Instantaneous value of Voltage V2 */
const ADE791X_MUL_V1WV           =0.006485; //For V1WV 5,320,000 reading = 34.5V  (Multiplier = 0.006485) mV
const ADE791X_OFFSET_V1WV        =362760;
const ADE791X_MUL_VIMWV          =0.0011901;
const ADE791X_OFFSET_VIMWV       =349319;
const ADE791X_MUL_IWV            =0.0005921;
const ADE791X_OFFSET_IWV         =349319;

const ADE791X_REG_ADC_CRC        =0x04;    /* CRC value of IWV, V1WV, and V2WV registers. See the ADC Output Values CRC section for details */
const ADE791X_REG_CTRL_CRC       =0x05;    /* CRC value of configuration registers. See the CRC of Configuration Registers  for details. */

const ADE791X_REG_CNT_SNAPSHOT   =0x07;    /* Snapshot value of the counter used in synchronization operation. */
const ADE791X_REG_CONFIG         =0x08;    /* Configuration register. See Table 15 for details */
const ADE791X_REG_STATUS0        =0x09;    /* Status register */
const ADE791X_REG_LOCK           =0x0A;    /* Memory protection register */
const ADE791X_REG_SYNC_SNAP      =0x0B;    /* Synchronization register */
const ADE791X_REG_COUNTER0       =0x0C;    /* Contains the least significant eight bits of the internal synchronization counter */
const ADE791X_REG_COUNTER1       =0x0D;    /* COUNTER1[3:0] bits contain the most significant four bits of the internal synchronization counter */
const ADE791X_REG_EMI_CTRL       =0x0E;    /* EMI control register. */
const ADE791X_REG_STATUS1        =0x0F;    /* Status register */

const ADE791X_REG_TEMPOS         =0x18;    /* Temperature sensor offset */

/* configuration register constants */
const CLKOUT_EN                  =0x01;
const PWRDWN_EN                  =0x04;    /* Shuts down the dc-to-dc converter. When PWRDWN_EN = 0, the default value, the */
const TEMP_EN                    =0x08;    /* This bit selects the second voltage channel measurement. */
const ADC_FREQ_8KHZ              =0x00;    /* These bits select the ADC output frequency to 8khz. */
const ADC_FREQ_4KHZ              =0x10;    /* These bits select the ADC output frequency.4khz */
const ADC_FREQ_2KHZ              =0x20;    /* These bits select the ADC output frequency.2khz */
const ADC_FREQ_1KHZ              =0x30;    /* These bits select the ADC output frequency.1khz */
const SWRST                      =0x40;    /* When this bit is set to 1, a software reset is initiated. This bit clears itself to 0 after */
const BW                         =0x80;    /* Selects the bandwidth of the digital low-pass filter of the ADC. When BW = 0, the */

const RESET_ON                   =0x00;
const CRC_STAT                   =0x01;
const IC_PROT                    =0x02;

/* lock register constants(address 0xA */
const LOCKED                     =0xCA;   /*locks configuration register writing */
const UNLOCKED                   =0x9C;    /*unlocks configuration register writing */


var AD7912 = function (vref) {

//c = c || {};
this.CSpin = CSpin;
this.DRpin = DRpin;
this.ADE791X_READ    =ADE791X_READ;
this.ADE791X_WRITE   =ADE791X_WRITE;
// this.SPI = c.SPI || SPI1;
// this.mosiPin = mosiPin || A7;
// this.misoPin = misoPin || A6;
// this.sckPin = sckPin || A5;


this.ADE791X_REG_IWV            =ADE791X_REG_IWV;    /* Instantaneous value of Current I. */
this.ADE791X_REG_V1WV           =ADE791X_MUL_VIMWV;    /* Instantaneous value of Voltage V1 */
this.ADE791X_REG_V2WV           =ADE791X_REG_V2WV;    /* Instantaneous value of Voltage V2 */
this.ADE791X_MUL_V1WV           =ADE791X_MUL_VIMWV; //For V1WV 5,320,000 reading = 34.5V  (Multiplier = 0.006485) mV
this.ADE791X_OFFSET_V1WV        =ADE791X_OFFSET_V1WV;
this.ADE791X_MUL_VIMWV          =ADE791X_MUL_VIMWV;
this.ADE791X_OFFSET_VIMWV       =ADE791X_OFFSET_VIMWV ;
this.ADE791X_MUL_IWV            =ADE791X_MUL_IWV;
this.ADE791X_OFFSET_IWV         =ADE791X_OFFSET_IWV;

this.ADE791X_REG_ADC_CRC        =ADE791X_REG_ADC_CRC;    /* CRC value of IWV, V1WV, and V2WV registers. See the ADC Output Values CRC section for details */
this.ADE791X_REG_CTRL_CRC       =ADE791X_REG_CTRL_CRC ;    /* CRC value of configuration registers. See the CRC of Configuration Registers  for details. */

this.ADE791X_REG_CNT_SNAPSHOT   =ADE791X_REG_CNT_SNAPSHOT;    /* Snapshot value of the counter used in synchronization operation. */
this.ADE791X_REG_CONFIG         =ADE791X_REG_CONFIG  ;    /* Configuration register. See Table 15 for details */
this.ADE791X_REG_STATUS0        =ADE791X_REG_STATUS0 ;    /* Status register */
this.ADE791X_REG_LOCK           =ADE791X_REG_LOCK;    /* Memory protection register */
this.ADE791X_REG_SYNC_SNAP      =ADE791X_REG_SYNC_SNAP;    /* Synchronization register */
this.ADE791X_REG_COUNTER0       =ADE791X_REG_COUNTER0;    /* Contains the least significant eight bits of the internal synchronization counter */
this.ADE791X_REG_COUNTER1       =ADE791X_REG_COUNTER1;    /* COUNTER1[3:0] bits contain the most significant four bits of the internal synchronization counter */
this.ADE791X_REG_EMI_CTRL       =ADE791X_REG_EMI_CTRL;    /* EMI control register. */
this.ADE791X_REG_STATUS1        =ADE791X_REG_STATUS1;    /* Status register */

this.ADE791X_REG_TEMPOS         =ADE791X_REG_TEMPOS ;    /* Temperature sensor offset */

this.CLKOUT_EN                  =CLKOUT_EN;
this.PWRDWN_EN                  =PWRDWN_EN ;    /* Shuts down the dc-to-dc converter. When PWRDWN_EN = 0, the default value, the */
this.TEMP_EN                    =TEMP_EN;    /* This bit selects the second voltage channel measurement. */
this.ADC_FREQ_8KHZ              =ADC_FREQ_8KHZ;    /* These bits select the ADC output frequency to 8khz. */
this.ADC_FREQ_4KHZ              =ADC_FREQ_4KHZ;    /* These bits select the ADC output frequency.4khz */
this.ADC_FREQ_2KHZ              =ADC_FREQ_2KHZ;    /* These bits select the ADC output frequency.2khz */
this.ADC_FREQ_1KHZ              =ADC_FREQ_1KHZ;    /* These bits select the ADC output frequency.1khz */
this.SWRST                      =SWRST;    /* When this bit is set to 1, a software reset is initiated. This bit clears itself to 0 after */
this.BW                         =BW;    /* Selects the bandwidth of the digital low-pass filter of the ADC. When BW = 0, the */

this.RESET_ON                   =RESET_ON;
this.CRC_STAT                   =CRC_STAT;
this.IC_PROT                    =IC_PROT;


this.LOCKED                     =LOCKED;   /*locks configuration register writing */
this.UNLOCKED                   =UNLOCKED;

this.VRef = vref;
};
// METHODS:
//ade791x_init() : initialize the ADE7912 IC to communicate over SPI communication with microcontroller
AD7912.prototype.init = function() {
   SPI1.setup({mosi:A7, miso:A6, sck:A5, mode:3, baud: 9000, order:'msb'});//SPI setup
 
   digitalWrite(CSpin[0], 1); // take the SS pin high to de-select the chip
  // this.WRITE(this.ADE791X_REG_LOCK, this.UNLOCKED);
  // this.WRITE(this.ADE791X_REG_CONFIG, this.ADC_FREQ_4KHZ | this.TEMP_EN);  // configures adc sampling frequency and enables temperature on V2WV register

};

// AD7912.prototype.READ_V1 = function ()
// {

// var addr = ADE791X_REG_V1WV;
// var value = 0;  // stores value to return
// var tempValue1 = 0;
// var tempValue2 = 0 ;//
// var tempValue3 = 0;
// var opcode; // stores opcode

// var addr = addr << 3;  // left shift address by 3 bits
// var opcode = addr | ADE791X_READ;     // forms opcode byte
  
// //console.log (opcode.toString(2));  // for debug only
// console.log (opcode);  



// //PORTC &= 0b11111011;
// SPI1.send(opcode);        // send out opcode

// tempValue1 = SPI1.send(0xFF);  // read MS Byte
// tempValue2 = SPI1.send(0xFF);  // read mid Byte
// value = SPI1.send(0xFF);  // LS Byte

// //PORTC |= 0b00000100;
// //SPI.endTransaction();
// value = (((tempValue1 <<16)|(tempValue2 <<8)|value)<<8)/ 0x100;
// value = (value - ADE791X_OFFSET_V1WV)*ADE791X_MUL_V1WV; //ADE791X_MUL_V1WV;

// console.log (value);
// return value;
// };
//READ
AD7912.prototype.READ = function ()
{

var value;  // stores value to return
var value_V;
var opcode; // stores opcode

var tempValue1 = 0; 
var tempValue2 = 0;  
var tempValue3 = 0;  
var addr = ADE791X_REG_V1WV;
var addr = addr << 3;  // left shift address by 3 bits
var opcode = addr | ADE791X_READ;     // forms opcode byte
  
console.log ('opcode_bin',opcode.toString(2));  // for debug only
console.log ('opcode',opcode); 



SPI1.send(opcode);        // send out opcode
value  = SPI1.send(0xff) * 0x10000;  // read MS Byte
tempValue1=value;
value |= SPI1.send(0xff) * 0x100;  // read mid Byte
tempValue2=value;
value |= SPI1.send(0xff);  // LS Byte
  // take the SS pin high to de-select the chip:
digitalWrite(CSpin[0], 0 ); 
tempValue3=value;
  
value = value <<8;        // sign extends value to 32 bit
value = value / 0x100;    // converts back value to 24 bit but now sign extended
value_V = (value - 362760.0)*0.006485; //ADE791X_MUL_V1WV
console.log ('value', value);
console.log ('value_bin', value.toString(2));
console.log ('value_V', value_V);
return value;

};
///WRITE
// AD7912.prototype.WRITE = function (addr, value)
// {

// var v;  // stores value to return

// var opcode; // stores opcode

// var addr = addr << 3;  // left shift address by 3 bits
     
// var opcode = (addr | ADE791X_WRITE);  
// //console.log (opcode.toString(2));  // for debug only
// //console.log (opcode); 

// digitalWrite(CSpin[0], 0 ); 
// //PORTC &= 0b11111011;
// SPI1.send(opcode);        // send out opcode

// v = SPI1.send(value);  // LS Byte
// digitalWrite(CSpin[0], 1);

// console.log (v);
// return v;
// };
/////////////////////////////////////////////////////////////////////
//Read STATUS0 register, until Bit 0 (RESET_ON) is cleared:
// AD7912.prototype.READ_STATUS0 = function() {

// const STATUS0[0] = 0b11111111;

// bitRead = function (number, index){
// 	 let binary = number;
// 	 //let binary = number.toString(2);
//   return (binary[(binary.length - 1) - index] == "1");
// }


//   var nTry = 0;
//   do {
//     readMultBytesADE7913(ADE791X_REG_STATUS0 , STATUS0, 1);
//     nTry++;
//   } while (bitRead(STATUS0[0], 0) && nTry < nMaxWriteTry);

//   // Check if bit succusfully cleared
//   if (bitRead(STATUS0[0], 0)) {
//     console.log('ERROR: RESET_ON bit NOT cleared, nTry', nTry);
//     console.log('STATUS0[0]: ',(STATUS0[0].toString(2));
//     while (true) {};  // LOOP forever  on failure
//   } else {
//     console.log('RESET_ON bit cleared, nTry: ',(nTry);
//     console.log('STATUS0[0]', STATUS0[0].toString(2));
//   }

// }


//readMultBytesADE7913

//http://wiki.amperka.ru/js:spi

//////////////////////////////////////////////////////////////
exports.create = function(vref) {
  return new AD7912(vref);
};

