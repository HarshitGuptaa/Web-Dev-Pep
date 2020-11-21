const puppeteer = require("puppeteer");

const id = "kixeko7216@patmui.com";
const pw = "khushi01";

let tab;
let gBrowser;

(async function(){
    try{
        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"],
          });
          gBrowser = browser;
        let pages = await browser.pages();
        let page = pages[0];
        tab = page;
        await page.goto("https://www.hackerrank.com/auth/login");
        await page.type("#input-1", id);
        await page.type("#input-2", pw); 
        await Promise.all( [ page.waitForNavigation({waitUntil:"networkidle0"}) , page.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button") ]);
        await page.click('a[data-analytics="NavBarProfileDropDown"]'); 
        await Promise.all( [ page.waitForNavigation({waitUntil:"networkidle0"}) , page.click('a[data-analytics="NavBarProfileDropDownAdministration"]')]); 
        let bothLis = await page.$$('.nav-tabs.nav.admin-tabbed-nav li');
        let manageChallengeLi = bothLis[1];
        await Promise.all( [ page.waitForNavigation({waitUntil:"networkidle0"}) , manageChallengeLi.click()]);
        await addModerators(); //add moderators to all the challenges on each page
    }
    catch(error){
        console.log(error);
    }
})();


async function addModerators(){
    await tab.waitForSelector(".backbone.block-center",{visible:true});
    let allAtags = await tab.$$(".backbone.block-center");
    let allLinks = [];
    for(let i=0;i<allAtags.length;i++){
        let link = await tab.evaluate( function(elem){return elem.getAttribute("href")} , allAtags[i])
        let completeLink = "https://www.hackerrank.com"+link;
        allLinks.push(completeLink);
    }
    // console.log(allLinks);
    
    //now parallely mods add hoe and after adding all,we move to next page
    let allModsAddPromise = [];
    for(let i=0;i<allLinks.length;i++){
        let newTab = await gBrowser.newPage();
        let modAddPromise = addModeratorToQues(newTab,allLinks[i]);
        allModsAddPromise.push(modAddPromise);
    }

    await Promise.all(allModsAddPromise);

    //now pg1 is done,move to next
    let allLis =await tab.$$(".pagination li");
    let nextPage = allLis[allLis.length-2];
    let isDisabled =await tab.evaluate(function(elem){elem.classList.contains("disabled")} , nextPage);
    if(isDisabled){
        return;
    }
    await nextPage.click();
    await addModerators();
    
}

async function handleConfirmBtn(tab){
    try{
        await tab.waitForSelector('#confirm-modal' , {visible:true , timeout:5000});
        await tab.click('#confirmBtn');
        console.log("Confirm Button found !!");
    }
    catch(err){
        console.log("Confirm Button not found !!");
        return;
    }
}
async function addModeratorToQues(tab,link){
    await tab.goto(link);
    await handleConfirmBtn(tab);
    await tab.waitForSelector('li[data-tab="moderators"]' , {visible:true});
    await tab.click('li[data-tab="moderators"]');
    await tab.waitForSelector("#moderator" , {visible:true});
    await tab.type("#moderator" ,"Harshit");
    await tab.keyboard.press("Enter");
    await tab.click('.save-challenge.btn.btn-green');
    await tab.close();
}