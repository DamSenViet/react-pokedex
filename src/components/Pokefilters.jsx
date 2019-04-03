import React from 'react';
import PokefilterType from './filters/PokefilterType';
import './../css/Pokefilters.css';
import PokeAPI from './../api/PokeAPI';

// filter container, handles result fetching based upon all filters
class Pokefilters extends React.Component {
	constructor(props) {
		super(props);
		this.typeFilter = React.createRef();
		this.state = {
			pokemon: [],
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
		// assembling filters
		const selectedTypes = new Set(this.typeFilter.current.state.selectedTypes);
		if (selectedTypes.size > 0) {
			this.updateFiltersWithTypes(selectedTypes, basePokemon, (typeFilteredPokemon) => {
				this.props.updateResults(typeFilteredPokemon);
			});
		}
		// if no filters, use default dex
		else this.props.updateResults(basePokemon);
	}

	/**
	 * Matches pokemon against selected types. Callback pattern & derived allows
	 * for filter chaining via nested callbacks.
	 * @param {Set} selectedTypes 
	 * @param {Array} derivedPokemon list of pokemon to compare and validate types
	 * @param {function} callback to be run on list of type filtered pokemon
	 */
	updateFiltersWithTypes(selectedTypes, derivedPokemon, callback) {
		// create promises to retrieve pokemon names with selected types
		const pokemonNamesWithTypes = [];
		selectedTypes.forEach((type) => {
			pokemonNamesWithTypes.push(
				new Promise((resolve, reject) => {
					PokeAPI.getNamesWithType(type, (names) => {
						resolve(names);
					});
				}));
		});

		// wait for all promises to resolve
		Promise.all(pokemonNamesWithTypes).then((values) => {
			// pokemon must belong to all selected types
			const typeFilteredPokemon = derivedPokemon.filter((singlePokemon) => {
				for (let i = 0; i < values.length; ++i)
					if (!values[i].includes(singlePokemon.name)) return false;
				return true;
			});
			// console.log(typeFilteredPokemon)
			if (callback) callback(typeFilteredPokemon);
		});
	}
}

export default Pokefilters;