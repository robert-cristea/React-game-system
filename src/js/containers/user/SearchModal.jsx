import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import SearchModalComponent from '../../components/user/SearchModal';
import UserRepository from '../../app/Repositories/UserRepository';
import Config from '../../app/Config';
import Authentication from '../../app/Authentication';

@inject('userRepository', 'config', 'auth')
@observer
class SearchModal extends Component {
	static propTypes = {};
	static defaultProps = {};

	@observable
	loading = false;

	/**
	 * Already invited user ids. Note that this array resets when the modal is closed, so only
	 * useful while the modal is opened.
	 * @type {ObservableArray<string>}
	 */
	@observable
	invitedUserIds = [];

	/**
	 * @type {UserSearchResult|null}
	 */
	@observable
	result = null;

	handleSearch = query => {
		/** @type {UserRepository} */
		const repo = this.props.userRepository;
		const attributes = this.props.config.get('userAttributes.search');

		this.loading = true;
		repo.search(query, attributes).then(result => {
			this.loading = false;
			this.result = result;
		});
	};

	handleInviteUser = user => {
		const id = user.id;

		if (this.invitedUserIds.indexOf(id) !== -1) {
			return;
		}

		this.invitedUserIds.push(id);
		this.props.auth.getUser().inviteUser(user);
	};

	render() {
		const props = {
			...this.props,
			invitedUserIds: this.invitedUserIds,
			loading: this.loading,
			searchResult: this.result,
			onSearch: this.handleSearch,
			onInvite: this.handleInviteUser,
		};
		return <SearchModalComponent {...props} />;
	}
}

// Injected props
SearchModal.wrappedComponent.propTypes = {
	userRepository: PropTypes.instanceOf(UserRepository).isRequired,
	auth: PropTypes.instanceOf(Authentication).isRequired,
	config: PropTypes.instanceOf(Config).isRequired,
};

export default SearchModal;
