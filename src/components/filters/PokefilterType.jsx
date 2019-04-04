import React from 'react';
import PropTypes from 'prop-types';
import PokeAPI from './../../api/PokeAPI';
import * as utilities from './../utilities';


/**
 * Component that displays and controls the filter for pokemon types.
 */
class PokefilterType extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			types: [], // list of valid types {id, name}
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
	 * @param {Set} selectedTypes list of unique of type ids
	 */
	renderTypeComponents(types, selectedTypes) {
		const typeComponents = [];
		types.forEach((type) => {
			const isActive = selectedTypes.has(type.id);
			typeComponents.push(
				<Type
					key={type.id}
					name={type.name}
					toggleType={() => this.toggleType(type.id)}
					isActive={isActive}
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
	 * Deselected upon selection of already selected.
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
		this.setState({ selectedTypes: selectedTypes }, () => {
			this.props.updateFilters();
		});
	}

}


PokefilterType.propTypes = {
	updateFilters: PropTypes.func.isRequired,
}


/**
 * Function sub-component for PokefilterType, represents possible types,
 * selected/active state.
 * @param {Object} props
 */
function Type(props) {
	const name = props.name;
	const typeColor = utilities.typeToColorHex[name];
	const style = (props.isActive) ?
		{ backgroundColor: typeColor } : { color: typeColor, borderColor: typeColor };
	const className = (props.isActive) ?
		"pokefilter-card-type active" : "pokefilter-card-type";

	return (
		<div
			className={className}
			style={style}
			onClick={props.toggleType}
		>
			{name}
		</div>
	);
}


Type.propTypes = {
	name: PropTypes.string.isRequired,
	toggleType: PropTypes.func.isRequired,
	isActive: PropTypes.bool.isRequired,
}


export default PokefilterType;