import request from 'request';

// performs requests as a class module and also handles parsing
class PokeAPI {
	static baseUrl = "https://pokeapi.co/api/v2"; // api entry point

	// retrieves all pokemon types and assciated type ids
	static getTypes(callback) {
		request.get(`${this.baseUrl}/type`, (error, response, body) => {
			console.log("gotTypes");
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
			callback(validTypes);
		});
	}

	// retrieves all pokemon names with associated name ids (according to PokeAPI)
	// response will be cached in a component for name searching
	static getNames(callback) {
		request.get(`${this.baseUrl}/pokemon?limit=964`, (error, response, body) => {
			console.log("gotNames");
			const results = JSON.parse(body).results;
			const pokemon = results.map((result, index) => {
				const idLink = result.url.split("/");
				// all ids should be based upon the database
				const id = idLink[idLink.length - 2];
				return { id: id, name: result.name };
			});
			// console.log(names);
			if (callback) callback(pokemon);
		});
	}

	// type can be id or the name
	static getNamesWithType(type, callback) {
		request.get(`${this.baseUrl}/type/${type}`, (error, response, body) => {
			console.log("gotNamesWithType");
			const results = JSON.parse(body).pokemon;
			const names = results.map((result, index) => {
				return result.pokemon.name;
			});
			// console.log(names);

			if (callback) callback(names);
		});
	}


	static getDataWithNameOrId(nameOrId, callback) {
		request.get(`${this.baseUrl}/pokemon/${nameOrId}`, (error, response, body) => {
			if (error) console.log(error);
			console.log("gotPokemonWithName");
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
