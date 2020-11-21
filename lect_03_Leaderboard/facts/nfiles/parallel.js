let fs = require("fs");

let files = ["../f1.txt" , "../f2.txt" , "../f3.txt"];


// async way , parallely , loops

// iterative code
// for(let i=0 ; i<files.length ; i++){
//     fs.readFile(files[i] , function(error ,data){
//         console.log("Content = "+ data);
//     })
// }
//for loop stack pe khatm ho jaega fir kisi bhi order mai files display ho jaengi


// recursive code

function fileReader(idx){
    if(idx == files.length){
        return;
    }
    
    fileReader(idx+1);
    
    fs.readFile(files[idx] , function(error ,data){
        console.log("Content = " + data);
    })

    //fileReader(idx+1);   kahi se bhi call lgao recc chlega and khatm hone pe sari file aa ajengi

    
}


fileReader(0);