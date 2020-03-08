/**
 * @author afmika
 *
 * Maximisation d'une fonction a variable reelle x
 * avec un algo genetique 
 */
const taille_adn = 50; // la longueur de la chaine
const taux_mutation = 0.2; // proba mutation
const taux_reproduction = 0.3;
const nombre_population = 100;


// variable i contenir ny population tsika
let population = [];

/**
 * Fonctions sy structures utiles
 */
function Individu(adn) {
	// mini classe ou objet/structure capturant la notion d'individu
	this.adn = adn;
	this.score = 0;
}
function trierDecroissant(population) {
	for(let i = 1; i < population.length; i++) {
		if(population[i - 1].score < population[i].score) {
			let temp = population[i - 1];
			population[i - 1] = population[i];
			population[i] = temp;
			trierDecroissant(population);
		}
	}
}
function individuRandom() {
	let adn = [];
	for(let i = 0; i < taille_adn; i++) {
		adn[i] = Math.random() / taille_adn;
	}
	return new Individu(adn);
}
function initialiserPopulation() {
	for(let i = 0; i < nombre_population; i++) {
		population.push( individuRandom() );
	}
}



/**
 * Coeur de l'algo
 */
function evaluer(individu) {
	let x = 0;
	for(let i = 0; i < taille_adn; i++) {
		// definissons juste x comme etant la somme de nombres
		// l'algo se debrouillera pour trouver les bons parametres ymax = f(x) = f(ADN)
		x += individu.adn[i];
	}
	// exemple -x^2 + 2
	individu.score = -Math.pow(x, 2) + 2;
}

function evaluerPopulation(population) {
	population.forEach(x => {
		evaluer(x);
	});
}

// mutation
function effectuerMutation(individu) {
	for(let i = 0; i < taille_adn; i++) {
		if(Math.random() <= taux_mutation) {
			// la division c'est juste une question d'esthetique
			// pour faire en sorte de repartir les valeurs sur la chaine
			individu.adn[i] = Math.random() / taille_adn;			
		}
	}
}

// accouplement
function crossOver(pere, mere) {
	let enfant = new Individu([]);
	let moitie = Math.floor( taille_adn / 2 );
	for(let i = 0; i < taille_adn; i++) {
		const gene = i < moitie ? pere.adn[i] : mere.adn[i];
		enfant.adn.push( gene );
	}
	return enfant;
}



/**
 * Algorithme genetique
 */
let generation_max = 1000;
let generation = 1; 

initialiserPopulation();

while( generation < generation_max ) {
	evaluerPopulation( population );
	
	trierDecroissant( population );
	
  /**
	* Affichages
	**/
	let fitest = population[0];

	if(generation % 10 == 0) {
		console.log("Note ( = y_max) ",fitest.score , " generation ", generation);			
	}
	
	
	/*
	* Etape de selection + accouplement
	**/

	let nouvelle_gen = [];
	let parents = []; // parents => les 'fitest'
	let pourcentage_parent = taux_reproduction * population.length;
	
	// on choisi les parents
	population.forEach( (individu, index) => {
		if(index <= pourcentage_parent) {
			parents.push( individu ); // parents
			
			nouvelle_gen.push( individu ); 
		}
	});
	
	// on concoit les enfants en remplacant les places manquantes
	while(nouvelle_gen.length < population.length) {
		let index_pere = Math.floor(Math.random() * parents.length);
		let index_mere = Math.floor(Math.random() * parents.length);
		if(index_mere != index_pere) {
			const pere = parents[ index_pere ];
			const mere = parents[ index_mere ];
			let enfant = crossOver(pere, mere);
			
			effectuerMutation( enfant ); // on mute la sequence enfant selon la proba fixee en haut
			nouvelle_gen.push( enfant );
		}
	}
	
	// on remplace integralement l'ancienne population par les fitest et leurs enfants + mutation
	population = nouvelle_gen;
	generation++;
}