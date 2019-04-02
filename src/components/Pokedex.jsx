import React from 'react';
import Pokelist from './Pokelist';
import Pokefilters from './Pokefilters';
import './../css/Pokedex.css';

// controller for components
class Pokedex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			results: [], // filtered list
			page: 0, // show 10 results per page
		}
	}

	updateResults() {

	}

	prevPage() {

	}

	jumpPage() {

	}

	nextPage() {

	}

	render() {
		return (
			<div className="pokedex">
				<Pokefilters

				/>
				<Pokelist
					pokemon={this.state.results}
				/>
			</div>
		);
	}
}

export default Pokedex;
