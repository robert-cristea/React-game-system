import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import Loading from './Loading';
import Icon from './icons/Icon';
import { formatToken, formatCurrency } from '../app/utils';

const propTypes = {
	tokenBalance: PropTypes.instanceOf(BigNumber),
	loading: PropTypes.bool,
	showAdd: PropTypes.bool,
	onAddTokens: PropTypes.func,
};
const defaultProps = {
	tokenBalance: null,
	loading: false,
	showAdd: false,
	onAddTokens: null,
};

function TokensBalance(props) {
	return (
		<div className="tokenBalance">
			{props.loading ? (
				<div className="tokenBalance__loading">
					<Loading />
				</div>
			) : (
				<Fragment>
					<div className="tokenBalance__wrap">
						<Icon icon="logo" />
						<div className="tokenBalance__amount">
							<div className="tokenBalance__amount-token">{formatToken(props.tokenBalance)}</div>
							<div className="tokenBalance__amount-currency">{formatCurrency(props.tokenBalance)}</div>
						</div>
					</div>
					{props.showAdd && (
						<button className="btn btn--main btn--small tokenBalance__button" onClick={props.onAddTokens}>
							ADD
						</button>
					)}
				</Fragment>
			)}
		</div>
	);
}

TokensBalance.propTypes = propTypes;
TokensBalance.defaultProps = defaultProps;

export default TokensBalance;
