import React from 'react';
import Pokecard from './Pokecard';
import './../css/Pokelist.css';

// component for displaying cards
class Pokelist extends React.Component {
	render() {
		const pokecardComponents = [];
		const pokemon = this.props.pokemonToRender;
		// console.log(pokemon);
		pokemon.forEach((singlePokemon) => {
			pokecardComponents.push(
				<Pokecard
					key={singlePokemon.id}
					id={singlePokemon.id}
				/>
			);
		});

		return (
			<div className="pokelist">
				<div className="pokelist-title">Choose Your Pokemon</div>
				<ul>
					{pokecardComponents}
				</ul>
				<div className="pokelist-controls">
					<div className="pokelist-control poke-list-control-prev">Prev</div>
					<div className="pokelist-control poke-list-control-jump">0</div>
					<div className="pokelist-control poke-list-control-next">Next</div>
				</div>
			</div>
		);
	}
}

export default Pokelist;