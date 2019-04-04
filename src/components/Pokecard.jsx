import React from 'react';
import PropTypes from 'prop-types';
import PokeAPI from './../api/PokeAPI';
import './../css/Pokecard.css';
import * as utilities from './utilities';

/**
 * Component that displays basic data (name, types) of a single pokemon.
 * Sub-component of Pokelist.
 */
class Pokecard extends React.Component {
	constructor(props) {
		super(props);
		// isMounted deprecated, _isMounted instead
		this._isMounted = true; // set mount flag to prevent memory leak
		this.state = {
			// dummy variant data
			data: {
				id: 0,
				speciesId: 0,
				name: "",
				abilityName: "",
				typeNames: [],
				sprite: "",
				height: "",
				weight: "",
				stats: {
					hp: 0,
					attack: 0,
					defense: 0,
					specialAttack: 0,
					specialDefense: 0,
					speed: 0,
				}
			},
		}
	}


	/**
	 * Upon mounting, retrieves and stores variant data in state. Checks mount
	 * state before updating to prevent memory leaks.
	 */
	componentDidMount() {
		const id = this.props.id;
		PokeAPI.getDataWithNameOrId(id, (data) => {
			// update to Promise later
			if (this._isMounted)
				this.setState({ data: data });
		});
	}


	/**
	 * Upon unmounting, sets mount flag to false to prevent state from being set
	 * and memory from leaking.
	 */
	componentWillUnmount() {
		this._isMounted = false;
	}


	/**
	 * Renders type name components based on type names.
	 * @param {Array} typeNames list of type names
	 * @return {Array} list of type name components
	 */
	renderTypeNameComponents(typeNames) {
		const typeNameComponents = [];
		typeNames.forEach((typeName) => {
			typeNameComponents.push(
				<div
					key={typeName}
					className="pokecard-type"
				>
					{typeName}
				</div>
			);
		});
		return typeNameComponents;
	}


	render() {
		// all pokemon names are one word, dashes indicate variant form
		const name = this.state.data.name.split("-").join(" ");
		const sprite = this.state.data.sprite;
		const typeNames = this.state.data.typeNames;
		const typeNameComponents = this.renderTypeNameComponents(typeNames);

		// set color based on primary typing
		const pokecardNameStyle = {
			color: utilities.typeToColorHex[typeNames[0]],
		}

		return (
			<div
				className="pokecard"
				onClick={() => this.moreDetails()}
			>
				<div
					className="pokecard-name"
					style={pokecardNameStyle}
				>
					{name}
				</div>
				<div className="pokecard-types">
					{typeNameComponents}
				</div>
				<img
					className="pokecard-image"
					src={sprite}
					alt=""
				/>
			</div>
		);
	}

	/**
	 * Opens the Pokewidget by passing the variant data.
	 */
	moreDetails() {
		// block if component hasn't retrieved data from mounting
		if (this.state.data.name.length !== 0)
			this.props.openPokewidget(this.state.data);
	}

}


Pokecard.propTypes = {
	id: PropTypes.number.isRequired,
	openPokewidget: PropTypes.func.isRequired,
}


export default Pokecard;