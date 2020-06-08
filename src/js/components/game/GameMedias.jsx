import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { DefaultPlayer as Video } from 'react-html5video';
import Icon from '../icons/Icon';
import Game from '../../app/Game';

const mediaTypeLabels = {
	video: 'Video',
	image: 'Image',
};

const propTypes = {
	game: PropTypes.instanceOf(Game),
};

const defaultProps = {
	game: null,
};

function GameMedias(props) {
	const { game } = props;
	const medias = get(game, 'shopDetails.medias', []);

	return medias.length ? (
		<div className="gameDetails__medias">
			<div className="gameDetails__medias-header">
				<Icon icon="medias" />
				<h1 className="gameDetails__medias-title">TRAILERS &amp; MEDIA</h1>
			</div>

			{medias.map(media => (
				<div key={media.id} className={`gameDetails__media gameDetails__media--${media.type.name}`}>
					{media.type.name.toLowerCase() === 'video' && (
						<Fragment>
							<div className="gameDetails__media-content">
								{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
								<Video
									className="gameDetails__video"
									preload="metadata"
									poster={media.thumb}
									controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
								>
									<source src={media.src} type="video/mp4" />
								</Video>
							</div>
							<div className="gameDetails__media-details">
								{/* TODO: Add real data */}
								<div className="gameDetails__media-title">{game.name} Media</div>
								{/* <div className="gameDetails__media-title">{media.title}</div> */}
								{/* TODO: Add real data */}
								<div className="gameDetails__media-text">Official Trailer</div>
								<div className="gameDetails__media-type">{mediaTypeLabels[media.type.name.toLowerCase()]}</div>
							</div>
						</Fragment>
					)}

					{media.type.name.toLowerCase() === 'image' && (
						<Fragment>
							<div className="gameDetails__media-content">
								<img className="gameDetails__image" src={media.thumb} alt={media.title} />
							</div>
							<div className="gameDetails__media-details">
								{/* TODO: Add real data */}
								<div className="gameDetails__media-title">{game.name} Media</div>
								{/* <div className="gameDetails__media-title">{media.title}</div> */}
								<div className="gameDetails__media-type">{mediaTypeLabels[media.type.name.toLowerCase()]}</div>
							</div>
						</Fragment>
					)}
				</div>
			))}
		</div>
	) : null;
}

GameMedias.propTypes = propTypes;
GameMedias.defaultProps = defaultProps;

export default GameMedias;
