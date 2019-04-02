import React from 'react';
import PokeAPI from './../../api/PokeAPI';
import * as utilities from './../utilities';

class PokefilterType extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			types: [],
			selectedTypes: new Set(),
		};
	}

	// once component is mounted, go fetch types and update them all
	// using ids from API to be consistent
	componentDidMount() {
		PokeAPI.getTypes((types) => {
			this.setState({ types: types });
		});
	}

	render() {
		const typeComponents = [];
		const types = this.state.types.slice();
		const selectedTypes = new Set(this.state.selectedTypes);

		types.forEach((type) => {
			const isActive = selectedTypes.has(type.id);
			typeComponents.push(
				<Type
					key={type.id}
					type={type.name}
					isActive={isActive}
					toggleType={() => this.toggleType(type.id)}
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

	toggleType(id) {
		const selectedTypes = new Set(this.state.selectedTypes);
		if (selectedTypes.has(id)) selectedTypes.delete(id);
		else if (selectedTypes.size < 2) selectedTypes.add(id);
		else return;

		this.setState({
			selectedTypes: selectedTypes,
		});
	}
}

function Type(props) {
	const style = { backgroundColor: utilities.typeToColorHex[props.type] };
	const className = (props.isActive)? "pokefilter-card-type active" : "pokefilter-card-type";
	return (
		<div
			className={className}
			style={style}
			onClick={props.toggleType}
		>
			{props.type}
		</div>
	);
}

export default PokefilterType;