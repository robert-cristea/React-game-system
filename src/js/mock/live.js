/* eslint-disable no-plusplus */
import moment from 'moment';
import sampleGames from './sampleGames';
import MockObject from './MockObject';
import sampleUsers from './sampleUsers';
import sampleConversations from './sampleConversations';

let counter = 0;

const hosts = {
	twitch: new MockObject({
		name: 'Twitch',
		id: 'twitch',
		icon: 'twitch',
	}),
	youtube: new MockObject({
		name: 'Youtube',
		id: 'youtube',
		icon: 'youtube',
	}),
	vimeo: new MockObject({
		name: 'Vimeo',
		id: 'vimeo',
		icon: 'vimeo',
	}),
};

const streams = [
	{
		title: 'Speedrun Fallout 4 NEW MATCHES',
		user: sampleUsers[0],
		game: sampleGames[6],
		host: hosts.twitch,
		viewersTotal: 825,
		commentsTotal: 235,
		conversation: sampleConversations[0],
		knownViewers: [
			sampleUsers[0],
			sampleUsers[1],
			sampleUsers[2],
			sampleUsers[3],
			sampleUsers[4],
			sampleUsers[5],
			sampleUsers[6],
		],
	},
	{
		title: 'Speedrun Fallout 4 NEW MATCHES',
		game: sampleGames[7],
		user: sampleUsers[1],
		host: hosts.twitch,
		viewersTotal: 825,
		commentsTotal: 235,
		conversation: sampleConversations[0],
		knownViewers: [sampleUsers[1], sampleUsers[2]],
	},
	{
		title: 'Speedrun Fallout 4 NEW MATCHES',
		game: sampleGames[8],
		user: sampleUsers[2],
		host: hosts.twitch,
		viewersTotal: 825,
		commentsTotal: 235,
		conversation: sampleConversations[0],
		knownViewers: [sampleUsers[1], sampleUsers[2]],
	},
	{
		title: 'Speedrun Fallout 4 NEW MATCHES',
		game: sampleGames[4],
		user: sampleUsers[3],
		host: hosts.youtube,
		viewersTotal: 825,
		commentsTotal: 235,
		conversation: sampleConversations[0],
		knownViewers: [sampleUsers[1], sampleUsers[2]],
	},
	{
		title: 'Speedrun Fallout 4 NEW MATCHES',
		game: sampleGames[1],
		user: sampleUsers[4],
		host: hosts.youtube,
		viewersTotal: 825,
		commentsTotal: 235,
		conversation: sampleConversations[0],
		knownViewers: [sampleUsers[1], sampleUsers[2]],
	},
	{
		title: 'Speedrun Fallout 4 NEW MATCHES',
		game: sampleGames[0],
		user: sampleUsers[5],
		host: hosts.youtube,
		viewersTotal: 825,
		commentsTotal: 235,
		conversation: sampleConversations[0],
		knownViewers: [sampleUsers[1], sampleUsers[2]],
	},
	{
		title: 'Speedrun Fallout 4 NEW MATCHES',
		game: sampleGames[5],
		user: sampleUsers[6],
		host: hosts.vimeo,
		viewersTotal: 825,
		commentsTotal: 235,
		conversation: sampleConversations[0],
		knownViewers: [sampleUsers[1], sampleUsers[2]],
	},
	{
		title: 'Speedrun Fallout 4 NEW MATCHES',
		game: sampleGames[3],
		user: sampleUsers[7],
		host: hosts.vimeo,
		viewersTotal: 825,
		commentsTotal: 235,
		conversation: sampleConversations[0],
		knownViewers: [sampleUsers[1], sampleUsers[2]],
	},
	{
		title: 'Speedrun Fallout 4 NEW MATCHES',
		game: sampleGames[2],
		user: sampleUsers[8],
		host: hosts.vimeo,
		viewersTotal: 825,
		commentsTotal: 235,
		conversation: sampleConversations[0],
		knownViewers: [sampleUsers[1], sampleUsers[2]],
	},
].map(
	stream =>
		new MockObject({
			id: `${counter++}`,
			startDateTime: moment().subtract(10, 'minutes'),
			...stream,
		}),
);

const playNetwork = [streams[0], streams[1], streams[2], streams[3], streams[4], streams[5]];
const interactive = [streams[3], streams[4], streams[5]];

const byHost = [
	{
		host: hosts.twitch,
		streams: [streams[0], streams[1], streams[2]],
	},
	{
		host: hosts.youtube,
		streams: [streams[3], streams[4], streams[5]],
	},
	{
		host: hosts.vimeo,
		streams: [streams[6], streams[7], streams[8]],
	},
].map(
	stream =>
		new MockObject({
			id: `${counter++}`,
			...stream,
		}),
);

export default {
	playNetwork,
	interactive,
	byHost,
};

export function getStreamById(id) {
	return streams.find(stream => stream.id === id);
}

export function getUserStream(user) {
	return streams.find(stream => stream.user === user);
}
