/*
 library for ADE7912 ADC (Analog devices)  (espruino)
*/

// iskra js pins
const CSpin = B1; //select chip
const DRpin = C3; //data ready pin
SPI1.setup({mosi:A7, miso:A6, sck:A5, mode:3, baud: 9000, order:'msb'});//SPI setup
//Commands
const READ    =0x04; //?
const WRITE   =0x00; // ?
// Register Definitions p.38
const IWV            =0x00;    /* Instantaneous value of Current I. */
const V1WV           =0x01;    /* Instantaneous value of Voltage V1 */
const V2WV           =0x02;    /* Instantaneous value of Voltage V2 */
// math operatiion

// const MUL_V1WV           =0.006485; //For V1WV 5,320,000 reading = 34.5V  (Multiplier = 0.006485) mV
// const OFFSET_V1WV        =362760;
// const MUL_VIMWV          =0.0011901;
// const OFFSET_VIMWV       =349319;
// const MUL_IWV            =0.0005921;
// const OFFSET_IWV         =349319;

// Register list p.38
const ADC_CRC        =0x04;    /* CRC value of IWV, V1WV, and V2WV registers. See the ADC Output Values CRC section for details */
const CTRL_CRC       =0x05;    /* CRC value of configuration registers. See the CRC of Configuration Registers  for details. */
const CNT_SNAPSHOT   =0x07;    /* Snapshot value of the counter used in synchronization operation. */
const CONFIG         =0x08;    /* Configuration register. See Table 15 for details */
const STATUS0        =0x09;    /* Status register */
const LOCK           =0x0A;    /* Memory protection register */
const SYNC_SNAP      =0x0B;    /* Synchronization register */
const COUNTER0       =0x0C;    /* Contains the least significant eight bits of the internal synchronization counter */
const COUNTER1       =0x0D;    /* COUNTER1[3:0] bits contain the most significant four bits of the internal synchronization counter */
const EMI_CTRL       =0x0E;    /* EMI control register. */
const STATUS1        =0x0F;    /* Status register */
const REG_TEMPOS     =0x18;    /* Temperature sensor offset */



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
// STATUS0
const RESET_ON                   =0x00;
const CRC_STAT                   =0x01;
const IC_PROT                    =0x02;
/* lock register constants(address 0xA */
const LOCKED                     =0xCA;   /*locks configuration register writing */
const UNLOCKED                   =0x9C;    /*unlocks configuration register writing */
//SYNC_SNAP (adress 0xB)
const  SYNC = 0x01;
const  SNAP = 0x02;
// EMI_CTRL
const SLOT0 =0x01;
const SLOT1 =0x02;
const SLOT2 =0x04;
const SLOT3 =0x08;
const SLOT4 =0x10;
const SLOT5 =0x20;
const SLOT6 =0x40;
const SLOT6 =0x80;



