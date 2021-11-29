/*
 library for ADE7912 ADC (Analog devices)  (espruino)
 library for multiple chips
*/

exports.device = function(c) {
    c = c || {};
    let ad = new ADE7912(c);
    //ad.init();
    //ad.init_chip();
    return ad;
};

// iskra js pins
let ADE7912 = function (c) {
    c = c || {};
    // this.spiS = new c.SPI(); //software SPI
    //this.VRef = c.vref || 1.2;
    this.CSpin = c.CSpin || B11;// P0
    this.DRpin = c.DRpin || C3; //P4
    this.SPI = c.SPI || SPI1; // Hardware SPI
    this.mosiPin = c.mosiPin || A7; //P3
    this.misoPin = c.misoPin || A6; //P2
    this.sckPin = c.sckPin || A5; //A5

    this.nReads = 0;
    this.IWV = new Uint24Array (1); // ?????
    this.V1WV = new Uint24Array (1);
    this.V2WV = new Uint24Array (1);
    this.ADC_CRC = new Array (2);// ADC_CRC[2];
    this.STATUS0 = new Array (1); //STATUS0[1];
    this.CNT_SNAPSHOT= new Array (2); //CNT_SNAPSHOT[2];
    this.ADC_CRC_burst = new Array (2); //ADC_CRC_burst[2];
    this.CONFIG = new Array (1); //CONFIG[1];
    this.TEMPOS = new Array (1); //TEMPOS[1];
    this.EMI_CTRL = new Array (1); //EMI_CTRL[1];

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
//ADE7912.prototype.READ= 0x04; //?
//ADE7912.prototype.WRITE =0x00; // ?

// Register Definitions p.38
ADE7912.prototype.IWV_READ            =(0x00<< 3 | 0b100);    /* Instantaneous value of Current I. */
ADE7912.prototype.V1WV_READ           =(0x01<< 3 | 0b100);    /* Instantaneous value of Voltage V1 */
ADE7912.prototype.V2WV_READ           =(0x02<< 3 | 0b100);    /* Instantaneous value of Voltage V2 */

// math operatiion
// ADE7912.prototype.MUL_V1WV           =0.006485; //For V1WV 5,320,000 reading = 34.5V  (Multiplier = 0.006485) mV
// ADE7912.prototype.OFFSET_V1WV        =362760;
// ADE7912.prototype.MUL_VIMWV          =0.0011901;
// ADE7912.prototype.OFFSET_VIMWV       =349319;
// ADE7912.prototype.MUL_IWV            =0.0005921;
// ADE7912.prototype.OFFSET_IWV         =349319;

// Register list p.38
ADE7912.prototype.ADC_CRC_READ        =(0x04<< 3 | 0b100);    /* CRC value of IWV, V1WV, and V2WV registers. See the ADC Output Values CRC section for details */
//ADE7912.prototype.CTRL_CRC       =0x05;    /* CRC value of configuration registers. See the CRC of Configuration Registers  for details. */
ADE7912.prototype.CNT_SNAPSHOT_READ   =(0x07<< 3 | 0b100);    /* Snapshot value of the counter used in synchronization operation. */
ADE7912.prototype.CONFIG_READ         =(0x08 << 3 | 0b100);    /* Configuration register. See Table 15 for details */
ADE7912.prototype.STATUS0_READ        =(0x09 << 3 | 0b100);    /* Status register */
//ADE7912.prototype.LOCK           =0x0A;    /* Memory protection register */
ADE7912.prototype.SYNC_SNAP_WRITE  =(0xB << 3 | 0b000);    /* Synchronization register */
//ADE7912.prototype.COUNTER0       =0x0C;    /* Contains the least significant eight bits of the internal synchronization counter */
//ADE7912.prototype.COUNTER1       =0x0D;    /* COUNTER1[3:0] bits contain the most significant four bits of the internal synchronization counter */
ADE7912.prototype.EMI_CTRL_READ       =(0x0E << 3 | 0b100);    /* EMI control register. */
//ADE7912.prototype.STATUS1        =0x0F;    /* Status register */
ADE7912.prototype.TEMPOS_READ     = (0x18<< 3 | 0b100);    /* Temperature sensor offset */

ADE7912.prototype.CONFIG_WRITE     =(0x8 << 3 | 0b000);
ADE7912.prototype.EMI_CTRL_WRITE   =(0xE << 3 | 0b000);
ADE7912.prototype.LOCK_KEY_WRITE   =(0xA << 3 | 0b000);
ADE7912.prototype.DUMMY_MSG   =     0x00;
/* configuration register constants */
// ADE7912.prototype.CLKOUT_EN                  =0x01;
// ADE7912.prototype.PWRDWN_EN                  =0x04;    /* Shuts down the dc-to-dc converter. When PWRDWN_EN = 0, the default value, the */
// ADE7912.prototype.TEMP_EN                    =0x08;    /* This bit selects the second voltage channel measurement. */
// ADE7912.prototype.ADC_FREQ_8KHZ              =0x00;    /* These bits select the ADC output frequency to 8khz. */
// ADE7912.prototype.ADC_FREQ_4KHZ              =0x10;    /* These bits select the ADC output frequency.4khz */
// ADE7912.prototype.ADC_FREQ_2KHZ              =0x20;    /* These bits select the ADC output frequency.2khz */
// ADE7912.prototype.ADC_FREQ_1KHZ              =0x30;    /* These bits select the ADC output frequency.1khz */
// ADE7912.prototype.SWRST                      =0x40;    /* When this bit is set to 1, a software reset is initiated. This bit clears itself to 0 after */
// ADE7912.prototype.BW                         =0x80;    /* Selects the bandwidth of the digital low-pass filter of the ADC. When BW = 0, the */

// STATUS0
//ADE7912.prototype.RESET_ON                   =0x00;
//ADE7912.prototype.CRC_STAT                   =0x01;
//ADE7912.prototype.IC_PROT                    =0x02;

/* lock register constants(address 0xA */
ADE7912.prototype.LOCKED                     =0xCA;   /*locks configuration register writing */
ADE7912.prototype.UNLOCKED                   =0x9C;    /*unlocks configuration register writing */

//SYNC_SNAP (adress 0xB)
//ADE7912.prototype.SYNC = 0x01;
//ADE7912.prototype.SNAP = 0x02;

ADE7912.prototype.writePeriodMillis = 2000;
ADE7912.prototype.syncPeriodMillis = 10000;
ADE7912.prototype.previousWriteMillis = 0;
ADE7912.prototype.previousSyncMillis = 0;
ADE7912.prototype.rdDelayMicros  = 0;
ADE7912.prototype.nMaxWriteTry = 100;
ADE7912.prototype.currentMillis = (getTime()*1000);
ADE7912.prototype.micros = (getTime()*1000000);


//////////////////////////////////////////// init chips///////////////////////////
ADE7912.prototype.init_chip = function (){
    clearWatch();//ID??
    digitalWrite(this.CSpin,1);
    //SPI?
    this.init();//SPI

    // Read STATUS0 register, until Bit 0 (RESET_ON) is cleared:
     STATUS0[0] = 0b11111111;
    let nTry = 0;
    do {
        this.readMultBytes(this.STATUS0_READ, this.STATUS0); //????
        nTry++;
    }
    while (this.bitRead(this.STATUS0_READ, STATUS0[0],0) && nTry<this.nMaxWriteTry);
// Check if bit succusfully cleared
    if (this.bitRead(STATUS0[0], 0)) {
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
    console.log("Registers unlocked!");
    // Initialize CONFIG register with bit 0
    let writeSuccess1;
    writeSuccess1 = this.writeADE7912_check(this.CONFIG_WRITE, 0b00001000, this.CONFIG_READ);
// delay!!!
    this.readMultBytes(this.CONFIG_READ, this.CONFIG, 1);
    if (writeSuccess1) {
        console.log("CONFIG write success!");
        console.log("CONFIG[0]: ");
        console.log(this.CONFIG[0].toString(2));
    } else {
        console.log("ERROR: CONFIG Write Failed");
        console.log("CONFIG[0]: ");
        console.log(this.CONFIG[0].toString(2));
        while (true) {}  // LOOP forever  on failure
    }

// // Read temperature offset register:
    this.readMultBytes(this.TEMPOS_READ, this.TEMPOS, 1);//??
    console.log("TEMPOS: ");
    console.log(this.TEMPOS[0]);

// Set the EMI_CTRL register; and check written correctly:
    let writeSuccess2 = this.writeADE7912_check(this.EMI_CTRL_WRITE, 0b01010101, this.EMI_CTRL_READ);

    this.readMultBytes(this.EMI_CTRL_READ, this.EMI_CTRL, 1);
    if (writeSuccess2) {
        console.log("EMI_CTRL write success!");
        console.log("EMI_CTRL[0]: ");
        console.log(this.EMI_CTRL[0].toString(2));
    } else {
        console.log("ERROR: EMI_CTRL Write Failed");
        console.log("EMI_CTRL[0]: ");
        console.log(this.EMI_CTRL[0].toString(2));
        while (true) {}  // LOOP forever  on failure
    }

    this.writeADE7912(this.SYNC_SNAP_WRITE, 0b00000001);
    console.log("SYNC_SNAP Register Set!");

    this.LOCK_REG();
    console.log("Registers locked!");
    console.log(" --- SETUP COMPLETE ---");
}

////////////////////////////// METHODS//////////////////////////////////
//bit read
ADE7912.prototype.bitRead = function (number, index) {
    let binary = number.toString(2);
    return (binary[(binary.length - 1) - index] == "1"); // index backwards
}

//Unlock Config reg
ADE7912.prototype.UNLOCK_REG = function () {
    this.writeADE7912 (this.LOCK_KEY_WRITE, this.UNLOCKED);
    console.log('Registers unlocked!')
}
// Lock config reg
ADE7912.prototype.LOCK_REG = function () {
    this.writeADE7912 (this.LOCK_KEY_WRITE, this.LOCKED);
    console.log('Registers locked!')
}

//Check
ADE7912.prototype.writeADE7912_check = function (writeTo, writeMsg, readFrom) {
    let success = false;
    let nTry = 0;
    //let nMaxWriteTry;
    do {
        digitalWrite(this.CSpin, 0)
        this.SPI.send(writeTo, writeMsg);

        digitalWrite(this.CSpin, 1);

        let readBack = new Array (1) //
        this.readMultBytes(readFrom, readBack, 1);
        success = (readBack[0] == writeMsg);
        nTry++;
    }  while ((!success) && nTry < this.nMaxWriteTry);
    return success;
}
//write ADE7912
ADE7912.prototype.writeADE7912 = function (writeREG, writeDATA) {
    digitalWrite(this.CSpin,0);
    this.SPI.write(writeREG, writeDATA);
    digitalWrite(this.CSpin,1);
}
// Sync
ADE7912.prototype.syncADE7912  = function () {
    this.UNLOCK_REG();
    this.writeADE7912 (this.SYNC_SNAP_WRITE, 0b00000001);//???
    this.LOCK_REG();
}
//read mult bytes
ADE7912.prototype.readMultBytes = function (readFrom, readTo, nBytes) { //???
    let idx = nBytes - 1;
    digitalWrite(this.CSpin, 0);
    //let readFrom;
    this.SPI.write (readFrom);
    while (idx>= 0) {
        let readTo = new Array(idx);
        readTo=this.SPI.write(0x00);
        idx --;
    }
    digitalWrite(this.CSpin,1);
}

//ISR and burst read
ADE7912.prototype.dataReady_ISR = function () {
    //let microsBetweenReads;
    this.microsBetweenReads = this.micros - this.microsPreviousRead;
    this.microsPreviousRead = this.micros;
    this.nReads++;       // keep a track of No. of reads

    digitalWrite(this.CSpin, 0);
    this.SPI.send(this.IWV_READ);
    this.IWV = this.SPI.send(this.DUMMY_MSG);
    this.V1WV =  this.SPI.send(this.DUMMY_MSG);
    this.V1WV =  this.SPI.send(this.DUMMY_MSG);

    this.ADC_CRC[0] = this.SPI.send(this.DUMMY_MSG);
    this.ADC_CRC[1] = this.SPI.send(this.DUMMY_MSG);
    this.STATUS0[0] = this.SPI.send(this.DUMMY_MSG);

    digitalWrite(this.CSpin, 1);
    this.microsForBurstRead = this.micros - this.microsPreviousRead;
}
///////////////////////////////////////// LOOP/////////////////////////////////////
 //let currentMillis = getTime();
//let previousWriteMillis;
//setTimeout(this.loop, 1000);
// ADE7912.prototype.loop_setup = {
//
//
// }

while (true) {
    this.loop ()
}
ADE7912.prototype.loop = function () {
    if ((this.currentMillis - this.previousWriteMillis) > this.writePeriodMillis) {
        // dettach interrupt so write won't be messed up
        clearWatch();//ID??

        this.previousWriteMillis = this.currentMillis;//?
        //this.writeToSerial(); //function
        // re-attach interrupt
        setWatch(this.dataReady_ISR(), this.DRpin, {repeat: true, edge: "falling"}); // LOW
    }
//let syncPeriodMillis;
    if ((this.currentMillis - this.previousSyncMillis) > this.syncPeriodMillis) {
        // dettach interrupt so sync won't be messed up
        clearWatch();//ID??

        this.previousSyncMillis = this.currentMillis;
        this.syncADE7912();
        console.log("ADE7912 Synced");
        // re-attach interrupt
        //attachInterrupt(digitalPinToInterrupt(dataReadyPin), dataReady_ISR, FALLING);// LOW
        setWatch(this.dataReady_ISR(), this.DRpin, {repeat: true, edge: "falling"}); //true??

    }
}


//////////////////////////EXPORTS//////////////////////////////////////////////



/////////////////////////SHOW/////////////////
//this.init_chip();
//this.loop_setup();


ADE7912.prototype.SHOW = function() {

    setTimeout(this.SHOW, 1000);
    console.log(this.IWV);
    console.log(this.V1WV);
    console.log(this.V2WV);

    console.log("CONFIG= ");
    console.log(this.CONFIG[0].toString(2));

    console.log("ADC_CRC= ");
    console.log(this.ADC_CRC[1].toString(2));

    console.log(this.ADC_CRC[0].toString(2));
    console.log("STATUS0= ");
    console.log(this.STATUS0[0].toString(2));
    console.log("CNT_SNAPSHOT= ");
    console.log(this.CNT_SNAPSHOT[1].toString(2));
    console.log(this.CNT_SNAPSHOT[0].toString(2));


}




