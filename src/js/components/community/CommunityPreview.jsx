/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import MockObject from '../../mock/MockObject';

const propTypes = {
	community: PropTypes.instanceOf(MockObject).isRequired,
	tags: PropTypes.arrayOf(PropTypes.string),
	onClick: PropTypes.func,
};

const defaultProps = {
	onClick: null,
	tags: [],
};

function CommunityPreview({ community, ...props }) {
	const tags = props.tags.map((tag, index) => (
		<div className="btn communityPreview__tag" key={index}>
			{tag}
		</div>
	));

	return (
		<div className="col-xs-6">
			<div className="communityPreview__item" onClick={props.onClick}>
				<div className="communityPreview__image">
					<img src={community.medias.cover} alt={community.name} />
				</div>
				<div className="communityPreview__info">
					<h3 className="communityPreview__title">{community.name}</h3>
					<div className="communityPreview__tags">{tags}</div>
					<p className="communityPreview__count">{numeral(community.nbMembers).format('0,0')} Members</p>
				</div>
			</div>
		</div>
	);
}

CommunityPreview.propTypes = propTypes;
CommunityPreview.defaultProps = defaultProps;

export default CommunityPreview;
