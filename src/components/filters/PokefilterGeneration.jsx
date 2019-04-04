import React from 'react';
import PropTypes from 'prop-types';
import PokeAPI from './../../api/PokeAPI';

/**
 * Component that dispalys and controls the filter for pokemon regions.
 */
class PokefilterGeneration extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			generations: [], // list of generations {id, name}
			selectedGeneration: null,
		}
	}


	/**
	 * Once component is mounted, go fetch generations to be cached and trigger
	 * re-render.
	 */
	componentDidMount() {
		PokeAPI.getGenerations((generations) => {
			this.setState({ generations: generations });
		});
	}


	/**
	 * Renders generation components based on generations and selected generation.
	 * @param {Array} generations list of generations {id, name}
	 * @param {Number} selectedGeneration id of selected generation
	 */
	renderGenerationComponents(generations, selectedGeneration) {
		const generationComponents = [];
		generations.forEach((generation) => {
			const isActive = generation.id === selectedGeneration;
			generationComponents.push(
				<Generation
					key={generation.id}
					name={generation.name}
					toggleGeneration={() => this.toggleGeneration(generation.id)}
					isActive={isActive}
				/>
			);
		});
		return generationComponents;
	}


	render() {
		const selectedGeneration = this.state.selectedGeneration;
		const generations = this.state.generations;
		const generationComponents = this.renderGenerationComponents(generations, selectedGeneration);

		return (
			<div className="pokefilter-card">
				<div className="pokefilter-card-title">Regions</div>
				<div className="pokefilter-card-generations">
					{generationComponents}
				</div>
			</div>
		);
	}


	/**
	 * Toggles generation filter to be applied. Only one generation can be
	 * selected. Deselection upon selection of already selected.
	 * @param {Number} id pokemon generation id
	 */
	toggleGeneration(id) {
		const selectedGeneration = this.state.selectedGeneration;
		if (id !== selectedGeneration)
			this.setState({ selectedGeneration: id }, () => {
				this.props.updateFilters();
				// console.log("new generation selected");
			});
		else
			this.setState({ selectedGeneration: null }, () => {
				this.props.updateFilters();
				// console.log("generation disabled");
			});
	}

}


PokefilterGeneration.propTypes = {
	updateFilters: PropTypes.func.isRequired,
}


/**
 * Function sub-component for PokefilterGeneration, represents possible
 * generations, selected/active state.
 * @param {Object} props 
 */
function Generation(props) {
	const name = props.name;
	const className = (props.isActive) ?
		"pokefilter-card-generation active" : "pokefilter-card-generation";

	return (
		<div
			className={className}
			onClick={props.toggleGeneration}
		>
			{name}
		</div>
	);
}

Generation.propTypes = {
	name: PropTypes.string.isRequired,
	toggleGeneration: PropTypes.func.isRequired,
	isActive: PropTypes.bool.isRequired,
}


export default PokefilterGeneration;