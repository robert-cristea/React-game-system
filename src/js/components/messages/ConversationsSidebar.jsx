import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as PropTypesMobx } from 'mobx-react';
import { observable } from 'mobx';
import ReactTooltip from 'react-tooltip';
import ScrollableView from '../ScrollableView';
import UISidebar from '../Sidebar';
import ConversationPreview from '../conversations/ConversationPreview';
import ConversationModel from '../../app/Conversation';
import Loading from '../Loading';
import Icon from '../icons/Icon';

@observer
class ConversationsSidebar extends ReactComponent {
	static propTypes = {
		conversations: PropTypesMobx.arrayOrObservableArrayOf(PropTypes.instanceOf(ConversationModel)),
		loading: PropTypes.bool,
		currentConversation: PropTypes.instanceOf(ConversationModel),
		onSearch: PropTypes.func,
		onConversationClick: PropTypes.func,
		onNewConversation: PropTypes.func,
	};

	static defaultProps = {
		conversations: [],
		loading: false,
		currentConversation: null,
		onSearch: null,
		onConversationClick: null,
		onNewConversation: null,
	};

	@observable
	searchValue = '';

	componentWillMount() {
		this.searchValue = '';
	}

	handleConversationClick(conversation) {
		return () => {
			if (this.props.onConversationClick) {
				this.props.onConversationClick(conversation);
			}
		};
	}

	handleSearchChange = event => {
		this.searchValue = event.target.value;
	};

	handleSearch = () => {
		if (this.props.onSearch) {
			this.props.onSearch(this.searchValue);
		}
	};

	renderConversations() {
		return this.props.conversations.map(conversation => {
			const classNames = ['messagesSidebar__item'];

			if (conversation === this.props.currentConversation) {
				classNames.push('messagesSidebar__item--active');
			}

			return (
				<div
					key={conversation.id}
					className={classNames.join(' ')}
					onClick={this.handleConversationClick(conversation)}
				>
					<ConversationPreview
						conversation={conversation}
						currentUser={this.props.currentUser}
						active={conversation === this.props.currentConversation}
					/>
				</div>
			);
		});
	}

	renderLoading() {
		return (
			<div className="messagesSidebar__loading">
				<Loading />
			</div>
		);
	}

	renderEmpty() {
		return <div className="messagesSidebar__empty">You didn't start any conversation yet.</div>;
	}

	render() {
		let content;

		if (this.props.loading) {
			content = this.renderLoading();
		} else if (!this.props.conversations.length) {
			content = this.renderEmpty();
		} else {
			content = this.renderConversations();
		}

		return (
			<UISidebar>
				<div className="messagesSidebar__header sidebar__header">
					<div className="messagesSidebar__headerMain input--search">
						<button className="btn btn--transparent" type="submit" onClick={this.handleSearch}>
							<Icon icon="search" />
						</button>
						<input
							value={this.searchValue}
							className="input--alt1"
							placeholder="Search messages..."
							onChange={this.handleSearchChange}
						/>
					</div>
					<div className="messagesSidebar__headerPost">
						<span
							onClick={this.props.onNewConversation}
							className="messagesSidebar__headerAction"
							data-tip="Start a new conversation"
							data-for="tooltip-messages-new-conversation"
						>
							<Icon icon="createGroup" />
						</span>
						<ReactTooltip id="tooltip-messages-new-conversation" className="tooltip" place="bottom" effect="solid" />
					</div>
				</div>
				<div className="messagesSidebar__main">
					<ScrollableView className="messagesSidebar__list">
						<div className="messagesSidebar__scrollableContent">
							<div className="messagesSidebar__title">Active threads</div>
							{content}
						</div>
					</ScrollableView>
				</div>
			</UISidebar>
		);
	}
}

export default ConversationsSidebar;
