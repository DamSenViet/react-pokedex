import React from 'react';
import PokeAPI from './../api/PokeAPI';
import * as utilities from './utilities';
import './../css/Pokewidget.css';

/**
 * Component that displays more specific info about a pokemon.
 */
class Pokewidget extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	// go fetch more data about the pokemon
	componentDidMount() {

	}

	render() {
		return (
			<div className="pokewidget-container">
				<div className="pokewidget-overlay"></div>
				<div className="pokewidget">
					<div className="pokewidget-name">Pikachu</div>
					<div className="pokewidget-types">
						<div className="pokewidget-type">Electric</div>
						<div className="pokewidget-type">Flying</div>
					</div>
					<img
						className="pokewidget-image"
						src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/156.png"
					/>
					<div className="pokewidget-characteristics">
						<div className="pokewidget-characteristic">
							<div className="pokewidget-characteristic-name">height</div>
							<div className="pokewidget-characteristic-value">1'04"</div>
						</div>
						<div className="pokewidget-characteristic">
							<div className="pokewidget-characteristic-name">weight</div>
							<div className="pokewidget-characteristic-value">13.2lbs</div>
						</div>
						<div className="pokewidget-characteristic">
							<div className="pokewidget-characteristic-name">category</div>
							<div className="pokewidget-characteristic-value">Mouse</div>
						</div>
						<div className="pokewidget-characteristic">
							<div className="pokewidget-characteristic-name">abilities</div>
							<div className="pokewidget-characteristic-value">Pressure</div>
						</div>
					</div>
					<div className="pokewidget-description">
						Whenever Pikachu comes across something new, it blasts it with a jolt of electricity. If you come across a blackened berry, it's evidence that this Pokemon mistook the intensity of its charge.
					</div>
					<div className="pokewidget-stat-container">
						<div className="pokewidget-stat">
							<div className="pokewidget-stat-value"></div>
							<div className="pokewidget-stat-name">HP</div>
						</div>
						<div className="pokewidget-stat">
							<div className="pokewidget-stat-value"></div>
							<div className="pokewidget-stat-name">HP</div>
						</div>
						<div className="pokewidget-stat">
							<div className="pokewidget-stat-value"></div>
							<div className="pokewidget-stat-name">HP</div>
						</div>
						<div className="pokewidget-stat">
							<div className="pokewidget-stat-value"></div>
							<div className="pokewidget-stat-name">HP</div>
						</div>
						<div className="pokewidget-stat">
							<div className="pokewidget-stat-value"></div>
							<div className="pokewidget-stat-name">Special Attack</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

}

export default Pokewidget;
