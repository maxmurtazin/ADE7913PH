let ADE7912 = require('ADE7912');
let ade7912 = ADE7912.device({
    //CSpin: P5,
   // DRpin: P4
});



ade7912.init();
ade7912.init_chip();

setInterval(function() {
    ade7912.loop_ISR();
}, 5000);



ade7912.dataReady_ISR();
setInterval(function() {
    v1 = ade7912.SHOW();
}, 5000);
