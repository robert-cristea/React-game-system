import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import first from 'lodash/first';
import last from 'lodash/last';
import { observer, PropTypes as PropTypesMobx } from 'mobx-react';
import MessageEventComponent from './message/MessageEvent';
import Icon from '../icons/Icon';
import AbstractEvent from '../../app/ConversationEvent/AbstractEvent';
import MessageEvent from '../../app/ConversationEvent/MessageEvent';
import User from '../../app/User';
import UserEventModel from '../../app/ConversationEvent/UserEvent';
import UserEvent from '../../containers/conversations/UserEvent';
import ReactionSelector from './ReactionSelector';
import ScrollableView from '../ScrollableView';
import Loading from '../Loading';
import ScrollTrigger from '../ScrollTrigger';

@observer
class ConversationHistory extends Component {
	static propTypes = {
		events: PropTypesMobx.observableArrayOf(PropTypes.instanceOf(AbstractEvent)).isRequired,
		currentUser: PropTypes.instanceOf(User).isRequired,
		hasMoreEvents: PropTypes.bool,
		onAddEventReaction: PropTypes.func,
		onLoadPreviousEvents: PropTypes.func,
	};

	static defaultProps = {
		hasMoreEvents: false,
		onAddEventReaction: null,
		onLoadPreviousEvents: null,
	};

	elmRefs = {};
	reactionSelectingForEvent = null;

	disposers = [];

	/**
	 * Used for the autoscroll
	 * @type {AbstractEvent|null}
	 */
	latestEvent = null;

	/**
	 * Used for the autoscroll
	 * @type {AbstractEvent|null}
	 */
	oldestEvent = null;

	/**
	 * Scroll snapshot. See startAutoScroll
	 * @type {{fromTop: number, fromBottom: number, height: number}}
	 */
	previousScrollData = {
		fromTop: 0, // Scroll position from the top
		fromBottom: 0, // Scroll position from the bottom
		height: 0, // Total height of scrollable content
	};

	componentDidMount() {
		this.startAutoScroll();
	}

	componentWillUnmount() {
		this.reset();
	}

	reset() {
		this.latestEvent = null;
		this.disposers.forEach(disposer => disposer());
		this.disposers = [];
	}

	startAutoScroll() {
		// Just before new events are added to `conversation.events`, we take a snapshot of
		// the current scroll value and scroll height. After the events are added (see autorun()
		// below), we will use those data to adjust scroll position
		this.disposers.push(
			this.props.events.intercept(change => {
				if (this.elmRefs.scrollContainer) {
					const containerHeight = this.elmRefs.scrollContainer.clientHeight;
					const height = this.elmRefs.scrollContainer.scrollHeight;
					const fromTop = this.elmRefs.scrollContainer.scrollTop;
					const fromBottom = height - (fromTop + containerHeight);

					this.previousScrollData.height = height;
					this.previousScrollData.fromTop = fromTop;
					this.previousScrollData.fromBottom = fromBottom;
				}

				return change;
			}),
		);

		// Just after new events were added
		this.disposers.push(
			autorun(() => {
				const previousLatest = this.latestEvent;
				const previousOldest = this.oldestEvent;
				this.latestEvent = first(this.props.events);
				this.oldestEvent = last(this.props.events);

				// We wait a frame so the new events are added to the DOM
				window.requestAnimationFrame(() => {
					const scrollData = this.previousScrollData;

					// If a new event was added at the bottom and the user is already (almost) at the
					// bottom, we scroll to the bottom
					if (previousLatest !== this.latestEvent && scrollData.fromBottom <= 75) {
						this.scrollToBottom(previousLatest !== null);
					} else if (previousOldest !== this.oldestEvent && this.elmRefs.scrollContainer) {
						// If new events were prepended, we adjust scroll to keep the current scroll
						// position
						const newHeight = this.elmRefs.scrollContainer.scrollHeight;
						this.elmRefs.scrollContainer.scrollTop =
							newHeight - this.previousScrollData.height + this.previousScrollData.fromTop;
					}
				});
			}),
		);
	}

	scrollToBottom(smooth = false) {
		if (this.elmRefs.endOfList) {
			window.requestAnimationFrame(() => {
				this.elmRefs.endOfList.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
			});
		}
	}

	showReactionSelector(element) {
		const elementRect = element.getBoundingClientRect();
		const containerRect = this.elmRefs.container.getBoundingClientRect();

		const top = elementRect.y - containerRect.y + elementRect.height / 2;
		let left = elementRect.x - containerRect.x + elementRect.width / 2;
		const containerWidth = containerRect.width;
		const showOnLeft = left > containerWidth / 2;
		left += (showOnLeft ? -1 : 1) * (elementRect.width / 2 + 16);
		const position = showOnLeft ? ReactionSelector.LEFT_TOP : ReactionSelector.RIGHT_TOP;

		this.elmRefs.emojiSelector.show([left, top], position);
	}

	handleReactionSelectorClick = conversationEvent => mouseEvent => {
		this.reactionSelectingForEvent = conversationEvent;
		const element = mouseEvent.currentTarget;
		this.showReactionSelector(element);
	};

	handleReactionSelected = emoji => {
		if (this.props.onAddEventReaction) {
			this.props.onAddEventReaction(emoji, this.reactionSelectingForEvent);
		}
		this.elmRefs.emojiSelector.hide();
	};

	renderEmpty() {
		if (this.props.events.length > 0) {
			return null;
		}

		return (
			<div className="conversationHistory__empty">
				<Icon icon="group" />
				<p className="conversationHistory__empty-title">Start your conversation</p>
			</div>
		);
	}

	renderEntries() {
		const entries = [];
		// Events are stored in descending order, so we reverse the array
		this.props.events.reverse().forEach((/** @type {AbstractEvent} */ event) => {
			const key = event.id || event.ref;

			// Message
			if (event instanceof MessageEvent) {
				const isCurrentUser = event.message.user === this.props.currentUser;

				entries.push(
					<div className="conversationHistory__entry" key={key}>
						<MessageEventComponent
							event={event}
							isCurrentUser={isCurrentUser}
							onReactionSelectorClick={this.handleReactionSelectorClick(event)}
						/>
					</div>,
				);
			}

			// User event
			if (event instanceof UserEventModel) {
				entries.push(
					<div className="conversationHistory__entry" key={key}>
						<div className="conversationHistory__event">
							<UserEvent event={event} />
						</div>
					</div>,
				);
			}
		});

		return entries;
	}

	renderEmojiSelector() {
		return (
			<ReactionSelector
				className="conversationHistory__reactionSelector"
				ref={ref => {
					this.elmRefs.emojiSelector = ref;
				}}
				autoHideOnOutsideClick
				onSelect={this.handleReactionSelected}
			/>
		);
	}

	renderLoadMore() {
		if (!this.props.hasMoreEvents) {
			return null;
		}

		return (
			<div className="conversationHistory__loader" key="__loader__">
				<Loading />
			</div>
		);
	}

	render() {
		return (
			<ScrollableView className="conversationHistory__wrapper">
				<div
					ref={ref => {
						this.elmRefs.container = ref;
					}}
					className="conversationHistory"
				>
					{this.renderEmpty()}
					<div
						ref={ref => {
							this.elmRefs.scrollContainer = ref ? ref.parentNode.parentNode : null;
						}}
					/>
					<ScrollTrigger
						threshold={100}
						enabled={this.props.hasMoreEvents}
						onTrigger={this.props.onLoadPreviousEvents}
						from="top"
					>
						{this.renderLoadMore()}
						{this.renderEntries()}
					</ScrollTrigger>
					{this.renderEmojiSelector()}
				</div>
				<div
					ref={n => {
						this.elmRefs.endOfList = n;
					}}
				/>
			</ScrollableView>
		);
	}
}

export default ConversationHistory;
