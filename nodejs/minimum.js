/*
 * @author afmika
 * @email afmichael73@gmail.com
 * github.com/afmika
 */
 
 /*
 * Essayons de trouver le minimum de la fonction f(x) = x^2
 */
 
 function derive_de_f(x) {
	 return 2 * x;
 }
 
 let etapes = 500;
 let pas = 0.01;
 let x = -5;
 while(etapes > 0) {
	 // sens inverse du gradient si on recherche le min
	 x = x - pas * derive_de_f( x );
	 etapes--;
	 console.log(x);
 }
console.log("x_min = ",x, " et y_min = ", -x*x - x);
console.log("x_min = ",x, " et y_min = ", -x*x - x);