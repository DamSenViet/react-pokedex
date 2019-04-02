import request from 'request';

// performs requests as a class module and also handles parsing
class PokeAPI {
	// variables
	static baseUrl = "https://pokeapi.co/api/v2";

	// callback pattern
	static getTypes(callback) {
		request.get(`${this.baseUrl}/type`, (error, response, body) => {
			const results = JSON.parse(body).results;
			const types = results.map((result, index) => {
				return { id: index + 1, name: result.name };
			});
			// callback on the types
			callback(types);
		});
	}



}

export default PokeAPI;
