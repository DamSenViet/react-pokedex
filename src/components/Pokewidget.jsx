import React from 'react';
import PropTypes from 'prop-types';
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
			data: {
				flavorText: "",
				genus: "",
			},
		}
	}


	/**
	 * Upon mounting feteches and stores specie data.
	 */
	componentDidMount() {
		const speciesId = this.props.data.speciesId;
		PokeAPI.getDataWithSpecies(speciesId, (data) => {
			this.setState({ data: data });
		});
	}


	/**
	 * Renders type components based on type names.
	 * @param {Array} typeNames list of type names
	 * @return {Array} list of typename components
	 */
	renderTypeNameComponents(typeNames) {
		const typeNameComponents = [];
		typeNames.forEach((typeName) => {
			typeNameComponents.push(
				<div
					key={typeName}
					className="pokewidget-type"
				>
					{typeName}
				</div>
			);
		});
		return typeNameComponents;
	}

	render() {
		// passed prop data
		const name = this.props.data.name.split("-").join(" ");
		const abilityName = this.props.data.abilityName;
		const typeNames = this.props.data.typeNames;
		const typeNameComponents = this.renderTypeNameComponents(typeNames);
		const primaryTypeColor = utilities.typeToColorHex[typeNames[0]];
		const sprite = this.props.data.sprite;
		const height = this.props.data.height;
		const weight = this.props.data.weight;
		const stats = this.props.data.stats;

		const statsStyles = {};
		Object.keys(stats).forEach((key, index) => {
			statsStyles[key] = {
				height: `${stats[key] / 200 * 100}%`,
				backgroundColor: primaryTypeColor,
			}
		});

		// custom colors
		const styleColorWithType = { color: primaryTypeColor };
		const styleBackgroundColorWithType = { backgroundColor: primaryTypeColor };

		// data that needs retrieval
		const flavorText = this.state.data.flavorText;
		const genus = this.state.data.genus;


		return (
			<div className="pokewidget-container">
				<div className="pokewidget-overlay"
					onClick={this.props.closePokewidget}
					style={styleBackgroundColorWithType}
				>
				</div>
				<div className="pokewidget">
					<div className="pokewidget-name">{name}</div>
					<div className="pokewidget-types">
						{typeNameComponents}
					</div>
					<img
						className="pokewidget-image"
						src={sprite}
						alt=""
					/>
					<div className="pokewidget-characteristics">
						<div className="pokewidget-characteristic">
							<div className="pokewidget-characteristic-name" style={styleColorWithType}>height</div>
							<div className="pokewidget-characteristic-value">{height}</div>
						</div>
						<div className="pokewidget-characteristic">
							<div className="pokewidget-characteristic-name" style={styleColorWithType}>weight</div>
							<div className="pokewidget-characteristic-value">{weight}</div>
						</div>
						<div className="pokewidget-characteristic">
							<div className="pokewidget-characteristic-name" style={styleColorWithType}>category</div>
							<div className="pokewidget-characteristic-value">{genus}</div>
						</div>
						<div className="pokewidget-characteristic">
							<div className="pokewidget-characteristic-name" style={styleColorWithType}>abilities</div>
							<div className="pokewidget-characteristic-value">{abilityName}</div>
						</div>
					</div>
					<div className="pokewidget-description">{flavorText}</div>
					<div className="pokewidget-stat-container">
						<div className="pokewidget-stat-values">
							<div className="pokewidget-stat-value" style={statsStyles.hp}></div>
							<div className="pokewidget-stat-value" style={statsStyles.attack}></div>
							<div className="pokewidget-stat-value" style={statsStyles.defense}></div>
							<div className="pokewidget-stat-value" style={statsStyles.specialAttack}></div>
							<div className="pokewidget-stat-value" style={statsStyles.specialDefense}></div>
							<div className="pokewidget-stat-value" style={statsStyles.speed}></div>
						</div>
						<div className="pokewidget-stat-names">
							<div className="pokewidget-stat-name">HP</div>
							<div className="pokewidget-stat-name">Attack</div>
							<div className="pokewidget-stat-name">Defense</div>
							<div className="pokewidget-stat-name">Special Attack</div>
							<div className="pokewidget-stat-name">Special Defense</div>
							<div className="pokewidget-stat-name">Speed</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

}


Pokewidget.propTypes = {
	data: PropTypes.object.isRequired,
	closePokewidget: PropTypes.func.isRequired,
}


export default Pokewidget;
