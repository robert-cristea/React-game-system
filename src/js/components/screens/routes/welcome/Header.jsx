import React from 'react';
import Icon from '../../../icons/Icon';

function Header() {
	return (
		<div className="welcome__header">
			<Icon className="welcome__header-logo" icon="logo" />
			<Icon className="welcome__header-text" icon="logoText" />
		</div>
	);
}

export default Header;
