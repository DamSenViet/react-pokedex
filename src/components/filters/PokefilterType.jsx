import React from 'react';
import PokeAPI from './../../api/pokeapi.js';
import * as utilities from './../utilities';

function Type(props) {
	const typeStyle = { backgroundColor: utilities.typeToColorHex[props.type] };
	return (
		<div className="pokefilter-card-type" style={typeStyle}>{props.type}</div>
	);
}

class PokefilterType extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			types: [],
			type1: null,
			type2: null,
		};
	}

	componentDidMount() {
		PokeAPI.getTypes((types) => {
			this.setState({ types: types });
		});
	}

	render() {
		const typeComponents = [];
		const types = this.state.types;
		types.forEach((type) => {
			typeComponents.push(
				<Type
					key={type.id}
					type={type.name}
				/>
			);
		});

		return (
			<div className="pokefilter-card">
				<div className="pokefilter-card-title">Types</div>
				<div className="pokefilter-card-types">
					{typeComponents}
				</div>
			</div>
		);
	}
	
}

export default PokefilterType;