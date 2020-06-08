import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { startCase, camelCase } from 'lodash';
import PaymentMethodIcon from '../icons/PaymentMethodIcon';

class OrderInfo extends Component {
	static propTypes = {
		status: PropTypes.string,
		updatedAt: PropTypes.string,
		creditCard: PropTypes.shape({
			id: PropTypes.string,
			type: PropTypes.string,
			firstName: PropTypes.string,
			lastName: PropTypes.string,
			last4: PropTypes.string,
			expMonth: PropTypes.string,
			expYear: PropTypes.string,
		}),
		billingAddress: PropTypes.shape({
			id: PropTypes.string,
			address1: PropTypes.string,
			address2: PropTypes.string,
			city: PropTypes.string,
			country: PropTypes.string,
			state: PropTypes.string,
			zipcode: PropTypes.string,
		}),
	};

	static defaultProps = {
		status: '',
		updatedAt: '',
		creditCard: null,
		billingAddress: null,
	};

	renderStatus(status) {
		return (
			<div className="orderInfo__status">
				<div className={`orderInfo__status-icon orderInfo__status-icon--${camelCase(status)}`} />
				<p className="orderInfo__status-text">{startCase(status)}</p>
			</div>
		);
	}

	renderCard(creditCard) {
		const { type, firstName, lastName, last4, expMonth, expYear } = creditCard;

		return (
			<Fragment>
				<h3 className="orderInfo__title">PAYMENT METHOD</h3>

				<div className="orderInfo__card">
					<PaymentMethodIcon className="orderInfo__card-icon" icon={camelCase(type)} />

					<div className="orderInfo__card-wrap">
						<p className="orderInfo__text">
							{firstName} {lastName}
						</p>

						<div className="orderInfo__card-details">
							<p className="orderInfo__text">**** **** **** {last4}</p>
							<p className="orderInfo__card-title orderInfo__title">EXP</p>
							<p className="orderInfo__text">
								{expMonth}/{expYear}
							</p>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}

	renderAddress(billingAddress) {
		const { address1, address2, city, country, state, zipcode } = billingAddress;

		return (
			<Fragment>
				<h3 className="orderInfo__title">BILLING ADDRESS</h3>

				<div className="orderInfo__address">
					<p className="orderInfo__text">{address1}</p>
					<p className="orderInfo__text">{address2}</p>
					<p className="orderInfo__text">
						{city}, {state}
					</p>
					<p className="orderInfo__text">{zipcode}</p>
					<p className="orderInfo__text">{country}</p>
				</div>
			</Fragment>
		);
	}

	render() {
		const { status, updatedAt, creditCard, billingAddress } = this.props;

		return (
			<div className="orderInfo grid">
				{status && (
					<div className="row">
						<div className="col-xs-12 col-sm-6">
							<h3 className="orderInfo__title">PAYMENT STATUS</h3>
						</div>

						<div className="col-xs-12 col-sm-6">{this.renderStatus(status)}</div>
					</div>
				)}

				{updatedAt && (
					<div className="row">
						<div className="col-xs-12 col-sm-6">
							<h3 className="orderInfo__title">DATE</h3>
						</div>

						<div className="col-xs-12 col-sm-6">
							<p className="orderInfo__text">{moment(updatedAt).format('ll')}</p>
						</div>
					</div>
				)}

				{creditCard && (
					<div className="row">
						<div className="col-xs-12">{this.renderCard(creditCard)}</div>
					</div>
				)}

				{billingAddress && (
					<div className="row">
						<div className="col-xs-12">{this.renderAddress(billingAddress)}</div>
					</div>
				)}
			</div>
		);
	}
}

export default OrderInfo;
