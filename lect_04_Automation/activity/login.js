/*IMPORTANT FUNCTIONS & POINTS
    1. puppeteer works on page/tab
    
    FUNCTIONS:
    1. .goto( link ) = goes to page after wait,like wait and click == ONLY FOR LINKS ==
    2. tab.type( selector, text ); //type emulates keyboard, it types data
    3. tab.click( selector ) 
    4. tab.waitForSelector( selector , { visible: true } ) === wait for that selector to load on page,then proceed
   
    5. tab.evaluate()  // tab.evaluate(cb function  , element   ) and return a pending promise with the value we need in that elt
                                                            //ex: returns href from a tag
    
    6. Promises.all()     //multiple pending promise pehle resolve ho jae, 
                        ex: yaha array of promise hai to all func necessary,vrna then(callback) se hi ho jata hai
    
    7. tab.$$( selector )    //query selector All
    8. tab.keyboard.down() tab.keyboard.up() tab.keyboard.press()

    */





// import puppeteer in login.js file
const puppeteer = require('puppeteer');

const id = "kixeko7216@patmui.com";
const pw = "khushi01";

let tab;
let idx;
let gCode;

// puppeteer functions => pending promise

// initialize a new browser window 
let windowOpenPromise = puppeteer.launch({
    headless:false,
    defaultViewport: null,
    args : ["--start-maximized"]
});

windowOpenPromise.then(function(browser){
    // get all opened tabs/pages ina form of array
    let pagesPromise = browser.pages();
    return pagesPromise;
})
.then(function(pages){
    // [ tab ];
    let page = pages[0];
    tab = page;
    // goto to the given link on current page
    let gotoPromise = page.goto("https://www.hackerrank.com/auth/login");
    return gotoPromise;
})
.then(function(){
    let idTypedPromise = tab.type("#input-1" , id); // emulates keyboard, it types
    return idTypedPromise;
})
.then(function(){
    let pwTypedPromise = tab.type("#input-2" , pw);
    return pwTypedPromise;
})
.then(function(){
    let loginPromise = tab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button");
    return loginPromise;
})
.then(function () {
    let waitAndClickPromise = waitAndClick("#base-card-1-link");
    return waitAndClickPromise; // Promise<Pending>
  })
  .then(function () {
    let waitAndClickPromise = waitAndClick('a[data-attr1="warmup"]');
    return waitAndClickPromise;
  })
  .then(function () {
    let waitPromise = tab.waitForSelector(
      ".js-track-click.challenge-list-item",
      { visible: true }
    );
    return waitPromise;
  })
  .then(function () {
    let allATagsPromise = tab.$$(".js-track-click.challenge-list-item");
    return allATagsPromise;
  })
  .then(function (allATags) {
    // [ <a> </a>   ,  <a> </a>   , <a> </a>   , <a> </a>   ];
    // let allLinksPromise = [Promise<data> , Promise<data> ,Promise<data> ,Promise<data> ];
    let allLinksPromise = [];
    for (let i = 0; i < allATags.length; i++) {
      let linkPromise = tab.evaluate(function (elem) { return elem.getAttribute("href"); }   ,   allATags[i]);
      allLinksPromise.push(linkPromise);
    }
    // Promise <resolve>
    let pendingPromise = Promise.all(allLinksPromise); //multiple pending promise pehle resolve ho jae, 
    return pendingPromise; //as yaha array of promise hai to all func necessary,vrna then(callback) se hi ho jata hai
  })
  .then(function (allLinks) {
    // [ link1 , link2 , link3 , link4  ];
    console.log(allLinks);
    let completeLinks = allLinks.map( function(link){
        return "https://www.hackerrank.com"+link;
    })
    //console.log(completeLinks);

     // using loops => chaining effect
    let quesSolvedPromise = solveQuestion(completeLinks[0]);
    for(let i=1 ; i<completeLinks.length ; i++){
      quesSolvedPromise = quesSolvedPromise.then(function(){
        let nextQuesSolvedPromise = solveQuestion(completeLinks[i]);
        return nextQuesSolvedPromise;
      })
    }
    return quesSolvedPromise;
  })
  .then(function(){
    console.log("All ques solved");
  })
  .catch(function(error){
      console.log(error);
  })

  function handleLockBtn(){
    return new Promise(function(resolve , reject){

      // let waitAndClickPromise = waitAndClick(".ui-btn.ui-btn-normal.ui-btn-primary");
      let waitPromise = tab.waitForSelector(".ui-btn.ui-btn-normal.ui-btn-primary" , {timeout:5000});
      waitPromise.then(function(){
        let lockBtnClickedPromise = tab.click(".ui-btn.ui-btn-normal.ui-btn-primary");
        return lockBtnClickedPromise;
      })
      .then(function(){
        // lock button found
        console.log("lock Button found !!");
        resolve();
      })
      .catch(function(error){
        // lock button not found !!
        console.log("lock Button not found !!");
        resolve();
      })
    })


  }


  function waitAndClick(selector){
      return new Promise( function(resolve , reject){
        let waitPromise = tab.waitForSelector(selector , { visible: true});
        waitPromise.then(function(){
            let clickPromise = tab.click(selector);
            return clickPromise;
        })
        .then(function(){
               resolve(); 
        })
        .catch(function(error){
            reject(error);
        })
      });



  }

  function getCode(){
    return new Promise(function(resolve , reject){
      let waitPromise = tab.waitForSelector(".hackdown-content h3" , {visible:true});
      waitPromise.then(function(){
        let codeNamesTagsPromise = tab.$$(".hackdown-content h3");
        return codeNamesTagsPromise;
      })
      .then(function(codeNamesTags){
        // [ <h3>C++</h3> , <h3>Python</h3> , <h3>Java</h3>    ]
        let allCodeNamesPromise = [];
        for(let i=0 ; i<codeNamesTags.length ; i++){
        let codeNamePromise =   tab.evaluate( function(elem){   return elem.textContent;     }   ,  codeNamesTags[i]);
        allCodeNamesPromise.push(codeNamePromise);
        }
        let pendingPromise = Promise.all(allCodeNamesPromise);
        return pendingPromise;
      })
      .then(function(allCodeNames){
        // [ "C++" , "Python" , "Java"  ];
        idx;
        for(let i=0 ; i<allCodeNames.length ; i++){
          if(allCodeNames[i] == "C++"){
            idx = i;
            break;
          }
        }
        let allCodeElementsPromise = tab.$$(".hackdown-content .highlight");
        return allCodeElementsPromise;
      })
      .then(function(allCodeElements){
        // [  <div class="highlight"> </div>  , <div class="highlight"> </div>  , <div class="highlight"> </div>  ];
        let codeDiv = allCodeElements[idx];
        let codePromise = tab.evaluate( function(elem){ return elem.textContent;  }   , codeDiv)
        return codePromise;
      })
      .then(function(code){
        // console.log(code);
        gCode = code;
        resolve();
      })
      .catch(function(error){
        reject(error);
      })
    })
  }

  function pasteCode(){
    return new Promise(function(resolve ,reject){
      let waitAndClickPromise = waitAndClick(".custom-input-checkbox");
      waitAndClickPromise.then(function(){
        let codeTypedPromise = tab.type(".custominput" , gCode);
        return codeTypedPromise;
      })
      .then(function(){
        let ctrlKeyHoldPromise = tab.keyboard.down('Control');
        return ctrlKeyHoldPromise;
      })
      .then(function(){
        let aKeyPressedPromise = tab.keyboard.press('A');
        return aKeyPressedPromise;
      })
      .then(function(){
        let xKeyPressedPromise = tab.keyboard.press('X');
        return xKeyPressedPromise;
      })
      .then(function(){
        let codeBoxClickedPromise = tab.click(".monaco-scrollable-element.editor-scrollable.vs");
        return codeBoxClickedPromise;
      })
      .then(function(){
        let aKeyPressedPromise = tab.keyboard.press('A');
        return aKeyPressedPromise;
      })
      .then(function(){
        let aKeyPressedPromise = tab.keyboard.press('V');
        return aKeyPressedPromise;
      })
      .then(function(){
        let ctrlKeyUpPromise = tab.keyboard.up('Control');
        return ctrlKeyUpPromise;
      })
      .then(function(){
        resolve();
      })
      .catch(function(error){
        reject(error);
      })


    })
  }

  function solveQuestion(qLink){
    return new Promise( function(resolve , reject){
      
        let questionOpenedPromise = tab.goto(qLink);
      questionOpenedPromise.then(function(){
        let waitAndClickPromise = waitAndClick("#Editorial");
        return waitAndClickPromise;
      })
      .then(function(){
        let lockBtnPromise = handleLockBtn();
        return lockBtnPromise;
      })
      .then(function(){
        let getCodePromise = getCode();
        return getCodePromise;
      })
      .then(function(){
        let problemTabClickedPromise = tab.click("#Problem");
        return problemTabClickedPromise;
      })
      .then(function(){
        let codePastedPromise = pasteCode();
        return codePastedPromise;
      })
      .then(function(){
        let submitCodePromise = tab.click(".pull-right.btn.btn-primary.hr-monaco-submit");
        return submitCodePromise;
      })
      .then(function(){
        resolve();
      })
      .catch(function(error){
        reject(error);
      })

    })
  }