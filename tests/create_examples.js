const log				= require('@whi/stdlog')( __filename.split('/').slice(-1)[0], {
    level: process.env.LOG_LEVEL || 'fatal',
});

const fs				= require('fs');
const path				= require('path');
const puppeteer				= require('puppeteer');


async function randomExamples ( page, width ) {
    const count				= 11;

    for ( let i=0; i < count; i++ ) {
	const size			= width / count;
	const result			= await page.evaluate(async ( size ) => {
	    return Identicons.renderDiscs({
		size,
	    });
	}, size );

	const filename			= path.resolve( __dirname, "../docs/images/", `random-${String(i+1).padStart(2, "0")}.png` );
	const bytes			= Buffer.from( result.dataURL.split(",")[1], "base64" );

	console.log("Writing random identicon to file: %s", filename );
	fs.writeFileSync( filename, bytes );
    }
}

async function discBaseExamples ( page, width ) {
    const count				= 11;
    let seed;

    for ( let i=0; i < count; i++ ) {
	const base			= i / (count-1);
	const size			= width / count;
	const result			= await page.evaluate(async ( base, seed, size ) => {
	    return Identicons.renderDiscs({
		base,
		seed,
		size,
	    });
	}, base, seed, size );

	seed				= result.settings.seed;
	const filename			= path.resolve( __dirname, "../docs/images/", `disc-base-${String(i+1).padStart(2, "0")}.png` );
	const bytes			= Buffer.from( result.dataURL.split(",")[1], "base64" );

	console.log("Writing identicon (base %s) to file: %s", base.toFixed(2), filename );
	fs.writeFileSync( filename, bytes );
    }
}

async function randomDiscBaseExamples ( page, width ) {
    const count				= 11;

    for ( let i=0; i < count; i++ ) {
	const base			= i / (count-1);
	const size			= width / count;
	const result			= await page.evaluate(async ( base, size ) => {
	    return Identicons.renderDiscs({
		base,
		size,
	    });
	}, base, size );

	const filename			= path.resolve( __dirname, "../docs/images/", `random-disc-base-${String(i+1).padStart(2, "0")}.png` );
	const bytes			= Buffer.from( result.dataURL.split(",")[1], "base64" );

	console.log("Writing identicon (base %s) to file: %s", base.toFixed(2), filename );
	fs.writeFileSync( filename, bytes );
    }
}

async function randomDiscBaseRangeExamples ( page, width, color_range ) {
    const count				= 11;

    for ( let i=0; i < count; i++ ) {
	const base			= i / (count-1);
	const size			= width / count;
	const result			= await page.evaluate(async ( base, size, colorRange ) => {
	    return Identicons.renderDiscs({
		base,
		size,
		colorRange,
	    });
	}, base, size, color_range );
	console.log( result );

	const filename			= path.resolve( __dirname, "../docs/images/", `random-disc-range-${color_range}-${String(i+1).padStart(2, "0")}.png` );
	const bytes			= Buffer.from( result.dataURL.split(",")[1], "base64" );

	console.log("Writing identicon (base %s) to file: %s", base.toFixed(2), filename );
	fs.writeFileSync( filename, bytes );
    }
}

async function sizeExamples ( page, sizes, seed ) {
    await Promise.all( Object.entries( sizes ).map( async ([ size_name, [width, height]]) => {
	const result			= await page.evaluate(async ( seed, width, height ) => {
	    return Identicons.renderDiscs({
		seed,
		width,
		height,
	    });
	}, seed, width, height );

	const filename			= path.resolve( __dirname, "../docs/images/", `size-${size_name}.png` );
	const bytes			= Buffer.from( result.dataURL.split(",")[1], "base64" );

	console.log("Writing identicon to file: %s", filename );
	fs.writeFileSync( filename, bytes );
    }) );
}

(async function main() {
    const url				= "file://" + __filename.split("/").slice(0,-1).join("/") + "/index.html";
    const browser			= await puppeteer.launch({
	"headless": true,
	"devtools": true,
	"args": [
	    "--disable-web-security",
	],
    });
    const page				= await browser.newPage();

    page.on("console", async msg => {
	let handles			= msg.args();
	let text			= handles.shift().toString();
	let sub_count			= text.match(/(%[oOdisc]{1}|%[0-9.]*?f)/g).length;
	let subs			= handles.slice(0,sub_count).map( h => h.toString().slice(9) );

	console.log("\x1b[90mPuppeteer console.log( \x1b[37m"+ text +" \x1b[90m)\x1b[0m", ...subs );
    });

    try {
	log.normal("Go to '%s'", url );
	await page.goto( url );

	const readme_width		= 750; // 838px
	const example_types		= [
	    "random",
	    "disc-base",
	    "random-disc-base",
	    "disc-color-range",
	    "disc-anycolor-range",
	    "size",
	];
	let commands			= process.argv.slice(2).map( cmd => cmd.trim() );

	if ( commands.length === 0 )
	    console.log("Choose at least one example type:\n\n    %s\n", example_types.join("\n    ") );

	if ( commands.includes("all") )
	    commands			= example_types;

	for ( let cmd of commands ) {
	    switch ( cmd ) {
	    case "random":
		await randomExamples( page, readme_width );
		break;
	    case "disc-base":
		await discBaseExamples( page, readme_width );
		break;
	    case "random-disc-base":
		await randomDiscBaseExamples( page, readme_width );
		break;
	    case "disc-color-range":
		await randomDiscBaseRangeExamples( page, readme_width, 30 );
		break;
	    case "disc-anycolor-range":
		await randomDiscBaseRangeExamples( page, readme_width, 100 );
		break;
	    case "size":
		await sizeExamples( page, {
		    "square": [ 200, 200 ],
		    "rectangle": [ 600, 200 ],
		    "banner": [ 838, 100 ],
		}, "hello world" );
		break;
	    }
	}

    } finally {
	await browser.close();
    }
})();
