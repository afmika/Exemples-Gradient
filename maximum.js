/*
 * @author afmika
 * @email afmichael73@gmail.com
 * github.com/afmika
 */
 
 /*
 * Essayons de trouver le maximum de la fonction f(x) = -x*x - x
 */
 
 function derive_de_f(x) {
	 // derive -x*x - x = -2*x - 1
	 return -2*x - 1;
 }
 
 let etapes = 500;
 let pas = 0.01;
 let x = 1;
 while(etapes > 0) {
	// gradient positif si on recherche le max
	 x = x + pas * derive_de_f( x );
	 etapes--;
	 console.log(x);
 }
console.log("x_max = ",x, " et y_max = ", -x*x - x);
console.log("x_max = ",x, " et y_max = ", -x*x - x);