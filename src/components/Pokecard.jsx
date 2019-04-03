import React from 'react';
import PokeAPI from './../api/PokeAPI';
import './../css/Pokecard.css';
import * as utilities from './utilities';

class Pokecard extends React.Component {
	constructor(props) {
		super(props);
		// need this flag to cancel setState or else mem leak
		// isMounted deprecated, _isMounted instead
		this._isMounted = true; 
		this.state = {
			id: "",
			name: "",
			typeNames: [],
			sprite: "",
		}
	}

	componentDidMount() {
		const id = this.props.id;
		PokeAPI.getDataWithNameOrId(id, (data) => {
			if (this._isMounted)
			this.setState({
				id: data.id,
				name: data.name,
				typeNames: data.typeNames,
				sprite: data.sprite,
			});
		});
	}
	
	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		// all pokemon names are one word
		// dashes indicate a variant form
		const name = this.state.name.split("-").join(" ");
		const sprite = this.state.sprite;
		const typeNames = this.state.typeNames;
		const typeNameComponents = this.renderTypeNameComponents(typeNames);

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
}

export default Pokecard;