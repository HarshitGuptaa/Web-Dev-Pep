  
// async // multiples files // async way me

let fs = require("fs");

console.log("start");

fs.readFile("./f1.txt" , function(error , data){
    console.log("Content = "+ data);
});
fs.readFile("./f2.txt" , function(error , data){
    console.log("Content = "+ data);
});
fs.readFile("./f3.txt" , function(error , data){
    console.log("Content = "+ data);
});
 
//random order mai koi file kabhi bhi aa jaegi


console.log("end");