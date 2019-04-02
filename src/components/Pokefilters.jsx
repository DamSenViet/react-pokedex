import React from 'react';
import PokefilterType from './filters/PokefilterType';
import './../css/Pokefilters.css';

// filter container, handles result fetching results based upon all filters
class Pokefilters extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render() {
		return (
			<div className="pokefilters">
				<div className="pokefilters-title">Filters</div>
				<ul>
					<PokefilterType />
				</ul>
			</div>
		);
	}
}

export default Pokefilters;