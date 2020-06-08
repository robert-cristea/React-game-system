import React, { Component as ReactComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Loading from '../Loading';
import Icon from '../icons/Icon';
import Avatar from '../user/Avatar';
import Dropdown from '../Dropdown';
import DropdownItem from './DropdownItem';
import User from '../../app/User';

@observer
class Component extends ReactComponent {
	static propTypes = {
		loading: PropTypes.bool,
		onLogout: PropTypes.func,
		onOpenProfile: PropTypes.func,
		onManageTokens: PropTypes.func,
		user: PropTypes.instanceOf(User).isRequired,
	};
	static defaultProps = {
		loading: true,
		onLogout: null,
		onOpenProfile: null,
		onManageTokens: null,
	};

	dropdownRef = null;

	getItems = className => [
		// {
		// 	title: 'My Profile',
		// 	onClick: this.props.onOpenProfile,
		// 	className,
		// },
		{
			title: 'Account Settings',
			url: '/dashboard/account',
			className,
		},
		{
			title: 'Notification Settings',
			url: '/dashboard/notification',
			className,
		},
		{
			title: 'Privacy Settings',
			url: '/dashboard/privacy',
			className,
		},
		{
			title: 'Manage Tokens',
			onClick: this.props.onManageTokens,
			className,
		},
		{
			title: 'Purchase History',
			url: '/dashboard/orders',
			className,
		},
		{
			title: 'Log out',
			onClick: this.props.onLogout,
			className,
		},
	];

	handleMenuHide() {
		if (this.dropdownRef) {
			this.dropdownRef.handleHide();
		}
	}

	render() {
		return (
			<Fragment>
				{this.props.loading ? (
					<Loading size="small" />
				) : (
					<Dropdown
						position="right"
						theme="main"
						button={
							<div className="appHeaderProfile">
								<div className="appHeaderProfile__avatar">
									<Avatar user={this.props.user} />
								</div>
								<div className="appHeaderProfile__info">
									<p className="appHeaderProfile__info-name">{this.props.user.username}</p>
									{/* <p className="appHeaderProfile__info-username">
										{this.props.user.email}
									</p> */}
								</div>
								<Icon className="appHeaderProfile__icon" icon="chevronDown" />
							</div>
						}
						onRef={ref => {
							this.dropdownRef = ref;
						}}
					>
						{this.getItems('appHeaderProfile').map(item => (
							<DropdownItem onClose={() => this.handleMenuHide.call(this)} key={item.title} {...item} />
						))}
					</Dropdown>
				)}
			</Fragment>
		);
	}
}

export default Component;
