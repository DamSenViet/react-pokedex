import React from 'react';

/**
 * Component that displays and controls the name filter.
 */
class PokefilterName extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			updateTimer: null, // timer to account for deference duration
			selectedQuery: "",
		}
	}

	render() {
		const selectedQuery = this.state.selectedQuery;
		const isClearActive = (selectedQuery.length !== 0) ? true : false;
		const clearComponentClassName = (isClearActive) ?
			"pokefilter-card-clear active" : "pokefilter-card-clear";

		return (
			<div className="pokefilter-card">
				<div className="pokefilter-card-title">Name</div>
				<input
					className="pokefilter-card-name"
					value={selectedQuery}
					spellCheck={false}
					onChange={this.onChange.bind(this)}
				/>
				<div
					className={clearComponentClassName}
					onClick={this.clearSelectedQuery.bind(this)}
				>
					x
				</div>
			</div>
		);
	}


	/**
	 * Clears the update timer. Prevents update to filters. Callback function
	 * available for synchronous timer refreshing.
	 * @param {function} callback handler to run once clearing is done
	 */
	clearUpdateTimer(callback) {
		if (this.state.updateTimer) {
			// console.log("clearing timer");
			window.clearTimeout(this.state.updateTimer);
			this.setState({ updateTimer: null }, () => {
				if (callback) callback();
			});
		}
		else if (callback) callback();
	}

	/**
	 * Sets the update timer to defer the update to filters.
	 */
	setUpdateTimer() {
		// console.log("setting timer");
		const updateTimer = window.setTimeout(() => {
			// console.log("timer depleted, updating...");
			this.props.updateFilters();
		}, 500); // wait for user to stop typing for 300ms
		this.setState({ updateTimer: updateTimer });
	}


	/**
	 * Clears and sets a new update timer.
	 */
	refreshUpdateTimer() {
		this.clearUpdateTimer(() => {
			this.setUpdateTimer();
		});
	}


	/**
	 * Clears the selected query and refresh th e update timer.
	 */
	clearSelectedQuery() {
		this.setState({ selectedQuery: "" }, () => {
			this.refreshUpdateTimer();
		});
	}


	/**
	 * Sets the new query every time there's a keypress.
	 */
	onChange(event) {
		this.setState({ selectedQuery: event.target.value }, () => {
			this.refreshUpdateTimer();
		});
	}

}

export default PokefilterName;