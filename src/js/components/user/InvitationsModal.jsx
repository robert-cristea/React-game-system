import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import AppBar from '../AppBar';
import Back from '../appBar/Back';
import ScrollableView from '../ScrollableView';
import UserListItem from './UserListItem';
import Icon from '../icons/Icon';
import FriendRequest from '../../app/FriendRequest';

@observer
class InvitationsModal extends Component {
	static propTypes = {
		invitations: MobxPropTypes.arrayOrObservableArrayOf(PropTypes.instanceOf(FriendRequest)),
		onBack: PropTypes.func,
		onAcceptInvitation: PropTypes.func,
		onRefuseInvitation: PropTypes.func,
		onInvitationClick: PropTypes.func,
	};
	static defaultProps = {
		invitations: [],
		onBack: null,
		onAcceptInvitation: null,
		onRefuseInvitation: null,
		onInvitationClick: null,
	};

	handleAcceptInvitation = invitation => () => {
		if (this.props.onAcceptInvitation) {
			this.props.onAcceptInvitation(invitation);
		}
	};

	handleRefuseInvitation = invitation => () => {
		if (this.props.onRefuseInvitation) {
			this.props.onRefuseInvitation(invitation);
		}
	};

	handleInvitationClick = invitation => () => {
		if (this.props.onInvitationClick) {
			this.props.onInvitationClick(invitation);
		}
	};

	renderEmpty() {
		return <div className="invitations__none">You don&#39;t have any pending friend requests.</div>;
	}

	renderInvitations() {
		if (!this.props.invitations.length) {
			return this.renderEmpty();
		}

		return this.props.invitations.map(invitation => {
			const post = (
				<div className="invitations__actions">
					<div
						className="invitations__action invitations__action-reject"
						onClick={this.handleRefuseInvitation(invitation)}
					>
						<Icon icon="times" />
					</div>
					<div
						className="invitations__action invitations__action-accept"
						onClick={this.handleAcceptInvitation(invitation)}
					>
						<Icon icon="check" />
					</div>
				</div>
			);

			return (
				<UserListItem
					className="invitations"
					key={invitation.id}
					user={invitation.user}
					post={post}
					onClick={this.handleInvitationClick(invitation)}
				/>
			);
		});
	}

	render() {
		return (
			<div className="flex-container">
				<AppBar pre={<Back onClick={this.props.onBack} />} title="Friend Requests" />
				<ScrollableView>
					<div className="friendsList__list">{this.renderInvitations()}</div>
				</ScrollableView>
			</div>
		);
	}
}

export default InvitationsModal;
