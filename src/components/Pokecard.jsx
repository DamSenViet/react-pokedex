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
			id: 0,
			name: "",
			typeNames: [],
			sprite: "",
		}
	}


	/**
	 * Upon mounting, retrieves and stores pokemon data in state. Checks mount
	 * state before updating to prevent memory leaks.
	 */
	componentDidMount() {
		const id = this.props.id;
		PokeAPI.getDataWithNameOrId(id, (data) => {
			// update to Promise later
			if (this._isMounted)
				this.setState({
					id: data.id,
					name: data.name,
					typeNames: data.typeNames,
					sprite: data.sprite,
				});
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
	 * Renders type components based on type names.
	 * @param {Array} typeNames list of type names
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
		const name = this.state.name.split("-").join(" ");
		const sprite = this.state.sprite;
		const typeNames = this.state.typeNames;
		const typeNameComponents = this.renderTypeNameComponents(typeNames);

		// set color based on primary typing
		const pokecardNameStyle = {
			color: utilities.typeToColorHex[typeNames[0]],
		}

		return (
			<div className="pokecard">
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

}


Pokecard.propTypes = {
	id: PropTypes.number.isRequired,
}


export default Pokecard;