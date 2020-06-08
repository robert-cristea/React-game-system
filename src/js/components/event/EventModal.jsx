import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import MockObject from '../../mock/MockObject';
import AppBar from '../AppBar';
import Back from '../appBar/Back';
import Actions from '../appBar/Actions';
import ScrollableView from '../ScrollableView';
import Icon from '../icons/Icon';

const propTypes = {
	event: PropTypes.instanceOf(MockObject).isRequired,
	onBack: PropTypes.func,
	onWebsiteClick: PropTypes.func,
};

const defaultProps = {
	onBack: null,
	onWebsiteClick: null,
};

const dateTimeFormat = 'MMM D, Y @ H:mm';

function EventModal({ event, ...props }) {
	const appBarActions = [{ id: 'options', icon: 'ellipsis-h' }];

	let registrationDateLimit = 'No registration date limit';

	if (event.registrationDateLimit) {
		registrationDateLimit = `Register by ${moment(event.registrationDateLimit).format(dateTimeFormat)}`;
	}

	return (
		<div className="flex-container">
			<AppBar pre={<Back onClick={props.onBack} />} title={event.name} post={<Actions actions={appBarActions} />} />
			<ScrollableView>
				<div className="communityModal__hero" style={{ backgroundImage: `url(${event.medias.activity})` }}>
					<div className="communityModal__wrapper">
						<img className="communityModal__thumb" src={event.medias.cover} alt={event.name} />
						<div className="communityModal__name">{event.name}</div>
						<div className="profilePreview__username">{event.tagLine}</div>
					</div>
				</div>
				<div className="activities__list">
					<div className="activities__card card__small">
						<div className="activities__meta">
							<img className="stream__gameTag-thumbnail" src={event.medias.store} alt={event.name} />
							<div className="activities__text">
								<div className="activities__card-title">{event.game.name}</div>
								<div className="stream__gameTag-publisher">{event.game.publisher}</div>
							</div>
						</div>
					</div>
				</div>
				<div className="profilePreview__details">
					<div className="profilePreview__details-item">
						<Icon icon="h-square" />
						{event.host} is Hosting
					</div>
					<div className="profilePreview__details-item">
						<Icon icon="ticket-alt" />
						{registrationDateLimit}
					</div>
					<div className="profilePreview__details-item">
						<Icon icon="clock" />
						{moment(event.startDateTime).format(dateTimeFormat)}
						<span> to </span>
						{moment(event.endDateTime).format(dateTimeFormat)}
					</div>
					<div className="shopGame__description">{event.description}</div>
				</div>
			</ScrollableView>
			<div className="shopGame__purchase" onClick={props.onWebsiteClick}>
				<button className="btn btn--main shopGame__purchase-button">Visit Official Website</button>
			</div>
		</div>
	);
}

EventModal.propTypes = propTypes;
EventModal.defaultProps = defaultProps;

export default EventModal;
