/*
 * @author afmika
 * @email afmichael73@gmail.com
 * github.com/afmika
 */

let points = [
	// Pomme
	{x: 1, y : 2},
	{x: 2, y : 2.5},
	{x: 2, y : 3.5},

	// Poire
	{x: 2, y : 1.5},
	{x: 1, y: 1},
	{x: 4, y : 3.5},
	
];

/*
 But: minimiser l'erreur quadratique : L'erreur de m(x) par rapport AUX DONNEES
* m(x) = a*x + b
* E(a, b) = Somme (yi - m(xi) )^2 pour i = 1, ... , n (exemple (x0, y0) = (3, -2) pour nos donnees )
* Donc
* E(a, b) = Somme (yi - a*xi - b )^2
*
* Comme le but est de chercher a et b minimisant E(a, b)
* On calcule Gradient E = Vecteur dont les lignes sont dE/da et dE/ b
*
* Calcul des composantes du gradient 
* dE / da = Somme [-2*xi*(yi - a*xi - b )]
* dE / db =  Somme [-2*(yi - a*xi - b )]
*
* On connait donc la direction du vecteur gradient
* On peut maintenant se deplacer dans l'espace sachant ce vecteur
* ET 'Minimisation' implique de mettre un signe - devant le gradient (Comme la direction par defaut maximise)
* Vecteur(a b) <- (a b) - gradient E 
* Ce qui signifie
* a <- a - dE/da
* b <- b - dE/db
*/



 let etapes = 500;
 let pas = 0.01;
 
 let a = 0; // Math.random();
 let b = 0; // Math.random();
 while(etapes > 0) {
	// gradient negatif si on recherche le min
	let delta_a = 0, delta_b = 0;
	
	// calcul dE/da et dE/db
	points.forEach(point => {
		let xi = point.x, 
			yi = point.y;
			
		
		/*
		Pour un reseaux de neurone cette partie equivaut a :
		dwi = taux * xi * (yi - si);
		*/
		
		let si = a * xi + b; // juste pour clarifier les choses
		// delta_a += -2 * xi * (yi - si);  // AVANT
		delta_a += pas * xi * (yi - si);  // VERSION 2
		// delta_b += -2 * (yi - si); // AVANT
		delta_b += pas * (yi - si); // VERSION 2
	});
	
	/*
	Pour un reseaux de neurone cette partie equivaut a :
	wi += dwi;
	*/
	
	// mise a jour :: minimisation = signe negatif  = sens inverse du gradient
	
	// a = a - pas * delta_a;   // AVANT
	a = a + delta_a; // VERSION 2
	// b = b - pas * delta_b;   // AVANT
	b = b + delta_b; // VERSION 2
	
	etapes--;
}
// va donner environ  m(x) = 0.66x + 0.99
console.log(`Droite m(x) = ${a}x + ${b}`);