import React from 'react';
import PokefilterType from './filters/PokefilterType';
import PokefilterGeneration from './filters/PokefilterGeneration';
import PokefilterName from './filters/PokefilterName';
import './../css/Pokefilters.css';
import PokeAPI from './../api/PokeAPI';

/**
 * Component that displays filters, assembles and applies filters to update
 * results.
 */
class Pokefilters extends React.Component {
	constructor(props) {
		super(props);
		this.typeFilter = React.createRef();
		this.generationFilter = React.createRef();
		this.nameFilter = React.createRef();
		this.state = {
			pokemon: [], // base list of pokemon {id, name} to filter against
		}
	}


	/**
	 * Retrieves and stores names and ids of pokemon once mounted. Also calls
	 * first update to filters to make Pokedex parent re-render.
	 */
	componentDidMount() {
		PokeAPI.getNames((pokemon) => {
			// cache names and udpate results once request is finished
			this.setState(
				{ pokemon: pokemon },
				() => this.updateFilters(),
			);
		});
	}


	/**
	 * Blocks updates after storing names and ids of pokemon.
	 */
	shouldComponentUpdate(nextProps, nextState) {
		// being lazy right now, deep comparison via stringify
		return (
			JSON.stringify(this.state.pokemon) !==
			JSON.stringify(nextState.pokemon)
		);
	}


	render() {
		// console.log("rendered Pokefilter");
		return (
			<div className="pokefilters">
				<div className="pokefilters-title">Filters</div>
				<ul>
					<PokefilterName
						ref={this.nameFilter}
						updateFilters={this.updateFilters.bind(this)}
					/>
					<PokefilterGeneration
						ref={this.generationFilter}
						updateFilters={this.updateFilters.bind(this)}
					/>
					<PokefilterType
						ref={this.typeFilter}
						updateFilters={this.updateFilters.bind(this)}
					/>
				</ul>
			</div>
		);
	}


	/**
	 * Decides how to update the results in Pokdex with active filters. If no
	 * filters are selected, the base pokemon list will be used as the result instead.
	 */
	updateFilters() {
		const basePokemon = this.state.pokemon.slice();

		// assemble filter selections
		const selectedTypes = new Set(this.typeFilter.current.state.selectedTypes);
		const selectedGeneration = this.generationFilter.current.state.selectedGeneration;
		const selectedQuery = this.nameFilter.current.state.selectedQuery;

		// chain filters together, each filter has a do nothing condition
		this.updateFiltersWithName(selectedQuery, basePokemon, (nameFilteredPokemon) => {
			this.updateFiltersWithTypes(selectedTypes, nameFilteredPokemon, (typeFilteredPokemon) => {
				this.updateFiltersWithGeneration(selectedGeneration, typeFilteredPokemon, (generationFilteredPokemon) => {
					this.props.updateResults(generationFilteredPokemon); // update results in Pokedex
				});
			});
		});
	}


	/**
	 * Matches pokemon against selected types. Callback pattern & derived allows
	 * for filter chaining via nested callbacks.
	 * @param {Set} selectedTypes set of type names or ids
	 * @param {Array} derivedPokemon list of pokemon to compare and validate types
	 * @param {function} callback to be run on list of type filtered pokemon
	 */
	updateFiltersWithTypes(selectedTypes, derivedPokemon, callback) {
		// do nothing condition
		if (selectedTypes.size === 0) {
			if (callback) callback(derivedPokemon);
			return;
		}

		// create promises to retrieve pokemon names with selected types
		const namesWithTypesPromises = [];
		selectedTypes.forEach((type) => {
			namesWithTypesPromises.push(
				new Promise((resolve, reject) => {
					PokeAPI.getNamesWithType(type, (names) => {
						resolve(names);
					});
				}));
		});

		// wait for all promises to resolve
		Promise.all(namesWithTypesPromises).then((namesWithTypes) => {
			// pokemon must belong to all selected types
			const typeFilteredPokemon = derivedPokemon.filter((singlePokemon) => {
				for (let i = 0; i < namesWithTypes.length; ++i)
					if (!namesWithTypes[i].includes(singlePokemon.name))
						return false;
				return true;
			});
			// console.log(typeFilteredPokemon)
			if (callback) callback(typeFilteredPokemon);
		});
	}


	/**
	 * Matches pokemon against selected generation. Callback pattern & derived allows
	 * for filter chaining via nested callbacks.
	 * @param {null | Number} selectedGeneration generation of id or null (no generation)
	 * @param {Array} derivedPokemon list of pokemon to compare and validate generations
	 * @param {function} callback to be run on list of generation filtered pokemon
	 */
	updateFiltersWithGeneration(selectedGeneration, derivedPokemon, callback) {
		// do nothing condition
		if (selectedGeneration === null) {
			if (callback) callback(derivedPokemon);
			return;
		}

		PokeAPI.getNamesWithGeneration(selectedGeneration, (namesWithGeneration) => {
			const generationFilteredPokemon = derivedPokemon.filter((singlePokemon => {
				for (let i = 0; i < namesWithGeneration.length; ++i) {
					const regex = new RegExp(`^${namesWithGeneration[i]}-`);
					if (
						singlePokemon.name === namesWithGeneration[i] ||
						regex.test(singlePokemon.name)
					) return true;
				}
				return false;
			}));
			// console.log(generationFilteredPokemon);

			if (callback) callback(generationFilteredPokemon);
		});
	}


	/**
	 * Matches pokemon against selected queried name. Callback pattern & derived allows
	 * for filter chaining via nested callbacks. Uses smarter substring matching.
	 * @param {String} selectedQuery query string, usually the name of a pokemon
	 * @param {Array} derivedPokemon list of pokemon to compare and validate generations
	 * @param {function} callback to be run on list of generation filtered pokemon
	 */
	updateFiltersWithName(selectedQuery, derivedPokemon, callback) {
		selectedQuery = selectedQuery.trim().toLowerCase();
		// do nothing condition
		if (selectedQuery.length === 0) {
			if (callback) callback(derivedPokemon);
			return;
		}

		const regexes = selectedQuery.split(" ").map((word, index) => {
			if (index === 0) return new RegExp(`^${word}`); // first word must match name
			return new RegExp(`${word}`); // all other words are substrings
		});

		const nameFilteredPokemon = derivedPokemon.filter((singlePokemon) => {
			// name of pokemon must match all query name components
			for (let i = 0; i < regexes.length; ++i) {
				if (!regexes[i].test(singlePokemon.name)) return false;
			}
			return true;
		});
		// console.log(nameFilteredPokemon);

		if (callback) callback(nameFilteredPokemon);
	}

}

export default Pokefilters;