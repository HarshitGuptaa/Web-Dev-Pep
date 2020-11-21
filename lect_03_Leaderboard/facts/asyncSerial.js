// async // multiples files // serial

let fs = require("fs");

console.log("start");

fs.readFile("./f1.txt" , function(error , data){
    console.log("Content = "+ data);
    fs.readFile("./f2.txt" , function(error , data){
        console.log("Content = "+ data);
        fs.readFile("./f3.txt" , function(error , data){
            console.log("Content = "+ data);
        });
    });
});

//f1 -> f2 -> f3  this is callback hell


console.log("end");