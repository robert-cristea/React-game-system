import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../icons/Icon';

class Item extends Component {
	static propTypes = {
		title: PropTypes.string,
		text: PropTypes.string,
		buttonTitle: PropTypes.string,
		buttonIcon: PropTypes.string,
		onButtonClick: PropTypes.func,
	};

	static defaultProps = {
		title: null,
		text: null,
		buttonTitle: null,
		buttonIcon: null,
		onButtonClick: null,
	};

	handleButtonClick = () => {
		if (this.props.onButtonClick) {
			this.props.onButtonClick();
		}
	};

	render() {
		return (
			<div className="card">
				{this.props.title && <h2 className="card__title">{this.props.title}</h2>}
				{this.props.text && <p className="card__text">{this.props.text}</p>}
				{this.props.onButtonClick && (
					<button className="card__btn btn btn--main btn--wide" onClick={this.handleButtonClick} type="button">
						{this.props.buttonIcon && <Icon icon={this.props.buttonIcon} />}
						{this.props.buttonTitle && <span>{this.props.buttonTitle}</span>}
					</button>
				)}
			</div>
		);
	}
}

export default Item;
