import React from 'react';
import Pokelist from './Pokelist';
import Pokefilters from './Pokefilters';
import './../css/Pokedex.css';

// controller for components
class Pokedex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// results should just be pokemon name  or id
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

	isValidPage(pageNumber) {
		const results = this.state;
		const lowerPageBound = 0;
		const upperPageBound = Math.ceil(results.length / 10) - 1;
		if (
			pageNumber >= lowerPageBound
			&& pageNumber <= upperPageBound
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
		return (
			<div className="pokedex">
				<Pokefilters
					updateResults={this.updateResults.bind(this)}
				/>
				<Pokelist
					pokemon={this.state.results}
				/>
			</div>
		);
	}
}

export default Pokedex;
