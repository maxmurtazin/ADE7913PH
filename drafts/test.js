bitRead = function (number, index) {
    let binary = number.toString(2);
    return (binary[(binary.length - 1) - index] == "1"); // index backwards
}

console.log(bitRead(2,1));