12 sept 2021.
six chip ADE7912 
Six electrodes
to do
1.Learn JS- ok
2.Draw scheme Draw to connect chips (in vector graphics)
3.Make scheme on breadboard ok
4.Write module to work with chips
4.1.Write to work with one chip
4.2. Write to work with six chips
5.Test them
6.Solder scheme
7.Test 
8.End of work

/////////////////////////////////////////////////////////////////
//ISKRA JS//
//ADE7912 one voltage input, 3.3 V -VDD;
//six device, two crystal 4 MHz, 10pins
//3st - crystal 1, 6st -crystal 2;
//CSpins
// one group
// 1st- B11(P0)
// 2st - B10(P1)
// 3st- C3(P4)
// two group
// 4st - B1(P5)
// 5st- B0(P6)
// 6st - C2(P7)

// DRpin _ 1st dev - C7 (P9)
// DRpin _ 4st dev - C6 (P8)

//SCLK - A5 (A5)
// MISO - A7 (P3) - pull out 10KOhm resistor to 3.3 V
// MOSI - A6 (P2)
//////////////////////////////////
//one device
//crystal 4 MHz, 14-13 pins dev ADE7912
//CS- B11(P0)
//SCLK - A5 (A5)
// MISO - A7 (P3) - pull out 10KOhm resistor to 3.3 V
// MOSI - A6 (P2)
//DRpin _ 1st dev - C7 (P9)