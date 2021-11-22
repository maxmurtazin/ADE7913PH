const PORT = 80;
const READ_LOOP = 541; //ms (prime)
const LED_LOOP = 2003; //ms (prime)
const LED_RESPONSE_MS = 227; //ms (prime)

var AD7705 = require('drafts/AD7705');

// pH-meters //

var PhMeter = function (c) {
  c = c || {};
  this.val = c.val || 0;
  this.digits = c.digits || 2;
  this.slope = c.slope || 1;
  this.intercept = c.intercept || 0;
  this.ch = AD7705.channel(c);
  // getters:
  Object.defineProperties(this, {
    valFixed: {
      get: function() {
        return this.val.toFixed(this.digits)
      },
      enumerable: true
    }
  })
};

PhMeter.prototype.read = function () {
  var buf = this.slope * this.ch.read() + this.intercept;
  // Усреднение по 3 точкам
  this.val = (2 * this.val + buf) / 3;
  return this.val
};

var pHreads = {};

var phArr = {
  D0: new PhMeter({
    CSpin: B1,
    DRpin: C3,
    channel: 'CHN_AIN1'
  }),
  D2: new PhMeter({
    CSpin: B0,
    DRpin: C6,
    channel: 'CHN_AIN1'
  }),
  C1: new PhMeter({
    CSpin: C2,
    DRpin: C7,
    channel: 'CHN_AIN1'
  }),
  D1: new PhMeter({
    CSpin: B1,
    DRpin: C3,
    channel: 'CHN_AIN2'
  }),
  C2: new PhMeter({
    CSpin: B0,
    DRpin: C6,
    channel: 'CHN_AIN2'
  }),
  C3: new PhMeter({
    CSpin: C2,
    DRpin: C7,
    channel: 'CHN_AIN2'
  })
};

const getPhReads = function (phArr) {
  var res = {};
  for (var ph in phArr) {
    phArr[ph].ch.read();
    res[ph] = { readings: {} };
    res[ph].readings.pH = phArr[ph].ch.valFixed;
  }
  return res;
};

// Objects manipulation //

const mergeReads = function (target, source) {
  for (var g in source) {
    if (target[g]) {
      for (var r in source[g].readings) {
        if (target[g].readings[r]) {
          Object.assign(
            target[g].readings[r],
            source[g].readings[r]);
        } else {
          target[g].readings[r] =
            source[g].readings[r];
        }
      }
    } else {
      target[g] =
        source[g];
    }
  }
  return target;
};

// Flow Sensors //

// const PULSE_PER_LITRE = 5880;

// var flowReads = {};

// var flowArr = {
//   D0: {
//     addr: P2,
//     val: 0,
//     digits: 2,
//     ppl: PULSE_PER_LITRE,
//     units: 'l/h',
//     connect: null
//   },
//   C3: {
//     addr: P3,
//     val: 0,
//     digits: 2,
//     ppl: PULSE_PER_LITRE,
//     units: 'l/h',
//     connect: null
//   }
// };

// const connectFlowMeters = function (flowArr) {
//   for (var fl in flowArr) {
//     flowArr[fl].connect =
//       require('@amperka/water-flow')
//         .connect(
//           flowArr[fl].addr,
//           {pulsesPerLitre: flowArr[fl].ppl});
//   }
// };

// const getFlowReads = function (flowArr) {
//   var res = {};
//   for (var fl in flowArr) {
//     flowArr[fl].val =
//       flowArr[fl].connect.speed(flowArr[fl].units);
//     res[fl] = { readings: {} };
//     res[fl].readings.flow =
//       flowArr[fl].val.toFixed(flowArr[fl].digits);
//   }
//   return res;
// };

// READ LOOP //

var reads = {};

// connectFlowMeters(flowArr);
setInterval(function() {
  // flowReads = getFlowReads(flowArr);
  pHreads = getPhReads(phArr);
  reads = JSON.stringify(pHreads);
  // reads = JSON.stringify(mergeReads(pHreads, flowReads));
}, READ_LOOP);

// HTTP SERVER //

// Настраиваем соединение с Ethernet Shield по протоколу SPI.
SPI2.setup({baud: 3200000, mosi: B15, miso: B14, sck: B13});
var eth = require('WIZnet').connect(SPI2, P10);
// Получаем и выводим IP-адрес от DHCP-сервера
eth.setIP({
  ip: "25.25.5.205",
  subnet: "255.255.255.0",
  gateway: "25.25.5.1",
  dns: "25.25.5.1",
  mac: "00:08:dc:01:02:03"
});
print(eth.getIP());

// GET //

require("http").createServer(function (req, res) {
  setTimeout(function() {
    on = !on;
    LED1.write(on);
  }, LED_RESPONSE_MS);

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(reads);
  res.end();
}).listen(PORT);

// LED //

var on = false;
setInterval(function() {
  on = !on;
  LED1.write(on);
}, LED_LOOP);
