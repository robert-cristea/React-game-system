import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import Icon from '../../../icons/Icon';

@observer
class Terms extends Component {
	static propTypes = {
		onAccept: PropTypes.func,
		onDismiss: PropTypes.func,
	};
	static defaultProps = {
		onAccept: null,
		onDismiss: null,
	};

	@observable
	eulaRead = false;

	handleInputChange = event => {
		this.eulaRead = event.target.checked;
	};

	handleAccept = () => {
		if (this.props.onAccept) {
			this.props.onAccept();
		}
	};

	handleDismiss = () => {
		if (this.props.onDismiss) {
			this.props.onDismiss();
		}
	};

	render() {
		return (
			<div className="welcome--terms">
				<div className="terms__content">
					<div className="terms__content-title">Terms &amp; Conditions</div>
					<div className="terms__content-text">
						{'1. YOUR AGREEMENT'}
						<br />
						{'By using this Site, you agree to be bound by, and to comply with, ' +
							'these Terms and Conditions. If you do not agree to these Terms and ' +
							'Conditions, please do not use this site.'}
						<br />
						<br />
						{'PLEASE NOTE: We reserve the right, at our sole discretion, to ' +
							'change, modify or otherwise alter these Terms and Conditions at ' +
							'any time. Unless otherwise indicated, amendments will become ' +
							'effective immediately. Please review these Terms and Conditions ' +
							'periodically. Your continued use of the Site following the posting ' +
							'of changes and/or modifications will constitute your acceptance of ' +
							'the revised Terms and Conditions and the reasonableness of these ' +
							'standards for notice of changes. For your information, this page ' +
							'was last updated as of the date at the top of these terms and ' +
							'conditions.'}
						<br />
						<br />
						{'2. PRIVACY'}
						<br />
						{'Please review our Privacy Policy, which also governs your visit to ' +
							'this Site, to understand our practices.'}
						<br />
						<br />
						{'3. LINKED SITES'}
						<br />
						{'This Site may contain links to other independent third-party Web ' +
							'sites ("Linked Sites”). These Linked Sites are provided solely as ' +
							'a convenience to our visitors. Such Linked Sites are not under our ' +
							'control, and we are not responsible for and does not endorse the ' +
							'content of such Linked Sites, including any information or materials ' +
							'contained on such Linked Sites. You will need to make your own ' +
							'independent judgment regarding your interaction with these Linked ' +
							'Sites.'}
						<br />
						<br />
						{'4. FORWARD LOOKING STATEMENTS'}
						<br />
						{'All materials reproduced on this site speak as of the original ' +
							'date of publication or filing. The fact that a document is ' +
							'available on this site does not mean that the information ' +
							'contained in such document has not been modified or superseded ' +
							'by events or by a subsequent document or filing. We have no duty ' +
							'or policy to update any information or statements contained on ' +
							'this site and, therefore, such information or statements should ' +
							'not be relied upon as being current as of the date you access ' +
							'this site.'}
						<br />
						<br />
						{'5. DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY'}
						<br />
						{'A. THIS SITE MAY CONTAIN INACCURACIES AND TYPOGRAPHICAL ERRORS. WE DOES NOT WARRANT'}
					</div>
				</div>

				<div className="terms__footer">
					<div className="terms__eula">
						<label className="checkbox" htmlFor="eula">
							<input
								type="checkbox"
								id="eula"
								name="eulaRead"
								onChange={this.handleInputChange}
								checked={this.eulaRead}
							/>
							<div className="checkbox__icon">
								<Icon icon="check" />
							</div>
							<div className="checkbox__label">I have read and agree with the End User License Agreement</div>
						</label>
					</div>

					<button
						className="terms__submit btn btn--main btn--wide"
						onClick={this.handleAccept}
						disabled={!this.eulaRead}
						type="button"
					>
						<span className="btn__label">ACCEPT</span>
					</button>

					<button className="welcome__link btn btn--link" onClick={this.handleDismiss} type="button">
						Dismiss
					</button>
				</div>
			</div>
		);
	}
}

export default Terms;
