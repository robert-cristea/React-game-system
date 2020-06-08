import { observable } from 'mobx';
import MockObject from './MockObject';

/**
 * Simple wrapper around MockObject that also has an observable isFavourite
 */
class Conversation extends MockObject {
	@observable
	isFavourite = false;
}

export default Conversation;
