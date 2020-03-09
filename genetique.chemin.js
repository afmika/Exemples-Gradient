/**
 * @author afmika
 * 
 * Recherche du chemin le plus court en utilisant un algorithme genetique
 */

/**
 * Dans cet exemple toutes les villes sont reliees
 */
const villes = ['A', 'B', 'C', 'D', 'E', 'F'];
const map_ville = {};  // juste pour faciliter l'identification des distances 
villes.forEach((ville, index) => {
	map_ville[ville] = index;
});

// Matrice des distances
// Convention : dist(x, y) = infinie si x == y ou qu'elles ne sont pas connectees
const inf = 1000000; // infinie
const distances = [
	// A, B, C, D, E, F
	[inf, 11, inf, inf, inf, 16], // A
	[11, inf, 1, inf, inf, 13], // B
	[inf, 1, inf, 13, 14, 26], // C
	[inf, inf, 13, inf, 8, inf], // D
	[inf, inf, 14, 8, inf, 11], // E
	[26, 13, 26, inf, 11, inf], // F
];

const depart = 'A';
const arrive = 'D'; 

const nbr_ville_a_survoler = 5; // exemple on doit passer par 6 villes meme si on tourne en rond
 
// parametres reglables
const taux_mutation = 0.2; // proba mutation
const taux_reproduction = 0.3; // on ne retient que 30% ny population les plus adaptees
const nombre_population = 50;



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
	adn.push(depart);
	for(let i = 1; i < (nbr_ville_a_survoler - 1); i++) {
		let index_random = Math.floor( villes.length * Math.random() );
		adn[i] = villes[index_random];
	}
	adn.push(arrive);
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
	let total_dist = 0;
	for(let i = 1; i < nbr_ville_a_survoler; i++) {
		let node_A = individu.adn[i-1];
		let node_B = individu.adn[i];
		// console.log(node_A, node_B, "dist", distances[ map_ville[node_A]  ] [ map_ville[node_B] ]);
		total_dist += distances[ map_ville[node_A]  ] [ map_ville[node_B] ];
	}
	// plus la distance est grande plus c'est petit!
	individu.score = total_dist == 0 ? 0 : 1 / total_dist;
}

function evaluerPopulation(population) {
	population.forEach(x => {
		evaluer(x);
	});
}

// mutation
function effectuerMutation(individu) {
	for(let i = 1; i < (nbr_ville_a_survoler - 1); i++) {
		if(Math.random() <= taux_mutation) {
			let index_random = Math.floor( villes.length * Math.random() );
			individu.adn[i] = villes[index_random];
		}
	}
}

// accouplement
function crossOver(pere, mere) {
	let enfant = new Individu([]);
	let moitie = Math.floor( nbr_ville_a_survoler / 2 );
	for(let i = 0; i < nbr_ville_a_survoler; i++) {
		const gene = i < moitie ? pere.adn[i] : mere.adn[i];
		enfant.adn.push( gene );
	}
	return enfant;
}



/**
 * Algorithme genetique
 */
let generation_max = 600;
let generation = 1;
let ancien_fitest = null;

// gestion de l'affichage de l'evolution
let stagne = false;
let need_to_display = false;
let smthin_displayed = false;
// ----


initialiserPopulation();
console.log("Trajectoire minimale entre ", depart, arrive, " en passant par ", nbr_ville_a_survoler, "villes minimum (repetition inclus)");
while( generation < generation_max ) {
	evaluerPopulation( population );
	
	trierDecroissant( population );
	
  /**
	* Affichages
	**/
	let fitest = population[0]; //le fitest
	if(ancien_fitest != null) {
		if(fitest.score > ancien_fitest.score) {
			stagne = false;
			smthin_displayed = true;
			need_to_display = true;
			console.log(fitest.adn.join(","), " => note ",fitest.score , " => Distance tot. ", 1 / fitest.score,"Km, generation ", generation);		
		}
		if( stagne && need_to_display && generation % 50 == 0 ) {
			smthin_displayed = true;
			need_to_display = false;
			console.log(fitest.adn.join(","), " => note ",fitest.score , " => Distance tot. ", 1 / fitest.score,"Km, generation ", generation);				
		}
		
		if(fitest.score == ancien_fitest.score) {
			stagne = true;
		}
		
		if(!smthin_displayed) {
			smthin_displayed = true;
			console.log(fitest.adn.join(","), " => note ",fitest.score , " => Distance tot. ", 1 / fitest.score,"Km, generation ", generation);		
		}
	}
	ancien_fitest = fitest;	
	
	/*
	* Etape de selection + accouplement
	**/

	let nouvelle_gen = [];
	let parents = [];  // parents => les 'fitest'
	let pourcentage_parent = taux_reproduction * population.length;
	
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