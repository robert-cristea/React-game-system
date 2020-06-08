import { observable } from 'mobx';
import MockObject from './MockObject';

/**
 * Class that represents a conversation history object. It extends MockObject but its `entries` array is observable
 */
class ConversationHistory extends MockObject {
	@observable
	entries = [];
}

export default ConversationHistory;
