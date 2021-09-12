


prnt=console.log;
ar=analogRead;
aw=analogWrite;
dr=digitalRead;
dw=digitalWrite;

//Pin connected to ST_CP of 74HC595
var latchPin = P1;
//Pin connected to SH_CP of 74HC595
var clockPin = P4;
////Pin connected to DS of 74HC595
var dataPin = P0;

//holders for infromation you're going to pass to shifting function






// var dataArray = new Uint8Array(1);
//
// //Binary notation as comment
// //dataArray[0] = 0x00; //0b00000000
//
//
// dataArray[0] = b ; //0b00000000
//
// l=dataArray.length;

// ///////////////////////////////////////////////////////////////
function shOut(myDataPin, myClockPin, myDataOut) {

    var i=0;
    var pinState;


    dw(myDataPin, 0);
    dw(myClockPin, 0);


    for(i=7;i>=0;i--){
        dw(myClockPin, 0);
        pinState=(myDataOut&(1<<i)) ? 1 : 0;
        //dw([myDataPin,myClockPin,myDataPin],[pinState,1,0])
        //Sets the pin to HIGH or LOW depending on pinState
        dw(myDataPin, pinState);
        //register shifts bits on upstroke of clock pin
        dw(myClockPin, 1);
        //zero the data pin after shift to prevent bleed through
        dw(myDataPin, 0);
    }
    //stop shifting
    dw(myClockPin, 0);
}
///////////////////////////////////////////////////////////////////////////
var LEDon=false;
j=0;

setInterval(function() {
    j=j%l;
    //load the light sequence you want from array
    prnt((dataArray[j]).toString(2));
    //ground latchPin and hold low for as long as you are transmitting
    dw(latchPin, 0);
    //move 'em out
    shOut(dataPin, clockPin, dataArray[j]);
    //return the latch pin high to signal chip that it
    //no longer needs to listen for information
    dw(latchPin, 1);

    LEDon = !LEDon;
    LED1.write(LEDon);
    j++;
}, 2000);

////////////////////////////////////////////

var arrWrite=[0,0,0,0,0,0,0,0];


var addr1=0;
var addr2=1;
var addr3=2;
var on=1;
var off=0;



arrWrite.splice(addr1, 1,on);
arrWrite.splice(addr2, 1,on);
arrWrite.splice(addr3, 1,on);


var arrWriteRev=arrWrite.reverse();
let str=arrWriteRev.join();//

let dataStr=str.replace(/,/g, '');//?

let decData= parseInt(dataStr, 2);//


//console.log(typeof(decData));
console.log(str);
console.log(dataStr);


///////////////////////////////////////////////////


dw(latchPin, 0);

shOut(dataPin, clockPin,decData );

dw(latchPin, 1);






