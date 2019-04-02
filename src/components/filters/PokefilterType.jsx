import React from 'react';

function Type(props) {
	return (
		<div className="pokefilter-card-type type-electric">Electric</div>
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
		// go fetch type data
		
	}

	render() {
		return (
			<div className="pokefilter-card">
				<div className="pokefilter-card-title">Types</div>
				<div className="pokefilter-card-types">
				</div>
			</div>
		);
	}
}

export default PokefilterType;