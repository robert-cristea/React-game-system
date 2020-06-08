/* eslint-disable no-plusplus */
import { observable } from 'mobx';
import moment from 'moment/moment';
import users from './sampleUsers';
import Conversation from './Conversation';
import currentUser from './currentUser';
import randomConversationHistory from './randomConversationHistory';
import MockObject from './MockObject';
import ConversationHistory from './ConversationHistory';

const conversations = [
	{ users: [users[0]] },
	{ users: [users[1]] },
	{ users: [users[0], users[1], users[2], users[3]], title: 'L4t3 CH4T' },
	{ users: [users[2]] },
	{ users: [users[3]] },
	{ users: [users[4]] },
	{ users: [users[5]] },
	{ users: [users[6]] },
];

let counter = 0;

const conversationsInstances = observable(
	conversations.map(conversationData => {
		const id = `${counter}`;
		const data = {
			...conversationData,
			id,
			history: randomConversationHistory(currentUser, conversationData.users, id),
		};

		counter += 1;

		return new Conversation(data);
	}),
);

export default conversationsInstances;

export function getConversationById(id) {
	return conversationsInstances.find(c => c.id === id);
}

export function getConversationWith(user) {
	return conversationsInstances.find(c => c.users.length === 1 && c.users[0] === user);
}

export function pushMessage(content, history) {
	const datetime = moment();

	history.entries.push(
		new MockObject({
			id: `${counter++}_${datetime.valueOf()}`,
			datetime,
			user: currentUser,
			type: 'message',
			data: new MockObject({
				content,
			}),
		}),
	);
}

export function generateConversationWith(user, preFill = true) {
	const id = `${counter++}`;
	const history = preFill ? randomConversationHistory(currentUser, [user], id) : new ConversationHistory();
	const data = {
		users: [user],
		id,
		history,
	};

	const conversation = new Conversation(data);

	conversationsInstances.unshift(conversation);

	return conversation;
}

export function getConversationWithOrCreate(user, fill = true) {
	let conversation = getConversationWith(user);

	if (!conversation) {
		conversation = generateConversationWith(user, fill);
	}

	return conversation;
}
