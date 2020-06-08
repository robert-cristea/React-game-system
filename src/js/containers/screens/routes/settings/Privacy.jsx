import React, { Component as ReactComponent } from 'react';

class Privacy extends ReactComponent {
	static propTypes = {};
	static defaultProps = {};

	renderHeader() {
		return (
			<div className="orders__header">
				<h1 className="orders__title">PRIVACY SETTINGS</h1>
			</div>
		);
	}

	render() {
		return (
			<div className="orders">
				{this.renderHeader()}
				<div className="orders__content">
					{/* <div className="orders__sub-header">
						<h1 className="orders__sub-title">PRIVACY SETTINGS</h1>
					</div> */}

					<div className="orders__content-wrap">Coming Soon!</div>
				</div>
			</div>
		);
	}
}

export default Privacy;
