import React, { Component as ReactComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import Component from '../../../../components/screens/routes/home/Events';
import sampleEvents, { getEventById } from '../../../../mock/sampleEvents';
import UI from '../../../../app/UI';
import PanelModal from '../../../../components/modals/PanelModal';
import EventModal from '../../../../components/event/EventModal';

@inject('ui')
@observer
class Events extends ReactComponent {
	static propTypes = {
		match: PropTypes.object.isRequired,
	};
	static defaultProps = {};

	/**
	 * This variable is only a workaround to fix a problem with react-modal and react-hot-reload.
	 * Without it, when a hot reload occurs, the modal seems to loose reference to the DOM element
	 * where it must be attached.
	 * @type {boolean}
	 */
	@observable
	didMount = false;

	@observable
	eventModalVisible = false;

	@observable
	displayedEvent = null;

	componentWillMount() {
		this.didMount = false;
		this.updateEventModal();
	}

	componentWillReceiveProps(newProps) {
		this.updateEventModal(newProps);
	}

	componentDidMount() {
		this.didMount = true;
	}

	updateEventModal(props = this.props) {
		const eventId = props.match.params.event;

		if (!eventId) {
			this.closeEventModal();
			return;
		}

		const event = getEventById(eventId);

		if (!event) {
			this.closeEventModal();
			return;
		}

		this.displayedEvent = event;
		this.openEventModal();
	}

	closeEventModal() {
		this.eventModalVisible = false;
	}

	openEventModal() {
		this.eventModalVisible = true;
	}

	handleEventModalClose = () => {
		// this.props.ui.router.goBack();
		this.props.ui.router.goTo('/dashboard/events');
	};

	renderEventModal() {
		// react-modal and react-hot-loader workaround
		if (!this.didMount) {
			return null;
		}
		// end workaround

		const modalLocation = this.props.ui.getModalLocation('dashboard-0');

		if (!modalLocation) {
			return null;
		}

		if (!this.displayedEvent) {
			return null;
		}

		return (
			<PanelModal
				isOpen={this.eventModalVisible}
				parentSelector={() => modalLocation}
				onRequestClose={this.handleEventModalClose}
			>
				<EventModal event={this.displayedEvent} onBack={this.handleEventModalClose} />
			</PanelModal>
		);
	}

	// eslint-disable-next-line no-unused-vars
	handleEventClick = event => {
		// TODO: Enable event preview
		// this.props.ui.router.goTo(`/dashboard/events/${event.id}`);
	};

	render() {
		return (
			<Fragment>
				<Component
					calendarNumberOfMonths={6}
					suggestedEvents={sampleEvents.suggested}
					allEvents={sampleEvents.all}
					gamesEvents={sampleEvents.games}
					onEventClick={this.handleEventClick}
				/>
				{/* {this.renderEventModal()} */}
			</Fragment>
		);
	}
}

// Injected props
Events.wrappedComponent.propTypes = {
	ui: PropTypes.instanceOf(UI).isRequired,
};

export default Events;
