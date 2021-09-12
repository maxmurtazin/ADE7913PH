const READ_LOOP = 500;
var v1;
 setInterval(function() {

 		readAll();
   
 }, READ_LOOP);

// var buff1 = new ArrayBuffer(3); //24 bit
// var buff2 = new ArrayBuffer(3);
// var buff3 = new ArrayBuffer(3);

// var read1 = new Uint8Array(3); //IWV
// var read2 = new Uint8Array(3);// V1WV
// var read3 = new Uint8Array(3); //V2WV

var read1 = []; //IWV
var read2 = [];// V1WV
var read3 = []; //V2WV

SPI1.setup({mosi:A7, miso:A6, sck:A5, mode:3, baud: 4096000, order:'msb'});//SPI setup

const CSpin = B11;
function readAll () {
  
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
 // var read;
  //var reading = read1;
 //  var reading = (reading << 8) + read2;
 // console.log("IWV= ");
 // console.log(reading);  
 // console.log("     ");
 // console.log(read1);
 // console.log(" ");
 // console.log(read2);
 // console.log(" ");
//  console.log(read3);
  
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
 
};

