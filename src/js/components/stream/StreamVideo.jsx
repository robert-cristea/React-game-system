import React from 'react';
import PropTypes from 'prop-types';
import { DefaultPlayer as Video } from 'react-html5video';

const propTypes = {
	src: PropTypes.string.isRequired,
};

/**
 * Check if a URL is a youtube video
 * @param {string} url
 * @typedef {Object} isYouTube
 * @property {isYoutube} boolean Whether it's a YT video
 * @property {youtubeID} string The Youtube ID
 * @returns {isYouTube} { boolean: isYoutube, String: youtubeID}
 * REGEX reference: https://ctrlq.org/code/19797-regex-youtube-id
 */
function checkYoutubeUrl(url) {
	const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	const match = url.match(regExp);
	if (match && match[7].length === 11) {
		return {
			isYoutube: true,
			youtubeID: match[7],
		};
	}
	return {
		isYoutube: false,
		youtubeID: null,
	};
}

function StreamVideo(props) {
	// eslint-disable-next-line jsx-a11y/media-has-caption
	const { isYoutube, youtubeID } = checkYoutubeUrl(props.src);
	const youtubeEmbedded = `https://www.youtube.com/embed/${youtubeID}?rel=0&amp;showinfo=0`;
	if (isYoutube) {
		return (
			<iframe
				width="100%"
				height="100%"
				title="Youtube"
				src={youtubeEmbedded}
				frameBorder="0"
				allow="autoplay; encrypted-media"
				allowFullScreen
			/>
		);
	}
	return (
		<Video
			className="stream__video"
			poster="https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/blank.png"
			controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
			preload="metadata"
		>
			<source src={props.src} type="video/mp4" />
		</Video>
	);
}

StreamVideo.propTypes = propTypes;

export default StreamVideo;
