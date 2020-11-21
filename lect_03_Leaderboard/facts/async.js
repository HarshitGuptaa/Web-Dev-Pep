let fs = require("fs");




console.log("start");

// async task
fs.readFile("./f1.txt" , cb);

function cb(error , data){
    console.log("Content = "+ data); //yaha cb node api pe chla jaata hai not on stack
                                //stack khaali hone pe ye chlega
}


console.log("end");
console.log("end");
console.log("end");
console.log("end");
console.log("end");
console.log("end");
console.log("end");
console.log("end");


// let count=1;
// while(true){                      //cb never runs here as stack never gets empty
//     console.log(count);
// count++;
// }