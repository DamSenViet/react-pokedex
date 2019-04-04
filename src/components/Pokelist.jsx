import React from 'react';
import PropTypes from 'prop-types';
import Pokecard from './Pokecard';
import './../css/Pokelist.css';

/**
 * Component that displays cards and provides navigation elements (not
 * functionality).
 */
class Pokelist extends React.Component {

	/**
	 * Creates a list of Pokecards to be rendered
	 * @param {Array} pokemon list of pokemon {id, name}
	 * @return {Array} list of Pokecard components
	 */
	renderPokecardsComponents(pokemon) {
		const pokecardComponents = [];
		pokemon.forEach((singlePokemon) => {
			pokecardComponents.push(
				<Pokecard
					key={singlePokemon.id}
					id={singlePokemon.id}
					openPokewidget={this.props.openPokewidget}
				/>
			);
		});
		return pokecardComponents;
	}


	render() {
		const currentPage = this.props.currentPage + 1;
		const highestPage = this.props.highestPage + 1;
		const pokemonToRender = this.props.pokemonToRender;
		const pokecardComponents = this.renderPokecardsComponents(pokemonToRender);

		return (
			<div className="pokelist">
				<div className="pokelist-title">Choose Your Pokemon</div>
				<ul>
					{pokecardComponents}
				</ul>
				<div className="pokelist-controls">
					<div
						className="pokelist-control poke-list-control-prev"
						onClick={this.props.prevPage}
					>
						Prev
					</div>
					<div
						className="pokelist-control poke-list-control-jump"
						onClick={this.props.jumpPage}
					>
						{`Page ${currentPage} of ${highestPage}`}
					</div>
					<div
						className="pokelist-control poke-list-control-next"
						onClick={this.props.nextPage}
					>
						Next
					</div>
				</div>
			</div>
		);
	}

}


Pokelist.propTypes = {
	pokemonToRender: PropTypes.array.isRequired,
	currentPage: PropTypes.number.isRequired,
	highestPage: PropTypes.number.isRequired,
	prevPage: PropTypes.func.isRequired,
	jumpPage: PropTypes.func.isRequired,
	nextPage: PropTypes.func.isRequired,
	openPokewidget: PropTypes.func.isRequired,
}


export default Pokelist;