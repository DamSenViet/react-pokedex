import React from 'react';
import Pokelist from './Pokelist';
import Pokewidget from './Pokewidget';
import Pokefilters from './Pokefilters';
import './../css/Pokedex.css';

/**
 * Component representing the Pokedex for filtering and searching pokemon.
 * Displays filters and list containing pokemon to be displayed.
 */
class Pokedex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			results: [], // filtered list of results to page through
			currentPage: 0, // 0 indexed, 10 results per page
			pokewidgetData: null,
		}
	}

	/**
	 * Creates a Pokewidget to be displayed based on data. If null, returns 
	 * @param {null | Object} pokewidgetData the data to be passed
	 * @return {null | Pokewidget} the Pokewidget, or nothing
	 */
	renderPokewidgetComponent(pokewidgetData) {
		if (pokewidgetData === null) return null;
		return (
			<Pokewidget
				key={pokewidgetData.id}
				data={pokewidgetData}
				closePokewidget={this.closePokewidget.bind(this)}
			/>
		);
	}

	render() {
		const results = this.state.results;
		const currentPage = this.state.currentPage;
		const start = currentPage * 10;
		const end = start + 10;
		const pokemonToRender = results.slice(start, end);
		const pokewidgetData = this.state.pokewidgetData;
		const pokewidgetComponent = this.renderPokewidgetComponent(pokewidgetData);

		return (
			<div className="pokedex">
				<Pokefilters
					updateResults={this.updateResults.bind(this)}
				/>

				<Pokelist
					pokemonToRender={pokemonToRender}
					currentPage={currentPage}
					highestPage={this.getHighestPage()}
					prevPage={this.prevPage.bind(this)}
					jumpPage={this.jumpPage.bind(this)}
					nextPage={this.nextPage.bind(this)}
					openPokewidget={this.openPokewidget.bind(this)}
				/>

				{pokewidgetComponent}
			</div>
		);
	}


	/**
	 * Updates current results with new results (already filtered).
	 * @param {Array} results list of pokemon {id, name}
	 */
	updateResults(results) {
		this.setState({
			results: results,
			currentPage: 0,
		});
	}


	/**
	 * Calculates the highest possible page number (0 indexed).
	 * @return {Number} the highest page number based on results
	 */
	getHighestPage() {
		const results = this.state.results;
		if (results.length === 0) return 0;
		return Math.ceil(results.length / 10) - 1;
	}


	/**
	 * Determines if selected page is a valid page.
	 * @param {Boolean} pageNumber page to be checked
	 */
	isValidPage(pageNumber) {
		const upperPageBound = this.getHighestPage();
		if (
			pageNumber >= 0 &&
			pageNumber <= upperPageBound
		) return true;
		return false;
	}


	/**
	 * Decrements the existing page numbeer within valid bounds.
	 */
	prevPage() {
		const currentPage = this.state.currentPage;
		if (currentPage <= 0) {
			return;
		}
		this.setState({ currentPage: currentPage - 1 });
	}


	/**
	 * Allows user to jump to a page number within valid bounds upon prompt. If
	 * user does not give a valid page number, jumping is canceled.
	 */
	jumpPage() {
		const highestPage = this.getHighestPage();

		let selectedPage = window.prompt(`Select a page between 1 and ${highestPage + 1}.`);
		selectedPage = Number.parseInt(selectedPage) - 1; // convert back to 0 index

		if (this.isValidPage(selectedPage))
			this.setState({ currentPage: selectedPage });
		else window.alert("Invalid page number.");
	}


	/**
	 * Increments the page number within valid bounds.
	 */
	nextPage() {
		const currentPage = this.state.currentPage;
		const highestPage = this.getHighestPage();
		// do calculations to determine if current page exceeds results
		if (currentPage < highestPage)
			this.setState({ currentPage: currentPage + 1 });
	}


	/**
	 * Sets data for Pokewidget. Allows  Pokewidget to render with data.
	 * @param {*} pokewidgetData 
	 */
	openPokewidget(pokewidgetData) {
		this.setState({ pokewidgetData: pokewidgetData });
	}


	/**
	 * Clears data for Pokewidget. Prevents Pokewidget from rendering.
	 */
	closePokewidget() {
		this.setState({ pokewidgetData: null });
	}

}

export default Pokedex;
