import moment from 'moment';
import Paymentwall from '../app/Server/Paymentwall/Paymentwall';
import CreditCardToken from '../app/ECommerce/CreditCardToken';

class MockPaymentwall extends Paymentwall {
	requestToken() {
		const cardToken = new CreditCardToken();
		cardToken.value = 'sample-token-value';
		cardToken.expirationDate = moment().add(300, 's');

		return Promise.resolve(cardToken);
	}
}

export default MockPaymentwall;
