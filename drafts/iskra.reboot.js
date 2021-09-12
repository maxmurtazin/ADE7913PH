var on = false;
setInterval(function() {
  on = !on;
  console.log(on);
  LED1.write(on);
}, 1000);
