const READ_LOOP = 53;
var AD7912 = require('AD7912_test');
var ad7912 = AD7912.create(2.5);
//const REG_V1WV           =0x01; 
//ad7912.init();

var v1;

setInterval(function() {
  v1 = ad7912.READ();
  //ph1 = 8.074*v1-9.884 ;
 // console.log('v1', v1);
  //console.log('ph1', ph1);
}, READ_LOOP);

