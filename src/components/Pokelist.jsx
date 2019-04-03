import React from 'react';
import './../css/Pokelist.css';

function Pokecard(props) {
	return (
		<div class="pokecard">
			<div class="pokecard-name"></div>
			<div class="pokecard-types">
			</div>
			<img
				class="pokecard-image"
				src=""
			/>
		</div>
	);
}

// component for displaying cards
class Pokelist extends React.Component {
	render() {
		let pokecardComponents = [];
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