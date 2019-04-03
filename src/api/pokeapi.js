import request from 'request';

// performs requests as a class module and also handles parsing
class PokeAPI {
	static baseUrl = "https://pokeapi.co/api/v2"; // api entry point

	// callback pattern
	// retrieves all pokemon types and assciated type ids
	static getTypes(callback) {
		request.get(`${this.baseUrl}/type`, (error, response, body) => {
			console.log("gotTypes");
			const results = JSON.parse(body).results;
			const types = results.map((result, index) => {
				return { id: index + 1, name: result.name };
			});
			// console.log(types);

			// callback on the types
			callback(types);
		});
	}

	// callback pattern
	// retrieves all pokemon names with associated name ids (according to PokeAPI)
	// response will be cached in a component for name searching
	static getNames(callback) {
		request.get(`${this.baseUrl}/pokemon?limit=964`, (error, response, body) => {
			console.log("gotNames");
			const results = JSON.parse(body).results;
			const pokemon = results.map((result, index) => {
				return {id: index + 1, name: result.name};
			});
			// console.log(names);

			// callback on pokemon
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
			// console.log(pokemon);
			if (callback) callback(names);
		});
	}



}

export default PokeAPI;
