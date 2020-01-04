/*
 * @author afmika
 * @email afmichael73@gmail.com
 * github.com/afmika
 */

 
/*
* MAXIMISATION ET MINIMISATION D'UNE FONCTION QUELCONQUE A UNE VARIABLE 
*/
 
function derive(f, x) {
	// DERIVE EN UN POINT
	// ON SUIT LA FORMULE A LA LETTRE :)
	let dx = 0.0001;
	// note dy = df comme y(x) est la bonne notation et non pas f(x)
	let dy = ( f(x + dx) - f(x) );
	return dy / dx;
}

function maximiser(fonction, start) {
	console.log( "MAXIMISATION ");
	let etapes = 500;
	let pas = 0.01;
	let x = start;
	while(etapes > 0) {
		// gradient positif si on recherche le max
		 x = x + pas * derive(fonction, x );
		 etapes--;
		 console.log(x);
	}
	console.log(fonction.toString(), " x du maximum ", x, " y_max = ", fonction(x));	 
}

function minimiser(fonction, start) {
	console.log( "MINIMISATION ");
	let etapes = 500;
	let pas = 0.01;
	let x = start;
	while(etapes > 0) {
		// gradient negatif si on recherche le min
		x = x - pas * derive(fonction, x );
		etapes--;
		console.log(x);
	}
	console.log(fonction.toString(), " x du minimum ", x, " y_min = ", fonction(x));	 
}

// EXEMPLE

minimiser(function(x) {
	return x*x;
}, start = -10 );

/*
maximiser(function(x) {
	return -x*x - x;
}, start = -10 );
*/