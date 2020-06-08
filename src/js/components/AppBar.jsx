import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from './icons/Icon';

class AppBar extends Component {
	static propTypes = {
		pre: PropTypes.node,
		post: PropTypes.node,
		title: PropTypes.node,
		showLogo: PropTypes.bool,
	};
	static defaultProps = {
		pre: null,
		post: null,
		title: null,
		showLogo: true,
	};

	renderPre() {
		if (this.props.pre) {
			return this.props.pre;
		}

		return <div />;
	}

	renderPost() {
		if (this.props.post) {
			return this.props.post;
		}

		return <div />;
	}

	renderTitle() {
		if (this.props.title) {
			return this.props.title;
		}

		if (this.props.showLogo) {
			return (
				<div className="appHeader__logo">
					<Icon className="appBar__logo-icon" icon="logo" />
					<Icon className="appBar__logo-text" icon="logoText" />
				</div>
			);
		}

		return null;
	}

	render() {
		return (
			<div className="appBar">
				<div className="appBar__pre">{this.renderPre()}</div>
				<div className="appBar__title">{this.renderTitle()}</div>
				<div className="appBar__post">{this.renderPost()}</div>
			</div>
		);
	}
}

export default AppBar;
