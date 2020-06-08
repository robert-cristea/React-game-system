import sample from 'lodash/sample';
import random from 'lodash/random';
import moment from 'moment';
import MockObject from './MockObject';
import ConversationHistory from './ConversationHistory';

let counter = 0;

/**
 * Sample chats. Each chat consist of an array of messages. Messages in the same array are said one
 * after the other by the same user.
 * @type {string[][][]}
 */
const sampleChats = [
	[
		[
			'Hey, how are you doing?',
			'Don’t want to bug you if you’re not there, but was wondering if you were available to play some games later tonight.',
		],
		[
			'Hey man. sorry just busy right now. would love to join you on some adventure! Let me know what time works for you and we’ll set it up!!',
		],
		[
			'Don’t want to bug you if you’re not there, but was wondering if you were available to play some games later tonight.',
		],
	],
	[
		['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'In eu lectus quam?'],
		['Duis pellentesque erat a metus mattis rhoncus.'],
		['Suspendisse lacinia nulla et posuere mollis.', 'Aliquam erat volutpat.', 'Vestibulum sed ullamcorper dui.'],
		['Etiam tincidunt sed nulla pretium varius.'],
	],
];

function randomHistory(currentUser, users, conversationId) {
	const chat = sample(sampleChats);
	const history = new ConversationHistory();
	const allUsers = [currentUser, ...users];
	let lastDate = moment()
		.subtract(random(0, 3), 'days')
		.subtract(random(0, 3), 'hours')
		.subtract(random(0, 3), 'minutes');
	let lastUser = null;

	chat.forEach(messages => {
		let user;
		do {
			user = sample(allUsers);
		} while (user === lastUser);

		messages.forEach(messageText => {
			lastDate = lastDate.add(random(15, 150), 'seconds');
			history.entries.push(
				new MockObject({
					id: `${conversationId}_${counter}`,
					datetime: lastDate,
					user,
					type: 'message',
					data: new MockObject({
						content: messageText,
					}),
				}),
			);

			counter += 1;
		});

		lastUser = user;
	});

	return history;
}

export default randomHistory;
