import React from 'react';
import Avatar from '../../../appBar/Avatar';
import sampleUsers from '../../../../mock/sampleUsers';
import Icon from '../../../icons/Icon';

const propTypes = {};
const defaultProps = {};

function Activity() {
	return (
		<div className="activity">
			<div className="activity__header">
				<Icon icon="activity" />
				<h1 className="activity__title">LATEST ACTIVITY</h1>
			</div>

			<div className="activity__card">
				<div className="activity__card-wrap">
					<img
						className="activity__card-image"
						src="https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fallout-4/cover.jpg"
						alt="Fallout 4"
					/>
					<div className="activity__card-info">
						<div className="activity__card-title">Played Fallout 4</div>
						<p className="activity__card-text">23 min ago</p>
					</div>
				</div>
				<div className="activity__image">
					<img
						src="https://s3-us-west-1.amazonaws.com/turboplay-app-static-assets/mockImages/games/fallout-4/screenshot.jpg"
						alt="Fallout 4"
					/>
				</div>
			</div>

			<div className="activity__card">
				<div className="activity__card-wrap">
					<div className="activity__friends">
						{/* <Avatar user={currentUser} /> */}
						<Avatar user={sampleUsers[0]} />
					</div>
					<div className="activity__card-info">
						<div className="activity__card-title">You are friends with {sampleUsers[0].username}</div>
						<div className="activity__card-text">2 days ago</div>
					</div>
				</div>
			</div>
		</div>
	);
}

Activity.propTypes = propTypes;
Activity.defaultProps = defaultProps;

export default Activity;
