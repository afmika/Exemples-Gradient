/**
 * @author afmika
 *
 * On a un espace fixe de taille K
 * On a N objets et chaque objet occupe une taille fixe
 * Prendre M objets  parmis les N de facon a maximiser
 * le nombre des objets
 *
 * Par exemple on a 4 films, on veut graver les films sur un CD
 * de facon a optimiser le nombre de film occupe par le CD ( = minimiser espace du disque non ecrite)
 */

const MAX_CAPACITY = 5000;
const OBJECT_SIZES = [
	{id : "0", size : 0 },
	{id : "1", size : 700 },
	{id : "2", size : 490 },
	{id : "3", size : 120 },
	{id : "4", size : 200 },
	{id : "5", size : 3000 },
	{id : "6", size : 500 },
	{id : "7", size : 900 }
];
const MAX_ITEMS = 20;

const taille_adn = MAX_ITEMS; // la longueur de la chaine
const taux_mutation = 0.2; // proba mutation
const taux_reproduction = 0.3;
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
	for(let i = 0; i < taille_adn; i++) {
		const index = Math.floor(Math.random() * OBJECT_SIZES.length);
		adn.push( OBJECT_SIZES[index] );
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
	let pass = [];
	for(let i = 0; i < taille_adn; i++) {
		const temp = individu.adn[i];
		if(! pass.includes(temp.id) ) {
			// doublons == on compte pas
			// ex si on a 2 items de meme id on comptera que le premier
			// l avantage de cette approche c est de traverser dans l espace
			// comme si on avait aucun doublons
			x += individu.adn[i].size;			
			pass.push( temp.id );
		}
	}
	individu.score = x > MAX_CAPACITY ? 0 : x;
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
			const index = Math.floor(Math.random() * OBJECT_SIZES.length);
			individu.adn[i] = OBJECT_SIZES[index];
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
	if(generation == generation_max-1) {
		let s = 0;
		let pass = []
		for(let i = 0; i < fitest.adn.length; i++) {
			const temp = fitest.adn[i];
			if(!pass.includes( temp )) {
				pass.push(temp);
			}
		}
		
		console.log(pass);			
	}
	
	/**
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