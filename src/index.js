const { Logger }			= require('@whi/weblogger');
const log				= new Logger("identicons");

const { Pseudorandomizer }		= require('./pseudorandom.js');


function encodeColor({ h, s, l }) {
    return `hsl(${h}, ${s}%, ${l}%)`;
}

function createColor ( base, range, prng, grayscale ) {
    // hue is the whole color spectrum
    const radius		= range * 3.6 / 2;
    const h			= (prng.randint( (base * 360) - radius, (base * 360) + radius ) + 360) % 361; // (Math.floor( (base * 360) + (rand() * 90) )) % 361;
    // saturation goes from 40 to 100, it avoids greyish colors
    const s			= grayscale ? 0 : prng.randint( 85, 100 ); // (base * 360) - 45
    // lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
    const l			= prng.randint( 20, 80 ); // ((rand() + rand() + rand() + rand()) * 15) + 20;

    return {h, s, l}
}

const ellipse			= new Path2D();
ellipse.ellipse( .5, .5, .5, .5, 0, 0, Math.PI * 2 );

function randomPointInEllipse ( prng, ctx ) {
    const x			= prng.random();
    const y			= prng.random();
    const is_in_path		= ctx.isPointInPath( ellipse, x, y );
    log.debug("Point( %s, %s ) in path? %s", x, y, is_in_path );

    if ( is_in_path )
	return [ x, y ];
    else
	return randomPointInEllipse( ...arguments );
}

function renderDiscs( opts, canvas ) {
    if ( canvas === undefined )
	canvas			= document.createElement("canvas");

    const prng			= new Pseudorandomizer( opts.seed );
    const seed			= prng.input;

    const default_base		= prng.random();
    const base			= opts.base === undefined ? default_base : parseFloat(opts.base);
    const width			= opts.width		|| opts.size	|| canvas.offsetWidth;
    const height		= opts.height		|| opts.size	|| canvas.offsetHeight;

    if ( width === 0 || height === 0 )
	throw new Error(`Bad width or height (x = ${width}px, y = ${height}px); Cannot paint on an invisible canvas`);

    log.debug("Render for size %s/%s with seed: %s", width, height, seed );
    const ratio			= Math.min( width, height ) / Math.max( width, height );
    const maxSize		= opts.maxSize		|| Math.max( width, height ) * ( ratio + .5 );
    const minSize		= opts.minSize		|| Math.min( width, height ) * .1;
    const minDiscs		= opts.minDiscs		|| 6;
    const maxDiscs		= opts.maxDiscs		|| minDiscs*1.33;
    const color_range		= opts.colorRange	|| 10;
    const grayscale		= !!opts.grayscale;

    canvas.width		= width;
    canvas.height		= height;

    const ctx			= canvas.getContext('2d');

    log.debug("BG range reduction: %s / %s", color_range * 3.6 / 2, color_range / 20 + 3 );
    const bg_radius		= (color_range * 3.6 / 2) / (color_range/20 + 3); // base color has less range as the disc range grows
    const bg_base		= base * 360;
    log.debug("BG base/range = radius: %s/%s = %s", base.toFixed(2), color_range, bg_radius );

    const bg_range_min		= bg_base - bg_radius;
    const bg_range_max		= bg_base + bg_radius;
    const hue_selection		= prng.randint( bg_range_min, bg_range_max );
    const bg_hue		= (hue_selection + 361) % 361;
    log.debug("BG constraints: %s-%s = %s = %s", bg_range_min.toFixed(2), bg_range_max.toFixed(2), hue_selection, bg_hue );

    const background_color	= encodeColor({
	"h": bg_hue,
	"s": grayscale ? 0 : 80,
	"l": prng.randint( 20, 40 ),
    });

    ctx.fillStyle		= background_color;
    ctx.fillRect( 0, 0, canvas.width, canvas.height );

    const numDiscs		= prng.randint( minDiscs, maxDiscs );
    const discMulti		= [];
    const discSizes		= [];

    for (let i = 0; i < numDiscs; i++) {
	const multiplier	= ((i+1)/numDiscs) ** 2;
	discMulti.push( multiplier );
	discSizes.push( (prng.randint( minSize, maxSize ) * multiplier) + minSize );
    }

    discSizes.sort( (a,b) => {
	return a < b
	    ? 1
	    : a > b ? -1 : 0;
    });

    discSizes.forEach( discSize => {
	const radius		= discSize / 2;
	const color		= encodeColor( createColor(base, color_range, prng, grayscale ) );

	ctx.fillStyle		= color;
	ctx.beginPath();

	const [ x, y ]		= randomPointInEllipse( prng, ctx );
	const x_center		= (x * (width  + radius/2)) - radius/4;
	const y_center		= (y * (height + radius/2)) - radius/4;

	log.debug("Valid ellipse point( %s, %s )", x_center, y_center );

	ctx.arc(
	    x_center,
	    y_center,
	    radius,
	    0,
	    2*Math.PI
	);
	ctx.fill();
    });

    const dataURL		= canvas.toDataURL();

    return {
	canvas,
	width,
	height,
	ratio,
	maxSize,
	minDiscs,
	maxDiscs,
	color_range,
	bg_radius,
	dataURL,
	"settings": {
	    seed,
	    base,
	    numDiscs,
	    background_color,
	    discMulti,
	    discSizes,
	},
    };
}


module.exports			= {
    renderDiscs,

    logging ( level = "trace" ) {
	log.setLevel( level );
    },
};
