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

	/**
	 * Retrieves all available types (with id and name) in the API's database.
	 * Response is supposed to be cached in a component.
	 * @param {function} callback callback to run on list of types {id, name}
	 */
	static getTypes(callback) {
		request.get(`${this.baseUrl}/type`, (error, response, body) => {
			// console.log("gotTypes");
			const results = JSON.parse(body).results;
			const types = results.map((result, index) => {
				const typeLink = result.url.split("/");
				const id = typeLink[typeLink.length - 2];
				return {
					id: id,
					name: result.name
				};
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
	 * Retrieves all pokemon names with associated name ids. Response supposed to
	 * be cached in a component for name searching.
	 * @param {function} callback callback to run with list of pokemon {id, name}
	 */
	static getNames(callback) {
		request.get(`${this.baseUrl}/pokemon?limit=964`, (error, response, body) => {
			// console.log("gotNames");
			const results = JSON.parse(body).results;
			const pokemon = results.map((result, index) => {
				// all ids should be based upon the database
				const idLink = result.url.split("/");
				const id = idLink[idLink.length - 2];
				return { id: id, name: result.name };
			});
			// console.log(names);
			if (callback) callback(pokemon);
		});
	}

	/**
	 * 
	 * @param {String | Number} type name or id
	 * @param {function} callback to run with names of pokemon
	 */
	static getNamesWithType(type, callback) {
		request.get(`${this.baseUrl}/type/${type}`, (error, response, body) => {
			// console.log("gotNamesWithType");
			const results = JSON.parse(body).pokemon;
			const names = results.map((result, index) => {
				return result.pokemon.name;
			});
			// console.log(names);

			if (callback) callback(names);
		});
	}


	/**
	 * Retrieves rendering data of a single pokemon
	 * @param {String | Number} nameOrId name or id of the pokemon
	 * @param {function} callback to be run on data
	 */
	static getDataWithNameOrId(nameOrId, callback) {
		request.get(`${this.baseUrl}/pokemon/${nameOrId}`, (error, response, body) => {
			if (error) console.log(error);
			// console.log("gotPokemonWithName");
			const pokemon = JSON.parse(body);
			// sort types based on slot order, primary and secondary types
			pokemon.types.sort((typeAndSlotA, typeAndSlotB) => {
				if (typeAndSlotA > typeAndSlotB) return 1;
				else return -1;
			});
			const data = {
				id: pokemon.id,
				name: pokemon.name,
				typeNames: pokemon.types.map((typeAndSlot) => typeAndSlot.type.name),
				sprite: pokemon.sprites.front_default,
			}
			// console.log(data);

			if (callback) callback(data);
		});
	}
}

export default PokeAPI;
