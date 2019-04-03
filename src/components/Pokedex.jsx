import React from 'react';
import Pokelist from './Pokelist';
import Pokefilters from './Pokefilters';
import './../css/Pokedex.css';

// controller for components
class Pokedex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// results contains both id and name
			results: [], // filtered list of results to page through
			currentPage: 0, // 0 indexed, 10 results per page
		}
	}

	updateResults(results) {
		this.setState({
			results: results,
			page: 0,
		});
	}

	getHighestPageNumber() {
		const results = this.state.results;
		return Math.ceil(results.length / 10) - 1;
	}

	isValidPage(pageNumber) {
		const lowerPageBound = 0;
		const upperPageBound = this.highestPage();
		if (
			pageNumber >= lowerPageBound &&
			pageNumber <= upperPageBound
		) return true;
		return false;
	}

	prevPage() {
		const currentPage = this.state.currentPage;
		if (currentPage <= 0) {
			window.alert("");
			return;
		}
		this.setState({ page: currentPage - 1 });
	}

	jumpPage() {
		const currentPage = this.state.currentPage;
		window.prompt(`Wow?`);
		// determine bounds of pages
	}

	nextPage() {
		const currentPage = this.state.currentPage;
		// do calculations to determine if current page exceeds results

		this.setState({ page: currentPage + 1 });
	}

	render() {
		const results = this.state.results;
		const currentPage = this.state.page;
		const start = currentPage * 10;
		const end = start + 10;
		const pokemonToRender = results.slice(start, end);

		return (
			<div className="pokedex">
				<Pokefilters
					updateResults={this.updateResults.bind(this)}
				/>

				<Pokelist
					pokemonToRender={pokemonToRender}
					prevPage={this.prevPage.bind(this)}
					jumpPage={this.jumpPage.bind(this)}
					nextPage={this.nextPage.bind(this)}
				/>
			</div>
		);
	}
}

export default Pokedex;
