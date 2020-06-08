import React from 'react';
import PropTypes from 'prop-types';
import has from 'lodash/has';
import UserModel from '../../app/User';
import MockObject from '../../mock/MockObject';

const propTypes = {
	// eslint-disable-next-line react/no-unused-prop-types
	user: PropTypes.oneOfType([PropTypes.instanceOf(MockObject), PropTypes.instanceOf(UserModel)]).isRequired,
};

const defaultProps = {};

/**
 * @param {User} test
 * @param {User} user
 * @return {*}
 */
function Avatar({ user }) {
	if (has(user, 'avatar')) {
		return <img className="avatar" src={user.avatar} alt={user.username} />;
	}

	// When we don't have the avatar url yet
	return <div className="avatar" />;
}

Avatar.propTypes = propTypes;
Avatar.defaultProps = defaultProps;

export default Avatar;
