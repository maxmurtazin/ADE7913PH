/*
 library for ADE7912 ADC (Analog devices)  (espruino)
*/

// iskra js pins
var ADE7912 = function (c) {
    c = c || {};

    this.VRef = c.vref || 1.2;
    this.CSpin = c.CSpin || B1;// P0
    this.DRpin = c.DRpin || C3; //P9
    this.SPI = c.SPI || SPI1;
    this.mosiPin = mosiPin || A7; //P3
    this.misoPin = misoPin || A6; //P2
    this.sckPin = sckPin || A5; //A5

    this.uint8 = new Uint8Array(2); ??
};

ADE7912.prototype.init = function() {
    this.SPI.setup({
        mosi: this.mosiPin,
        miso: this.misoPin,
        sck: this.sckPin,
        mode: 3,
        baud: 9000,
        order: 'msb'});
};

//Commands
ADE7912.prototype.READ= 0x04; //?
ADE7912.prototype.WRITE =0x00; // ?
// Register Definitions p.38
ADE7912.prototype.IWV            =0x00;    /* Instantaneous value of Current I. */
ADE7912.prototype.V1WV           =0x01;    /* Instantaneous value of Voltage V1 */
ADE7912.prototype.V2WV           =0x02;    /* Instantaneous value of Voltage V2 */
// math operatiion

ADE7912.prototype.MUL_V1WV           =0.006485; //For V1WV 5,320,000 reading = 34.5V  (Multiplier = 0.006485) mV
ADE7912.prototype.OFFSET_V1WV        =362760;
ADE7912.prototype.MUL_VIMWV          =0.0011901;
ADE7912.prototype.OFFSET_VIMWV       =349319;
ADE7912.prototype.MUL_IWV            =0.0005921;
ADE7912.prototype.OFFSET_IWV         =349319;

// Register list p.38
ADE7912.prototype.ADC_CRC        =0x04;    /* CRC value of IWV, V1WV, and V2WV registers. See the ADC Output Values CRC section for details */
ADE7912.prototype.CTRL_CRC       =0x05;    /* CRC value of configuration registers. See the CRC of Configuration Registers  for details. */
ADE7912.prototype.CNT_SNAPSHOT   =0x07;    /* Snapshot value of the counter used in synchronization operation. */
ADE7912.prototype.CONFIG         =0x08;    /* Configuration register. See Table 15 for details */
ADE7912.prototype.STATUS0        =0x09;    /* Status register */
ADE7912.prototype.LOCK           =0x0A;    /* Memory protection register */
ADE7912.prototype.SYNC_SNAP      =0x0B;    /* Synchronization register */
ADE7912.prototype.COUNTER0       =0x0C;    /* Contains the least significant eight bits of the internal synchronization counter */
ADE7912.prototype.COUNTER1       =0x0D;    /* COUNTER1[3:0] bits contain the most significant four bits of the internal synchronization counter */
ADE7912.prototype.EMI_CTRL       =0x0E;    /* EMI control register. */
ADE7912.prototype.STATUS1        =0x0F;    /* Status register */
ADE7912.prototype.REG_TEMPOS     =0x18;    /* Temperature sensor offset */

/* configuration register constants */
ADE7912.prototype.CLKOUT_EN                  =0x01;
ADE7912.prototype.PWRDWN_EN                  =0x04;    /* Shuts down the dc-to-dc converter. When PWRDWN_EN = 0, the default value, the */
ADE7912.prototype.TEMP_EN                    =0x08;    /* This bit selects the second voltage channel measurement. */
ADE7912.prototype.ADC_FREQ_8KHZ              =0x00;    /* These bits select the ADC output frequency to 8khz. */
ADE7912.prototype.ADC_FREQ_4KHZ              =0x10;    /* These bits select the ADC output frequency.4khz */
ADE7912.prototype.ADC_FREQ_2KHZ              =0x20;    /* These bits select the ADC output frequency.2khz */
ADE7912.prototype.ADC_FREQ_1KHZ              =0x30;    /* These bits select the ADC output frequency.1khz */
ADE7912.prototype.SWRST                      =0x40;    /* When this bit is set to 1, a software reset is initiated. This bit clears itself to 0 after */
ADE7912.prototype.BW                         =0x80;    /* Selects the bandwidth of the digital low-pass filter of the ADC. When BW = 0, the */

// STATUS0
ADE7912.prototype.RESET_ON                   =0x00;
ADE7912.prototype.CRC_STAT                   =0x01;
ADE7912.prototype.IC_PROT                    =0x02;

/* lock register constants(address 0xA */
ADE7912.prototype.LOCKED                     =0xCA;   /*locks configuration register writing */
ADE7912.prototype.UNLOCKED                   =0x9C;    /*unlocks configuration register writing */

//SYNC_SNAP (adress 0xB)
ADE7912.prototype.SYNC = 0x01;
ADE7912.prototype.SNAP = 0x02;

// EMI_CTRL
ADE7912.prototype.SLOT0 =0x01;
ADE7912.prototype.SLOT1 =0x02;
ADE7912.prototype.SLOT2 =0x04;
ADE7912.prototype.SLOT3 =0x08;
ADE7912.prototype.SLOT4 =0x10;
ADE7912.prototype.SLOT5 =0x20;
ADE7912.prototype.SLOT6 =0x40;
ADE7912.prototype.SLOT6 =0x80;

// METHODS:

ADE7912.prototype.SOME = function( ) {

};





///EXPORTS
exports.device = function(c) {
    c = c || {};
    var ad = new ADE7912(c);

    return ad;
};

exports.channel = function(c) {
    c = c || {};
    var ch = new Channel(c);

    return ch;
};