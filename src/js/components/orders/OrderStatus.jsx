import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { lowerCase, merge } from 'lodash';
import Icon from '../icons/Icon';

const ORDER_CONFIG = {
	processing: {
		icon: 'statusProcessing',
		title: 'Payment Processing',
		description:
			'Your TurboToken purchase is currently being processed. We will notify you when the purchase has been confirmed.',
	},
	declined: {
		icon: 'statusDeclined',
		title: 'Payment Declined',
		description: 'Card number is not valid. Your credit card has not been charged.',
	},
};

class OrderStatus extends Component {
	static propTypes = {
		size: PropTypes.oneOf(['small', 'medium']),
		status: PropTypes.string,
		icon: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	};

	static defaultProps = {
		size: 'medium',
		status: '',
		icon: undefined,
		title: undefined,
		description: undefined,
	};

	getConfig(status) {
		return ORDER_CONFIG[status] || {};
	}

	render() {
		const { size, status, icon, title, description } = this.props;
		const content = merge(this.getConfig(status), { icon, title, description });

		return (
			<div className={`orderStatus orderStatus--${size}`}>
				{content.icon && (
					<div className={`orderStatus__icon orderStatus__icon--${lowerCase(status)}`}>
						<Icon icon={content.icon} />
					</div>
				)}

				<div className="orderStatus__content">
					<h3 className="orderStatus__title">{content.title}</h3>
					<div className="orderStatus__text">{content.description}</div>
				</div>
			</div>
		);
	}
}

export default OrderStatus;
