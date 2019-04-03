import React from 'react';
import PokefilterType from './filters/PokefilterType';
import './../css/Pokefilters.css';
import PokeAPI from './../api/PokeAPI';

// filter container, handles result fetching results based upon all filters
class Pokefilters extends React.Component {
	constructor(props) {
		super(props);
		this.typeFilter = React.createRef();
		this.state = {
			pokemon: [],
		}
	}

	componentDidMount() {
		PokeAPI.getNames((pokemon) => {
			this.setState({ pokemon: pokemon });
		});
	}

	render() {
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


	// decide how to retrieve results
	// retrieve results and update it
	updateFilters() {
		// assembling filters
		const selectedTypes = new Set(this.typeFilter.current.state.selectedTypes);
		const basePokemon = this.state.pokemon.slice();
		if (selectedTypes.size > 0) {
			this.updateFiltersWithTypes(selectedTypes, basePokemon, (typeFilteredPokemon) => {
				this.props.updateResults(typeFilteredPokemon);
			});
		}
		else
			this.props.updateResults(basePokemon);
	}

	// callback patttern allows for filter chaining (e.g. filter(callback with filter))
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
			// pokemon must belong to all type groups to be a part of the result
			const typeFilteredPokemon = derivedPokemon.filter((singlePokemon) => {
				for (let i = 0; i < values.length; ++i)
					if (!values[i].includes(singlePokemon.name)) return false;
				return true;
			});
			// console.log(typeFilteredPokemon);
			if (callback) callback(typeFilteredPokemon);
		});
	}
}

export default Pokefilters;