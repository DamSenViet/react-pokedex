import request from 'request';

// IMPORTANT!!!
// NOTE: there's an API call rate to match (100 per minute), decreasing API
// calls by parsing information that can be gained from parsing links

/**
 * Class representing api access, methods use async callback pattern.
 */
class PokeAPI {

	// api entry point
	static baseUrl = "https://pokeapi.co/api/v2";

	// decide how to limit mass calls to unnamed resources
	static resourceLimit = 9999;

	/**
	 * Retrieves all pokemon names with associated name ids. Response supposed to
	 * be cached in a component for name searching.
	 * @param {function} callback callback to run with list of pokemon {id, name}
	 */
	static getNames(callback) {
		request.get(`${this.baseUrl}/pokemon?limit=${this.resourceLimit}`,
			(error, response, body) => {
				// console.log("gotNames");
				const results = JSON.parse(body).results;
				const pokemon = results.map((result, index) => {
					// all ids should be based upon the database
					const idLink = result.url.split("/");
					const id = Number.parseInt(idLink[idLink.length - 2]);
					return { id: id, name: result.name };
				});
				// console.log(names);
				if (callback) callback(pokemon);
			});
	}


	/**
	 * Retrieves all available types (with id and name) in the API's database.
	 * Response is supposed to be cached in a component.
	 * @param {function} callback callback to run on list of types {id, name}
	 */
	// could technically store species specific types, but
	// prioritizing consistent design with types instead
	static getTypes(callback) {
		request.get(`${this.baseUrl}/type?limit=${this.resourceLimit}`,
			(error, response, body) => {
				// console.log("gotTypes");
				const results = JSON.parse(body).results;
				const types = results.map((result, index) => {
					const typeLink = result.url.split("/");
					const id = Number.parseInt(typeLink[typeLink.length - 2]);
					return { id: id, name: result.name };
				});
				const validTypes = types.filter((result) => {
					if (
						result.name === "unknown" ||
						result.name === "shadow"
					) return false;
					return true;
				});
				// console.log(validTypes);

				// callback on the types
				if (callback) callback(validTypes);
			});
	}


	/**
	 * Retrieves all available generations (with id and name) in the API's database.
	 * Response is supposed to be cached in a component.
	 * @param {function} callback callback to run on list of generations {id, name}
	 */
	// could technically store species released with each generation, but
	// prioritizing consistent design with types instead
	static getGenerations(callback) {
		request.get(`${this.baseUrl}/generation?limit=${this.resourceLimit}`,
			(error, response, body) => {
				const results = JSON.parse(body).results;
				// links to all generations
				const generationLinks = results.map((result) => {
					return result.url;
				});

				// create promises to retrieve
				const generationsPromises = [];
				generationLinks.forEach((generationLink) => {
					generationsPromises.push(new Promise((resolve, reject) => {
						request.get(generationLink, (error, response, body) => {
							const generation = JSON.parse(body);
							resolve({
								id: generation.id,
								name: generation.main_region.name,
							});
						});
					}));
				});

				// wait on promises
				Promise.all(generationsPromises).then((generations) => {
					if (callback) callback(generations);
				});
			});
	}


	/**
	 * Retrieves all names of pokemon that belong to the type group.
	 * @param {String | Number} type name or id
	 * @param {function} callback to run with names of pokemon
	 */
	static getNamesWithType(type, callback) {
		request.get(`${this.baseUrl}/type/${type}`, (error, response, body) => {
			// console.log("gotNamesWithType");
			const pokemonAndSlots = JSON.parse(body).pokemon;
			const names = pokemonAndSlots.map((pokemonAndSlot, index) => {
				return pokemonAndSlot.pokemon.name;
			});
			// console.log(names);

			if (callback) callback(names);
		});
	}


	/**
	 * Retrieves all names of pokemon that were released in the generation.
	 * @param {Number} generation id number of the generation, 1 - 7 only
	 * @param {function} callback to run with names of pokemon
	 */
	static getNamesWithGeneration(generation, callback) {
		// console.log("gotNamesWithGeneration");
		request.get(`${this.baseUrl}/generation/${generation}`, (error, response, body) => {
			const pokemonSpecies = JSON.parse(body).pokemon_species;
			const names = pokemonSpecies.map((singlePokemonSpecies) => {
				return singlePokemonSpecies.name;
			});
			// console.log(names);

			// match up against just beginning of pokemon name in filter, b/c species not variant
			if (callback) callback(names);
		});
	}


	/**
	 * Retrieves variant data of a single pokemon.
	 * @param {String | Number} nameOrId name or id of the variant
	 * @param {function} callback to be run on data
	 */
	static getDataWithNameOrId(nameOrId, callback) {
		// console.log("gotDataWithNameOrId");
		request.get(`${this.baseUrl}/pokemon/${nameOrId}`, (error, response, body) => {
			// console.log("gotPokemonWithName");
			const pokemon = JSON.parse(body);
			// console.log(pokemon);
			const data = this.parseDataFromNameOrId(pokemon);
			// console.log(data);
			if (callback) callback(data);
		});
	}


	/**
	 * Parses pokemon variant data and returns object with relevant information.
	 * @param {Object} pokemon the response body of getDataWithNameOrId
	 * @return {Object} the pokemon's parsed and formatted information
	 */
	static parseDataFromNameOrId(pokemon) {
		// arranging and piecing toegether data of pokemon
		// sort types based on slot priority, primary and secondary types
		pokemon.types.sort((typeAndSlotA, typeAndSlotB) => {
			if (typeAndSlotA.slot > typeAndSlotB.slot) return 1;
			else return -1;
		});
		const typeNames = pokemon.types.map((typeAndSlot) => typeAndSlot.type.name);

		// parse species id from link
		const speciesLink = pokemon.species.url.split("/");
		const speciesId = Number.parseInt(speciesLink[speciesLink.length - 2]);

		const decimalPlaces = 1;
		// height from decimeters to feet
		let height = pokemon.height / 10 * 3.28084;
		height = Math.round(height * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
		let heightFeet = Math.floor(height);
		let heightInches = Math.floor((height - heightFeet) / 0.0833333);
		heightInches = heightInches.toString();
		heightInches = "0".repeat(2 - heightInches.length) + heightInches; // pad 0s

		// weight from hectograms to lbs rounded to 1 decimal place
		let weight = pokemon.weight / 10 * 2.20462;
		weight = Math.round(weight * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);

		// pokemon grab slot 1 ability
		pokemon.abilities.sort((abilityAndSlotA, abilityAndSlotB) => {
			if (abilityAndSlotA.slot > abilityAndSlotB.slot) return 1;
			else return -1;
		});
		const abilityName = pokemon.abilities[0].ability.name;

		// grab stats
		const stats = {
			speed: pokemon.stats[0].base_stat,
			specialDefense: pokemon.stats[1].base_stat,
			specialAttack: pokemon.stats[2].base_stat,
			defense: pokemon.stats[3].base_stat,
			attack: pokemon.stats[4].base_stat,
			hp: pokemon.stats[5].base_stat,
		}

		const data = {
			id: pokemon.id,
			speciesId: speciesId,
			name: pokemon.name,
			abilityName: abilityName,
			typeNames: typeNames,
			sprite: pokemon.sprites.front_default,
			height: `${heightFeet}'${heightInches}"`,
			weight: `${weight}lbs`,
			stats: stats,
		}
		return data;
	}


	/**
	 * Retrieves specie data of a single pokemon.
	 * @param {String | Number} species name or id of the species
	 * @param {function} callback to be run on data
	 */
	static getDataWithSpecies(species, callback) {
		// console.log("gotDataWithSpecies");
		request.get(`${this.baseUrl}/pokemon-species/${species}`, (error, response, body) => {
			// mass noun instead of plural
			const specie = JSON.parse(body);
			// console.log(specie);
			const data = this.parseDataFromSpecies(specie);
			// console.log(data);
			if (callback) callback(data);
		});
	}


	/**
	 * Parses species data and returns object with relevant information.
	 * @param {Object} specie the response body of getDataWithSpecies
	 * @return {Object} the pokemon's parsed and formatted information
	 */
	static parseDataFromSpecies(specie) {
		const englishFlavorTexts = specie.flavor_text_entries.filter((entry) => {
			if (entry.language.name !== "en") return false;
			return true;
		});
		const flavorText = englishFlavorTexts[0].flavor_text;

		const englishGenera = specie.genera.filter((genus) => {
			if (genus.language.name !== "en") return false;
			return true;
		});
		const genus = englishGenera[0].genus.split(" ")[0];

		const data = {
			flavorText: flavorText,
			genus: genus,
		}
		return data;
	}

}


export default PokeAPI;
