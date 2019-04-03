import React from 'react';
import PokeAPI from './../../api/PokeAPI';
import * as utilities from './../utilities';


/**
 * Class representing the filter for pokemon types.
 */
class PokefilterType extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			types: [],
			selectedTypes: new Set(),
		};
	}

	/**
	 * Once component is mounted go fetch types to be cached and trigger
	 * re-render via setState.
	 */
	componentDidMount() {
		PokeAPI.getTypes((types) => {
			this.setState({ types: types });
		});
	}


	/**
	 * Renders type components based on types and selected types.
	 * @param {Array} types list of types {id, name}
	 * @param {Set} selectedTypes list of unique of type names
	 */
	renderTypeComponents(types, selectedTypes) {
		const typeComponents = [];
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
		return typeComponents;
	}


	render() {
		const types = this.state.types;
		const selectedTypes = this.state.selectedTypes;
		const typeComponents = this.renderTypeComponents(types, selectedTypes);

		return (
			<div className="pokefilter-card">
				<div className="pokefilter-card-title">Types</div>
				<div className="pokefilter-card-types">
					{typeComponents}
				</div>
			</div>
		);
	}


	/**
	 * Toggles type filter to be applied. Up to two types can be selected.
	 * @param {Number} id pokemon type id
	 */
	toggleType(id) {
		const selectedTypes = new Set(this.state.selectedTypes);
		if (selectedTypes.has(id)) selectedTypes.delete(id);
		else if (selectedTypes.size < 2) selectedTypes.add(id);
		// no changes to selected types, block update
		else return;

		// make the filter container re-retrieve results
		// after new filter condition has been applied
		this.setState({ selectedTypes: selectedTypes, },
			() => this.props.updateFilters());
	}
}

/**
 * Function sub-component for PokefilterType, represents possible types,
 * selected/active state.
 * @param {Object} props
 */
function Type(props) {
	const style = { backgroundColor: utilities.typeToColorHex[props.type] };
	const className = (props.isActive) ? "pokefilter-card-type active" : "pokefilter-card-type";
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