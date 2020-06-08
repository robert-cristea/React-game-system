import PaymentMethod from './PaymentMethod';

/**
 * Represents a credit card payment method.
 *
 * @property {string} last4
 * @property {CreditCardToken} token Only if it's a new card, a token returned by Paymentwall
 * @property {StreetAddress} billingAddress Only if it's a new card
 */
class CreditCard extends PaymentMethod {}

/**
 * @typedef {{
 *     firstName: string,
 *     lastName: string,
 *     country: string,
 *     address1: string,
 *     address2: string,
 *     city: string,
 *     zipPostalCode: string,
 *     region: string,
 * }} StreetAddress
 */

export default CreditCard;
