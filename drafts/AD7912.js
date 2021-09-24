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
var AD7912 = function (c) {
  c = c || {};

  
  this.CSpin = c.CSpin || B11;// P0
  this.DRpin = c.DRpin || C7; //P9
  this.SPI = c.SPI || SPI1;
  this.mosiPin = mosiPin || A7; //P3
  this.misoPin = misoPin || A6; //P2
  this.sckPin = sckPin || A5; //A5
 //this.uint8 = new Uint8Array(2); //array
};
// Channel constructor
var Channel = function(c) {
  this = new AD7912(c);
  var ch = 0;
  switch (c.channel) {
    case 'ADE791X_REG_V2WV':
    case 1:
      ch = this.ADE791X_REG_V2WV;
      break;
    case 'ADE791X_REG_IWV':
    case 2:
      ch = this.ADE791X_REG_IWV;
      break;
    case 'ADE791X_MUL_V1WV':
    case 3:
      ch = this.ADE791X_MUL_V1WV;
      break;
    case 'ADE791X_REG_V1WV ':
    case 0:
    default:
      ch = this.ADE791X_REG_V1WV ;
      break;
  };
  this.channel = ch;
};
//AD791X
//Command Definitions
AD7912.prototype.ADE791X_READ    =0x04;
AD7912.prototype.ADE791X_WRITE   =0x00;

// Register Definitions
AD7912.prototype.ADE791X_REG_IWV            =0x00;    /* Instantaneous value of Current I. */
AD7912.prototype.ADE791X_REG_V1WV           =0x01;    /* Instantaneous value of Voltage V1 */
AD7912.prototype.ADE791X_REG_V2WV           =0x02;    /* Instantaneous value of Voltage V2 */
AD7912.prototype.ADE791X_MUL_V1WV           =0.006485; //For V1WV 5,320,000 reading = 34.5V  (Multiplier = 0.006485) mV
AD7912.prototype.ADE791X_OFFSET_V1WV        =362760;
AD7912.prototype.ADE791X_MUL_VIMWV          =0.0011901;
AD7912.prototype.ADE791X_OFFSET_VIMWV       =349319;
AD7912.prototype.ADE791X_MUL_IWV            =0.0005921;
AD7912.prototype.ADE791X_OFFSET_IWV         =349319;

AD7912.prototype.ADE791X_REG_ADC_CRC        =0x04;    /* CRC value of IWV, V1WV, and V2WV registers. See the ADC Output Values CRC section for details */
AD7912.prototype.ADE791X_REG_CTRL_CRC       =0x05;    /* CRC value of configuration registers. See the CRC of Configuration Registers  for details. */

AD7912.prototype.ADE791X_REG_CNT_SNAPSHOT   =0x07;    /* Snapshot value of the counter used in synchronization operation. */
AD7912.prototype.ADE791X_REG_CONFIG         =0x08;    /* Configuration register. See Table 15 for details */
AD7912.prototype.ADE791X_REG_STATUS0        =0x09;    /* Status register */
AD7912.prototype.ADE791X_REG_LOCK           =0x0A;    /* Memory protection register */
AD7912.prototype.ADE791X_REG_SYNC_SNAP      =0x0B;    /* Synchronization register */
AD7912.prototype.ADE791X_REG_COUNTER0       =0x0C;    /* Contains the least significant eight bits of the internal synchronization counter */
AD7912.prototype.ADE791X_REG_COUNTER1       =0x0D;    /* COUNTER1[3:0] bits contain the most significant four bits of the internal synchronization counter */
AD7912.prototype.ADE791X_REG_EMI_CTRL       =0x0E;    /* EMI control register. */
AD7912.prototype.ADE791X_REG_STATUS1        =0x0F;    /* Status register */

AD7912.prototype.ADE791X_REG_TEMPOS         =0x18;    /* Temperature sensor offset */

/* configuration register constants */
AD7912.prototype.CLKOUT_EN                  =0x01;
AD7912.prototype.PWRDWN_EN                  =0x04;    /* Shuts down the dc-to-dc converter. When PWRDWN_EN = 0, the default value, the */
AD7912.prototype.TEMP_EN                    =0x08;    /* This bit selects the second voltage channel measurement. */
AD7912.prototype.ADC_FREQ_8KHZ              =0x00;    /* These bits select the ADC output frequency to 8khz. */
AD7912.prototype.ADC_FREQ_4KHZ              =0x10;    /* These bits select the ADC output frequency.4khz */
AD7912.prototype.ADC_FREQ_2KHZ              =0x20;    /* These bits select the ADC output frequency.2khz */
AD7912.prototype.ADC_FREQ_1KHZ              =0x30;    /* These bits select the ADC output frequency.1khz */
AD7912.prototype.SWRST                      =0x40;    /* When this bit is set to 1, a software reset is initiated. This bit clears itself to 0 after */
AD7912.prototype.BW                         =0x80;    /* Selects the bandwidth of the digital low-pass filter of the ADC. When BW = 0, the */

AD7912.prototype.RESET_ON                   =0x00;
AD7912.prototype.CRC_STAT                   =0x01;
AD7912.prototype.IC_PROT                    =0x02;

/* lock register constants(address 0xA */
AD7912.prototype.LOCKED                     =0xCA;   /*locks configuration register writing */
AD7912.prototype.UNLOCKED                   =0x9C;    /*unlocks configuration register writing */

// METHODS:
//ade791x_init() : initialize the ADE7912 IC to communicate over SPI communication with microcontroller
AD7912.prototype.init = function() {
  this.SPI.setup({
    mosi: this.mosiPin,
    miso: this.misoPin,
    sck: this.sckPin,
    mode: 3,
    baud: 9000,
    order: 'msb'});

   //digitalWrite(this.CSpin, 1); // take the SS pin high to de-select the chip
   //this.write(this.ADE791X_REG_LOCK, this.UNLOCKED);
   //this.write(this.ADE791X_REG_CONFIG, this.ADC_FREQ_4KHZ | this.TEMP_EN);  // configures adc sampling frequency and enables temperature on V2WV register


};

AD7912.prototype.READ_V1 = function ()
{
var addr = this.ADE791X_REG_V1WV;
var value = 0;  // stores value to return
var tempValue1 = 0;
var tempValue2 = 0 ;//, tempValue3 = 0;
var opcode; // stores opcode

addr = addr << 3;  // left shift address by 3 bits
opcode = (addr | this.ADE791X_READ);     // forms opcode byte
  
Console.log (opcode, BIN);  // for debug only
Console.log (opcode);  

this.SPI.setup({
    mosi: this.mosiPin,
    miso: this.misoPin,
    sck: this.sckPin,
    mode: 3,
    baud: 9000,
    order: 'msb'});

//PORTC &= 0b11111011;
this.SPI.send(opcode);        // send out opcode

tempValue1 = SPI.send(0xFF);  // read MS Byte
tempValue2 = SPI.send(0xFF);  // read mid Byte
value = SPI.send(0xFF);  // LS Byte

//PORTC |= 0b00000100;
//SPI.endTransaction();
value = (((tempValue1 <<16)|(tempValue2 <<8)|value)<<8)/ 0x100;
value = (value - this.ADE791X_OFFSET_V1WV)*this.ADE791X_MUL_V1WV; //ADE791X_MUL_V1WV;

Console.log (value);
return value;
};

//////////////////////////////////////////////////////////////

// new instances //

exports.device = function(c) {
  c = c || {};
  var ad = new AD7912(c);


  ad.init(
    

);


  return ad;
};

exports.channel = function(c) {
  c = c || {};
  var ch = new Channel(c);

  ch.reset();

  ch.init(
    ch.channel;

  return ch;
};