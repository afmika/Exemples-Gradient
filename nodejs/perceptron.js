/**
 * @author afmika
 * @email afmichael73@gmail.com
 * github.com/afmika
 */

//var. globales
let points = [];
let weights = [];


function initialiser () {	
	points = [
		// last index = biais = tjrs 1
		// OU-logique
		{x: [1, 0, 1], label : 1},
		{x: [0, 1, 1], label : 1},
		{x: [0, 0, 1], label : 0},
		{x: [1, 1, 1], label : 1}	
	];
	
	weights = new Array( points[0].x.length )
			  .fill( 0 )
			  .map(w => -1 + 2 * Math.random() ); // random(-1, 1)
}


// sigmoide
function sigmoid(x) {
	return 1 / (1 + Math.exp(-x));
} 

function arrondir ( output ) {
	return Math.round(output * 1000) / 1000;
}

function prod(x, y) {
	let s = 0;
	for (let i = 0; i < x.length; i++) {
		s += x[i] * y[i];
	}
	return s;
}


// BACKPROP PUR (d'apres les calculs persos)
function RegleBackProp (etapes, pas) {	
	while(etapes > 0) {
		// w[i] += dw[i]
		// calcul de dw[i]
		points.forEach(point => {
			let output = sigmoid( prod(point.x, weights) );
			let y = point.label;

			// let changes = [];
			
			for (let i = 0; i < point.x.length; i++) {
				let xi = point.x[i];
				let dw = -pas * (y - output) * output * (1 - output) * xi;
				// changes.push( -dw );
				weights[i] += -dw; // on accumule chaque partie de la somme
			}

			// for (let i = 0; i < weights.length; i++ ) {
				// weights[i] += changes[i];
			// }
		});
		etapes--;
		
	}
}


// REGLE DELTA
function RegleDelta (etapes, pas) {	
	while(etapes > 0) {
		// regle du delta
		// tsy maka alavitra ito y - output fotsiny dia vita
		points.forEach(point => {
			let output = sigmoid( prod(point.x, weights) );
			let y = point.label;
			for (let i = 0; i < point.x.length; i++) {
				let xi = point.x[i];
				// petite diff. avec la backprop
				// la regle delta force un peu les choses
				let dw = -pas * (y - output) * xi;
				weights[i] += -dw; // on accumule chaque partie de la somme
			}
		});
		etapes--;
	}
}

// Pour tester les poids
function test ( name ) {	
	console.log( "Test ", name );
	let dist_accumulee = 0;
	points.forEach(point => {	
		let output = sigmoid(prod(point.x, weights));
		output = arrondir ( output );
		dist_accumulee += (point.label - output);		
		console.log(output, "VS", point.label);
	});
	
	console.log("Distance moyenne : "+ arrondir(Math.abs(dist_accumulee) / points.length) );
}

// Application du backprop sur le perceptron
let etapes = 1000;
let pas = 0.8;

initialiser ();
RegleBackProp ( etapes, pas );
test ('BACKPROP');
console.log('W = ',weights);

console.log();

// regle du delta : standard pour entrainer un perceptron
initialiser ();
RegleDelta ( etapes, pas );
test ('REGLE DELTA');
console.log('W = ',weights);
