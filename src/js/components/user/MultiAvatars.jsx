import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from './Avatar';
import User from '../../app/User';

class MultiAvatars extends Component {
	static propTypes = {
		users: PropTypes.arrayOf(PropTypes.instanceOf(User)),
	};
	static defaultProps = {
		users: [],
	};

	render() {
		const count = this.props.users.length;
		const avatars = [];

		// Add up to 3 avatars
		this.props.users.forEach((user, index) => {
			if (index > 2) {
				return;
			}

			avatars.push(
				<div key={user.id} className="multiAvatars__avatar">
					<Avatar user={user} />
				</div>,
			);
		});

		// Add the "+X"
		if (count > 3) {
			avatars.push(
				<div key="__multiavatar__extra" className="multiAvatars__additional">
					{`+${count - 3}`}
				</div>,
			);
		}

		return <div className="multiAvatars">{avatars}</div>;
	}
}

export default MultiAvatars;
