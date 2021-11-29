let ADE7912 = require('ADE7912');
let ade7912 = ADE7912.device({
    CSpin: B1,
    DRpin: C3
});

// ade7705.readChannel(ad7705.CHN_AIN1);

ade7912.init();
ade7912.init_chip();

setInterval(function() {
    v1 = ade7912.loop_ISR();
    console.log('v1', v1);
}, 500);



