import React, { Component as ReactComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';
import Cleave from 'cleave.js/react';
import Select from 'react-select';
import get from 'lodash/get';
import ccNumberValidator from 'valid-card-number';
import countries from 'country-region-data';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import { countryUsesZip } from '../../../utils';
import Input from '../../Input';
import Icon from '../../icons/Icon';
import PaymentMethodIcon from '../../icons/PaymentMethodIcon';

function unFormatNumber(value) {
	return value.replace(/\D+/g, '');
}

const countriesWithRegionsDropdown = {
	CA: { shortLabel: 'Province' },
	US: { shortLabel: 'State' },
};

const countryList = countries.map(country => {
	const hasRegion = get(countriesWithRegionsDropdown, country.countryShortCode, false) !== false;

	return {
		value: country.countryShortCode, // `value` must be the country short code
		label: country.countryName,
		regions: hasRegion ? country.regions : null,
		hasRegion,
	};
});

const VIEWS = {
	CARD: 'card',
	ADDRESS: 'address',
};

const CVV_MESSAGE =
	'<strong>Visa and MasterCard</strong>: The last 3-digits printed on the back of the card is security code<br>' +
	'<strong>American Express</strong>: The 4-digit security code is printed on the front of the card';

@observer
class AddPaymentMethod extends ReactComponent {
	static propTypes = {
		onSubmit: PropTypes.func,
		onGoBack: PropTypes.func,
	};

	static defaultProps = {
		onSubmit: null,
		onGoBack: null,
	};

	@observable
	formErrors = new Map();

	@observable
	view = VIEWS.CARD;

	@observable
	values = new Map();

	formRefs = {};

	componentWillMount() {
		this.formErrors.clear();
		this.values.clear();
		this.view = VIEWS.CARD;
	}

	@computed
	get postalCodeLabel() {
		const defaultLabel = 'Postal code';

		if (!this.values.has('country')) {
			return defaultLabel;
		}

		const code = this.values.get('country').value;
		return code === 'US' ? 'Zip' : defaultLabel;
	}

	@computed
	get regionShortLabel() {
		const defaultLabel = 'Prov/State';

		if (!this.values.has('country')) {
			return defaultLabel;
		}

		const code = this.values.get('country').value;
		return countriesWithRegionsDropdown[code] ? countriesWithRegionsDropdown[code].shortLabel : defaultLabel;
	}

	@computed
	get countryHasRegionDropdown() {
		if (!this.values.get('country')) {
			return false;
		}

		return this.values.get('country').hasRegion;
	}

	@computed
	get postalCodeRequired() {
		const country = this.values.get('country');

		if (!country) return false;

		return countryUsesZip(country.value);
	}

	@computed
	get regionsList() {
		if (!this.countryHasRegionDropdown) {
			return [];
		}

		return this.values.get('country').regions.map(r => ({
			value: r.shortCode || r.name,
			label: r.shortCode || r.name,
			name: r.name,
		}));
	}

	getInputValue(name) {
		return this.values.get(name) || '';
	}

	validateCardNumber = () => {
		const cleanValue = unFormatNumber(this.getInputValue('cardNumber'));
		return ccNumberValidator.isValid(cleanValue);
	};

	validateCVV = () => {
		/** @type {string} */
		const cleanValue = unFormatNumber(this.getInputValue('cvv'));
		return cleanValue.match(/^\d{3,4}$/);
	};

	validateExpiration = () => {
		/** @type {string} */
		const cleanValue = unFormatNumber(this.getInputValue('expiration'));
		if (!cleanValue.match(/^(\d{4}|\d{6})$/)) {
			return false;
		}

		// Check if expiration date is passed
		const month = cleanValue.substr(0, 2);
		let year = cleanValue.substr(2);

		if (year.length === 2) {
			year = `20${year}`;
		}

		const date = moment(`${year}-${month}-01`);

		return moment().isSameOrBefore(date, 'month');
	};

	validateRegion = () => {
		if (!this.countryHasRegionDropdown) {
			return true;
		}

		if (!this.values.has('region')) {
			return false;
		}

		const selectedRegion = this.regionsList.find(r => r.value === this.values.get('region'));
		const validRegions = this.values.get('country').regions;

		if (!selectedRegion) {
			return false;
		}

		return validRegions.findIndex(r => r.name === selectedRegion.name) >= 0;
	};

	handleBack = () => {
		if (this.view === VIEWS.CARD) {
			if (this.props.onGoBack) {
				this.props.onGoBack();
			}
		} else {
			this.view = VIEWS.CARD;
		}
	};

	handleInputChange = event => {
		const name = event.target.name;
		this.values.set(name, event.target.value);
	};

	handleSelectChange = (value, action) => {
		this.values.set(action.name, value);
	};

	handleInputBlur = event => {
		const ref = this.formRefs[event.target.name];

		if (ref) {
			ref.isValid();
		}
	};

	handleSelectBlur = name => () => {
		const ref = this.formRefs[name];

		if (ref) {
			ref.isValid();
		}
	};

	validateFields() {
		return Object.values(this.formRefs).every(ref => !ref || ref.isValid());
	}

	handleSubmitCard = event => {
		event.preventDefault();
		if (this.validateFields()) {
			this.view = VIEWS.ADDRESS;
		}
	};

	handleSubmitAddress = event => {
		event.preventDefault();
		if (this.validateFields() && this.props.onSubmit) {
			// We do a rough cleanup of the values
			const valueNames = [
				'expiration',
				'cardNumber',
				'cvv',
				'fullName',
				'address1',
				'address2',
				'city',
				'zipPostalCode',
				'region',
			];
			const cleanValues = {};
			valueNames.forEach(name => {
				cleanValues[name] = this.values.has(name) ? this.values.get(name).trim() : '';
			});

			const expirationDate = unFormatNumber(cleanValues.expiration);
			const expirationYear = expirationDate.slice(2);
			const cardData = {
				number: unFormatNumber(cleanValues.cardNumber),
				expirationMonth: expirationDate.slice(0, 2),
				expirationYear: (expirationYear.length === 2 ? '20' : '') + expirationYear,
				cvv: cleanValues.cvv,
			};

			const fullNameParts = cleanValues.fullName.split(' ');
			const region = this.values.has('region') ? this.values.get('region') : '';
			const country = this.values.has('country') ? this.values.get('country').value : '';
			const addressData = {
				firstName: fullNameParts[0].trim(),
				lastName: fullNameParts
					.splice(1)
					.join(' ')
					.trim(),
				address1: cleanValues.address1,
				address2: cleanValues.address2,
				city: cleanValues.city,
				zipPostalCode: cleanValues.zipPostalCode,
				country,
				region,
			};

			this.props.onSubmit(cardData, addressData);
		}
	};

	renderRegionSelect() {
		let input = null;
		let required = false;

		if (this.countryHasRegionDropdown) {
			required = true;
			const value = this.regionsList.find(r => r.value === this.getInputValue('region'));
			input = (
				<Select
					value={value}
					options={this.regionsList}
					name="region"
					isSearchable
					placeholder={this.regionShortLabel}
					onChange={(val, action) => {
						this.handleSelectChange(val.value, action);
					}}
					onBlur={this.handleSelectBlur('region')}
					className="select-react__container select-react--narrow"
					classNamePrefix="select-react"
				/>
			);
		} else {
			input = (
				<input
					name="region"
					value={this.getInputValue('region')}
					type="text"
					placeholder={this.regionShortLabel}
					onChange={this.handleInputChange}
					onBlur={this.handleInputBlur}
				/>
			);
		}

		return (
			<div className="sendTokensModal__field col-xs-6">
				<div className="sendTokensModal__label sendTokensModal__label--nowrap">
					{this.regionShortLabel}
					{required ? null : <span className="sendTokensModal__labelOptional"> (optional)</span>}
				</div>
				<Input
					name="region"
					value={this.getInputValue('region')}
					required={required}
					formErrors={this.formErrors}
					validCondition={this.validateRegion}
					ref={r => {
						this.formRefs.region = r;
					}}
					emptyError="Required"
					error="Invalid"
				>
					{input}
				</Input>
			</div>
		);
	}

	renderCardForm() {
		return (
			<Fragment>
				<div className="sendTokensModal__header">
					<div className="sendTokensModal__title">Add your card</div>
				</div>
				<form key="card-form" onSubmit={this.handleSubmitCard}>
					<div className="sendTokensModal__field">
						<div className="sendTokensModal__label">Name on card</div>
						<div>
							<Input
								name="fullName"
								value={this.getInputValue('fullName')}
								required
								emptyError="Type your full name"
								formErrors={this.formErrors}
								ref={r => {
									this.formRefs.fullName = r;
								}}
							>
								<input
									name="fullName"
									value={this.getInputValue('fullName')}
									type="text"
									placeholder="Full name"
									onChange={this.handleInputChange}
									onBlur={this.handleInputBlur}
								/>
							</Input>
						</div>
					</div>
					<div className="sendTokensModal__field">
						<div className="sendTokensModal__label">Card number</div>
						<div>
							<Input
								name="cardNumber"
								value={this.getInputValue('cardNumber')}
								required
								emptyError="Type your card number"
								error="Invalid card number"
								formErrors={this.formErrors}
								validCondition={this.validateCardNumber}
								ref={r => {
									this.formRefs.cardNumber = r;
								}}
							>
								<Cleave
									name="cardNumber"
									options={{ creditCard: true }}
									value={this.getInputValue('cardNumber')}
									type="text"
									placeholder="XXXX XXXX XXXX XXXX"
									onChange={this.handleInputChange}
									onBlur={this.handleInputBlur}
								/>
							</Input>
						</div>
					</div>
					<div className="grid">
						<div className="row">
							<div className="col-xs-4">
								<div className="sendTokensModal__field">
									<div className="sendTokensModal__label">Expiration</div>
									<div>
										<Input
											name="expiration"
											value={this.getInputValue('expiration')}
											required
											emptyError="Required"
											error="Invalid"
											formErrors={this.formErrors}
											validCondition={this.validateExpiration}
											ref={r => {
												this.formRefs.expiration = r;
											}}
										>
											<Cleave
												name="expiration"
												options={{ date: true, datePattern: ['m', 'Y'], delimiter: ' / ' }}
												value={this.getInputValue('expiration')}
												type="text"
												placeholder="MM / YYYY"
												onChange={this.handleInputChange}
												onBlur={this.handleInputBlur}
											/>
										</Input>
									</div>
								</div>
							</div>
							<div className="col-xs-4">
								<div className="sendTokensModal__field">
									<div className="sendTokensModal__label sendTokensModal__label--info">
										CVV
										<span data-tip={CVV_MESSAGE} data-html data-for="tooltip-buy-tokens-cvv-info">
											<Icon icon="question-circle" />
										</span>
										<ReactTooltip
											id="tooltip-buy-tokens-cvv-info"
											className="tooltip tooltip--light"
											place="top"
											effect="solid"
										/>
									</div>
									<div>
										<Input
											name="cvv"
											value={this.getInputValue('cvv')}
											required
											emptyError="Required"
											formErrors={this.formErrors}
											validCondition={this.validateCVV}
											ref={r => {
												this.formRefs.cvv = r;
											}}
										>
											<Cleave
												name="cvv"
												options={{ numericOnly: true }}
												value={this.getInputValue('cvv')}
												type="text"
												placeholder="123"
												onChange={this.handleInputChange}
												onBlur={this.handleInputBlur}
											/>
										</Input>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="sendTokensModal__field">
						<div className="sendTokensModal__paymentMethods">
							<div className="sendTokensModal__paymentMethod">
								<PaymentMethodIcon icon="mastercard" />
							</div>
							<div className="sendTokensModal__paymentMethod">
								<PaymentMethodIcon icon="visa" />
							</div>
							<div className="sendTokensModal__paymentMethod">
								<PaymentMethodIcon icon="americanExpress" />
							</div>
							<div className="sendTokensModal__encription">
								<div className="sendTokensModal__encription-icon">
									<Icon icon="lock-full" />
									<div className="sendTokensModal__encription-overlay">128</div>
								</div>
								<p className="sendTokensModal__encription-text">SSL Encrypted</p>
							</div>
						</div>
					</div>
					<div className="sendTokensModal__actions">
						<button className="btn btn--main btn--wide" type="submit">
							Continue
						</button>
						<button className="btn btn--transparent btn--wide" onClick={this.handleBack} type="button">
							Back
						</button>
					</div>
				</form>
			</Fragment>
		);
	}

	renderAddressForm() {
		return (
			<Fragment>
				<div className="sendTokensModal__header">
					<div className="sendTokensModal__title">Add your card</div>
					<div className="sendTokensModal__subTitle">Please fill in the billing information for your credit card</div>
				</div>
				<form key="address-form" onSubmit={this.handleSubmitAddress}>
					<div className="sendTokensModal__field">
						<div className="sendTokensModal__label">Country</div>
						<Input
							name="country"
							value={this.getInputValue('country')}
							required
							formErrors={this.formErrors}
							ref={r => {
								this.formRefs.country = r;
							}}
							emptyError="Choose your country"
						>
							<Select
								value={this.getInputValue('country')}
								options={countryList}
								name="country"
								isSearchable
								placeholder="Country"
								onChange={this.handleSelectChange}
								onBlur={this.handleSelectBlur('country')}
								className="select-react__container"
								classNamePrefix="select-react"
							/>
						</Input>
					</div>
					<div className="sendTokensModal__field">
						<div className="sendTokensModal__label">Address line 1</div>
						<Input
							name="address1"
							value={this.getInputValue('address1')}
							required
							emptyError="Type address"
							formErrors={this.formErrors}
							ref={r => {
								this.formRefs.address1 = r;
							}}
						>
							<input
								name="address1"
								value={this.getInputValue('address1')}
								type="text"
								placeholder="Address Line 1"
								onChange={this.handleInputChange}
								onBlur={this.handleInputBlur}
							/>
						</Input>
					</div>
					<div className="sendTokensModal__field">
						<div className="sendTokensModal__label">Address line 2</div>
						<Input
							name="address2"
							value={this.getInputValue('address2')}
							emptyError="Type address"
							formErrors={this.formErrors}
							ref={r => {
								this.formRefs.address2 = r;
							}}
						>
							<input
								name="address2"
								value={this.getInputValue('address2')}
								type="text"
								placeholder="Address Line 2"
								onChange={this.handleInputChange}
								onBlur={this.handleInputBlur}
							/>
						</Input>
					</div>
					<div className="grid">
						<div className="row">
							<div className="sendTokensModal__field col-xs-6">
								<div className="sendTokensModal__label">City</div>
								<Input
									name="city"
									value={this.getInputValue('city')}
									required
									emptyError="Required"
									formErrors={this.formErrors}
									ref={r => {
										this.formRefs.city = r;
									}}
								>
									<input
										name="city"
										value={this.getInputValue('city')}
										type="text"
										placeholder="City"
										onChange={this.handleInputChange}
										onBlur={this.handleInputBlur}
									/>
								</Input>
							</div>
							{this.renderRegionSelect()}
						</div>
					</div>
					<div className="grid">
						<div className="row">
							<div className="sendTokensModal__field col-xs-6">
								<div className="sendTokensModal__label sendTokensModal__label--nowrap">{this.postalCodeLabel}</div>
								<Input
									name="zipPostalCode"
									value={this.getInputValue('zipPostalCode')}
									required={this.postalCodeRequired}
									emptyError="Required"
									formErrors={this.formErrors}
									ref={r => {
										this.formRefs.zipPostalCode = r;
									}}
								>
									<input
										name="zipPostalCode"
										value={this.getInputValue('zipPostalCode')}
										type="text"
										placeholder={this.postalCodeLabel}
										onChange={this.handleInputChange}
										onBlur={this.handleInputBlur}
									/>
								</Input>
							</div>
						</div>
					</div>
					<div className="sendTokensModal__actions">
						<button className="btn btn--main btn--wide" type="submit">
							Continue
						</button>
						<button className="btn btn--transparent btn--wide" onClick={this.handleBack} type="button">
							Back
						</button>
					</div>
				</form>
			</Fragment>
		);
	}

	render() {
		if (this.view === VIEWS.CARD) {
			return this.renderCardForm();
		}

		return this.renderAddressForm();
	}
}

export default AddPaymentMethod;
