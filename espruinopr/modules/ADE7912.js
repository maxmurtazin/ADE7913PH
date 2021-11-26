/*
 library for ADE7912 ADC (Analog devices)  (espruino)
 library for multiple chips
*/
// iskra js pins
let ADE7912 = function (c) {
    c = c || {};
    // this.spiS = new c.SPI(); //software SPI
    //this.VRef = c.vref || 1.2;
    this.CSpin = c.CSpin || B11;// P0
    this.DRpin = c.DRpin || C3; //P4
    this.SPI = c.SPI || SPI1; // Hardware SPI
    this.mosiPin = mosiPin || A7; //P3
    this.misoPin = misoPin || A6; //P2
    this.sckPin = sckPin || A5; //A5

    this.uint8 = new Uint8Array(2); //??
    this.uint16 = new Uint16Array(2);
    this.uint24 = new Uint24Array(2); //espruino function
};

ADE7912.prototype.init = function() { //hardware SPI
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
//////////////////////////////////////////////////////

// Settings for writing updates to serial, and ADE7913 syncing:
// define as volatile all variables to be updated from iterrupt service routine

ADE7912.prototype.writePeriodMillis = 2000;
ADE7912.prototype.syncPeriodMillis = 10000;
ADE7912.prototype.previousWriteMillis = 0;
ADE7912.prototype.previousSyncMillis = 0;
ADE7912.prototype.rdDelayMicros  = 0;
ADE7912.prototype.nMaxWriteTry = 100;

let microsForBurstRead;
let micetweenReads;
let microsPreviousRead;

// Local copies of ADC readings, updated on dataReady interrupt
let nReads = 0;
let IWV;
let V1WV;
let V2WV;
let ADC_CRC=new Array (2);// ADC_CRC[2];
let STATUS0= new Array (1); //STATUS0[1];
let CNT_SNAPSHOT= new Array (2); //CNT_SNAPSHOT[2];
let ADC_CRC_burst=new Array (2); //ADC_CRC_burst[2];
let CONFIG=new Array (1); //CONFIG[1];
let TEMPOS=new Array (1); //TEMPOS[1];
let EMI_CTRL=new Array (1); //EMI_CTRL[1];




// METHODS:
ADE7912.prototype.bitRead = function (number, index) {
    let binary = number.toString(2);
    return (binary[(binary.length - 1) - index] == "1"); // index backwards
}


// Read STATUS0 register, until Bit 0 (RESET_ON) is cleared:
 STATUS0[0] = 0b11111111;
let nTry = 0;
do {
    readMultBytes(this.STATUS0, STATUS0[0]); //????
    nTry++;
    }
while (this.bitRead(this.STATUS0, STATUS0[0],0) && nTry<this.nMaxWriteTry);
// Check if bit succusfully cleared
if (bitRead(STATUS0[0], 0)) {
    console.log("ERROR: RESET_ON bit NOT cleared, nTry: ");
    console.log(nTry);
    console.log("STATUS0[0]: ");
    console.log(STATUS0[0].toString(2));
    while (true) {}  // LOOP forever  on failure
} else {
    console.log("RESET_ON bit cleared, nTry: ");
    console.log(nTry);
    console.log("STATUS0[0]: ");
    console.log(STATUS0[0].toString(2));
}

this.UNLOCK_REG()
// Initialize CONFIG register with bit 0 (CLKOUT_EN) cleared (to 0)
// as CLKOUT unecessary (we provide it from ardiuno)
// also SET TEMP_EN (bit 3) so temperature can be measured (we're not using V2P)
// SET ADC_FREQ (bit 5:4) to 11 (1kHz for debugging), otherwise 00 (8kHx) for running

let writeSuccess = writeADE7913_check(this.CONFIG, 0b00001000, CONFIG); ///??????
if (writeSuccess) {
    console.log("CONFIG write success!");
    console.log("CONFIG[0]: "); Serial.println(CONFIG[0].toString(2));
} else {
    console.log("ERROR: CONFIG Write Failed");
    console.log("CONFIG[0]: ");
    console.log(CONFIG[0].toString(2));
    while (true) {}  // LOOP forever  on failure
}

// // Read temperature offset register:
// this.readMultBytes(TEMPOS, TEMPOS, 1);
// console.log("TEMPOS: ");
// console.log( TEMPOS[0]);

// Set the EMI_CTRL register; and check written correctly:
let writeSuccess = this.writeADE7913_check(EMI_CTRL_WRITE, 0b01010101, EMI_CTRL_READ);

this.readMultBytesADE7913(EMI_CTRL_READ, EMI_CTRL, 1);
if (writeSuccess) {
    console.log("EMI_CTRL write success!");
    console.log("EMI_CTRL[0]: ");
    console.log(EMI_CTRL[0].toString(2));
} else {
    console.log("ERROR: EMI_CTRL Write Failed");
    console.log("EMI_CTRL[0]: ");
    console.log(EMI_CTRL[0].toString(2));
    while (true) {}  // LOOP forever  on failure
}

// LOOP
 let currentMillis = getTime();
let previousWriteMillis;
if ((currentMillis - previousWriteMillis) > writePeriodMillis) {
    // dettach interrupt so write won't be messed up
    clearWatch();//ID??

    previousWriteMillis = currentMillis;
    this.writeToSerial(); //function
    // re-attach interrupt
    setWatch(this.dataReady_ISR(), this.DRpin, { repeat: true, edge: "falling" }); // LOW
}

let syncPeriodMillis;
if ((currentMillis - previousSyncMillis) > syncPeriodMillis) {
    // dettach interrupt so sync won't be messed up
    clearWatch();//ID??

    previousSyncMillis = currentMillis;
    this.syncADE7912();
    console.log("ADE7912 Synced");
    // re-attach interrupt
    attachInterrupt(digitalPinToInterrupt(dataReadyPin), dataReady_ISR, FALLING);// LOW
    setWatch(this.dataReady_ISR(), this.DRpin, { repeat: true, edge: "falling" }); //true??

}

ADE7912.prototype.writeToSerial = function () {

}


// Write a register to ADE7913, assume SPI.beginTransaction already called
// include read-back test, and loop until correctly set (or nMaxWriteTry reached)!
ADE7912.prototype.writeADE7912_check = function (writeTo, writeMsg, readFrom) {

    let success = false;
    let nTry = 0;
    //let nMaxWriteTry;
    do {
        digitalWrite(this.CSpin, 0)
        this.SPI.send(writeTo);
        this.SPI.send(writeTo);
        digitalWrite(this.CSpin, 1);

        let readBack = new Array (1) // readBack[1]  ????????????????????
        this.readMultBytes(readFrom, readBack, 1);
        success = (readBack[0] == writeMsg);
        nTry++;
    }  while ((!success) && nTry < this.nMaxWriteTry);
    return success;
}

// Set the EMI_CTRL register; and check written correctly:
let writeSuccess = this.writeADE7912_check(EMI_CTRL, 0b01010101, EMI_CTRL);

this.readMultBytes(EMI_CTRL, EMI_CTRL, 1)
if (writeSuccess){
    Console.log("EMI_CTRL write success!");
} else {
    console.log("ERROR: EMI_CTRL Write Failed");
    while (true) {}///???
}


// Execute a SYNC_SNAP = 0x01 write broadcast, NB will be cleared to 0x00 after 1 CLK cycle
writeADE7912(this.SYNC_SNAP, 0b00000001)
console.log("SYNC_SNAP Register Set!");


//Unlock Config reg
ADE7912.prototype.UNLOCK_REG = function () {
    this.writeADE7912 (this.LOCK, this.UNLOCKED);
    console.log('Registers unlocked!')
}

ADE7912.prototype.LOCK_REG = function () {
    this.writeADE7912 (this.LOCK, this.LOCKED);
    console.log('Registers locked!')
}


ADE7912.prototype.writeADE7912 = function (writeREG, writeDATA) {
    digitalWrite(this.CSpin,0);
    this.SPI.write(writeREG, writeDATA);
    digitalWrite(this.CSpin,1);
}


// ADE7912.prototype.REAR_V1 = function() {
//   var addr = this.V1WV;
// };

//Sync multyple chips ADE7912
ADE7912.prototype.syncADE7912  = function () {
  this.UNLOCK_REG();
  this.writeADE7912 (this.SYNC_SNAP, 0b00000001);//???
  this.LOCK_REG();
}

// Read multiple bytes from ADE7913, assume SPI.beginTransaction already called
// COMMENTED OUT: (try multiple times till a non-all-ones answer found)
ADE7912.prototype.readMultBytes = function (readFrom, readTo [], nBytes) { //???
    let idx = nBytes - 1;
    digitalWrite(this.CSpin, 0);
    let readFrom;
    this.SPI.write(readFrom);
    while (idx>= 0) {
        let readTo;
        readTo[idx]=this.SPI.write(0x00);
        idx--;
    }
    digitalWrite(this.CSpin,1);
}
// READ VALUES IN BURST MODE:
ADE7912.prototype.dataReady_ISR = function () {
    let microsBetweenReads;
    microsBetweenReads = micros() - microsPreviousRead;
    microsPreviousRead = micros();
    nReads++;       // keep a track of No. of reads

    digitalWrite(this.CSpin, 0);
    this.SPI.write(this.WRITE);//?

    this.uint24[0] = this.SPI.send(0x00);
    this.uint24[1] = this.SPI.send(0x00);
    this.uint24[2] = this.SPI.send(0x00);

    this.uint16 [0] = this.SPI.send(0x00);
    this.uint16 [1] = this.SPI.send(0x00);

    this.uint8 [2] = this.SPI.send(0x00);


    digitalWrite(this.CSpin, 1);
    microsForBurstRead = micros() - microsPreviousRead;
    return;

}

///EXPORTS
exports.device = function(c) {
    c = c || {};
    let ad = new ADE7912(c);

    return ad;
};

exports.channel = function(c) {
    c = c || {};
    let ch = new Channel(c);

    return ch;
};