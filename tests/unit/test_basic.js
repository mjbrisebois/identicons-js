const log				= require('@whi/stdlog')( __filename.split('/').slice(-1)[0], {
    level: process.env.LOG_LEVEL || 'fatal',
});

const puppeteer				= require('puppeteer');
const { expect }			= require('chai');


const LOG_LEVEL				= process.env.LOG_LEVEL
      ? process.env.LOG_LEVEL.replace("silly", "trace")
      : "normal";
const delay				= ms => new Promise(f => setTimeout(f, ms));


function basic_tests () {
    let browser, page;

    before(async function () {
	browser				= await puppeteer.launch({
	    "headless": true,
	    "devtools": true,
	    "args": [
		"--disable-web-security",
	    ],
	});
	page				= await browser.newPage();

	page.on("console", async msg => {
	    let handles			= msg.args();
	    let text			= handles.shift().toString();

	    let sub_count		= text.match(/(%[oOdisc]{1}|%[0-9.]*?f)/g).length;

	    let subs			= handles.slice(0,sub_count).map( h => h.toString().slice(9) );

	    if ( process.env.LOG_LEVEL === "silly" )
		console.log("\x1b[90mPuppeteer console.log( \x1b[37m"+ text +" \x1b[90m)\x1b[0m", ...subs );
	});
    });
    after(async function () {
	await browser.close();
    });

    it("should mount component", async function () {
	const url			= "file://" + __filename.split("/").slice(0,-2).join("/") + "/discs.html";

	await page.goto( url );

	await page.evaluate(async ( level ) => {
	    Identicons.logging( level );
	}, LOG_LEVEL );

	log.normal("Create identicon");
	const dataURL			= await page.evaluate(async () => {
	    const icon			= Identicons.renderDiscs({
		"seed": "hello world",
		"size": 10,
	    });

	    return icon.dataURL;
	});

	expect( dataURL			).to.have.string("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs");
    });
}

describe("Integration", () => {
    describe("EntityType class", basic_tests );
});
