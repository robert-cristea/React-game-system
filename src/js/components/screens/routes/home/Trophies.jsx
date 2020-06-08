import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MockObject from '../../../../mock/MockObject';
import ProgressBar from '../../../ProgressBar';
import Icon from '../../../icons/Icon';

class Trophies extends Component {
	static propTypes = {
		onGameClick: PropTypes.func,
		trophies: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
	};
	static defaultProps = {
		onGameClick: null,
		trophies: [],
	};

	handleGameClick(game) {
		return () => {
			if (this.props.onGameClick) {
				this.props.onGameClick(game);
			}
		};
	}

	renderTrophy = trophy => (
		<div className="activity__card" key={trophy.id} onClick={this.handleGameClick(trophy.game)}>
			<div className="activity__card-wrap">
				<img className="activity__card-image" src={trophy.game.medias.cover} alt={trophy.game.name} />
				<div className="activity__card-info">
					<div className="activity__card-title">{trophy.game.name}</div>
					<ProgressBar value={trophy.won * 100} />
				</div>
			</div>
		</div>
	);

	render() {
		return (
			<div className="activity">
				<div className="activity__header">
					<Icon icon="games" />
					<h1 className="activity__title">ACTIVITY</h1>
				</div>

				<div className="trophies__graphic-wrapper">
					<img
						className="trophies__graphic"
						src="https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/trophy-chart.png"
						alt="Activity"
					/>
				</div>
				<div className="trophies__container">
					<div className="trophies__collection">
						<div className="trophies__current trophies__trophy">
							<Icon icon="trophy" />7
						</div>
						<div className="trophies__wall">
							<div className="trophies__gold trophies__trophy">
								<Icon icon="trophy" />
								91
							</div>
							<div className="trophies__silver trophies__trophy">
								<Icon icon="trophy" />
								199
							</div>
							<div className="trophies__bronze trophies__trophy">
								<Icon icon="trophy" />
								247
							</div>
						</div>
					</div>
					<ProgressBar value={34} text="" />
				</div>

				<div className="activity__header">
					<Icon icon="games" />
					<h1 className="activity__title">LATEST TROPHIES</h1>
				</div>

				<div>{this.props.trophies.map(this.renderTrophy)}</div>
			</div>
		);
	}
}

export default Trophies;
