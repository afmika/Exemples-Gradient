/**
 * @author afmika
 * 
 * Recherche d'une combinaison de mot dans l'ensemble
 * des possibilites avec un algo genetique de facon efficace
 */
 
const objectif = "salut bary. ito le phrase tadiavina";
const alphabet = "abcdefghijklmnopqrstuvwxyz.!?# ";

// parametres reglables
const taux_mutation = 0.2; // proba mutation
const taux_reproduction = 0.3; // on ne retient que 30% ny population les plus adaptees
const nombre_population = 100;



let population = [];

/**
 * Fonctions + structures utiles
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
	for(let i = 0; i < objectif.length; i++) {
		let index_random = Math.floor(Math.random() * alphabet.length);
		adn[i] = alphabet[index_random];
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
	let score = 0;
	for(let i = 0; i < objectif.length; i++) {
		if(individu.adn[i] == objectif[i]) {
			score++;
		}
	}
	individu.score = score;
}

function evaluerPopulation(population) {
	population.forEach(x => {
		evaluer(x);
	});
}

// mutation
function effectuerMutation(individu) {
	for(let i = 0; i < objectif.length; i++) {
		if(Math.random() <= taux_mutation) {
			let index_random = Math.floor(Math.random() * alphabet.length);
			individu.adn[i] = alphabet[index_random];			
		}
	}
}

// accouplement
function crossOver(pere, mere) {
	let enfant = new Individu([]);
	let moitie = Math.floor( objectif.length / 2 );
	for(let i = 0; i < objectif.length; i++) {
		const gene = i < moitie ? pere.adn[i] : mere.adn[i];
		enfant.adn.push( gene );
	}
	return enfant;
}



/**
 * Algorithme genetique
 */
let generation_max = 10000;
let generation = 1; 

initialiserPopulation();

while( generation < generation_max ) {
	// etape d'evaluation
	evaluerPopulation( population );
	
	// triena amatarana ze mahay be fotsiny
	trierDecroissant( population );
	
  /**
	* Affichages
	**/
	let fitest = population[0]; //le fitest
	if(fitest.score == objectif.length) {
		console.log("* Sequence adn trouvee apres ", generation, " generations");
		console.log("adn => ", fitest.adn.join(""));
		break;
	} else {
		if(generation % 200 == 0) {
			console.log(fitest.adn.join(""), " => note ",fitest.score , " generation ", generation);			
		}
	}
	
	
	/*
	* Etape de selection + accouplement
	**/

	// selectionnena le mahay indrindra d atao mfanambady
	let nouvelle_gen = [];
	let parents = [];  // parents => les 'fitest'
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