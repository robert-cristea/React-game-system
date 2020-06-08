import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

const isDescendant = (parent, child) => {
	let node = child.parentNode;

	while (node !== null) {
		if (node === parent) {
			return true;
		}

		node = node.parentNode;
	}

	return false;
};

const EMOJIS = [
	'😘',
	'☺',
	'😗',
	'😄',
	'😝',
	'👻',
	'🙈',
	'🙉',
	'🙊',
	'👶',
	'👦',
	'👧',
	'🙆',
	'💁',
	'👰',
	'👼',
	'👯',
	'🛀',
	'🏄',
	'🚴',
	'💪',
	'💏',
	'👭',
	'✌',
	'👍',
	'👊',
	'🙏',
	'👅',
	'👄',
	'💋',
	'💞',
	'💥',
	'💦',
	'💨',
	'👙',
	'👑',
	'💍',
	'💎',
	'🐼',
	'🐰',
	'🐘',
	'🐬',
	'🐟',
	'🌻',
	'🍟',
	'🍕',
	'🎂',
	'🍰',
	'🍫',
	'🍬',
	'🍭',
	'☕',
	'🍷',
	'🍸',
	'🍹',
	'🍺',
	'🍻',
	'🌏',
	'🌋',
	'🗼',
	'🗽',
	'⛺',
	'🌃',
	'🌆',
	'🌉',
	'🚗',
	'🚚',
	'⛽',
	'🚢',
	'🚀',
	'🚽',
	'🌛',
	'🌚',
	'🌟',
	'🌞',
	'🌂',
	'☔',
	'⛄',
	'🔥',
	'⚡',
	'🎆',
	'🎇',
	'✨',
	'🎈',
	'🎉',
	'🎊',
	'🎋',
	'🎍',
	'🎏',
	'🎀',
	'🎁',
	'🏆',
	'⚽',
	'🏀',
	'🏈',
	'🎲',
	'🎮',
	'🎱',
	'📢',
	'🔊',
	'🔇',
	'🔔',
	'🔕',
	'🎵',
	'🎤',
	'🎧',
	'🎷',
	'📱',
	'🔌',
	'🎥',
	'📷',
	'📺',
	'🔎',
	'💡',
	'🔦',
	'📕',
	'📚',
	'💰',
	'💵',
];

@observer
class ReactionSelector extends ReactComponent {
	static propTypes = {
		className: PropTypes.string,
		onSelect: PropTypes.func,
		autoHideOnOutsideClick: PropTypes.bool,
	};

	static defaultProps = {
		className: '',
		onSelect: null,
		autoHideOnOutsideClick: false,
	};

	static RIGHT_TOP = 'rt';
	static LEFT_TOP = 'lt';
	static LEFT_BOTTOM = 'lb';

	documentListener = null;
	elementRefs = {};

	@observable
	visible = false;
	@observable
	x = 0;
	@observable
	y = 0;
	@observable
	position = false;

	componentWillMount() {
		this.listenToDocumentClick();
	}

	componentWillUnmount() {
		this.stopListenToDocumentClick();
	}

	listenToDocumentClick() {
		this.documentListener = document.addEventListener(
			'click',
			event => {
				if (this.props.autoHideOnOutsideClick) {
					const target = event.target;
					if (target !== this.elementRefs.container && !isDescendant(this.elementRefs.container, target)) {
						this.hide();
					}
				}
			},
			{ capture: true },
		);
	}

	stopListenToDocumentClick() {
		if (this.documentListener) {
			document.removeEventListener(this.documentListener);
			this.documentListener = null;
		}
	}

	show([x, y], position) {
		this.x = x;
		this.y = y;
		this.position = position;
		this.visible = true;

		window.requestAnimationFrame(() => {
			this.elementRefs.scrollable.scrollTop = 0;
		});
	}

	hide() {
		this.visible = false;
	}

	isVisible() {
		return this.visible;
	}

	handleEmojiClicked = event => {
		const element = event.target;
		const text = element.innerText || element.textContent;

		if (this.props.onSelect) {
			this.props.onSelect(text);
		}
	};

	renderEmojis() {
		const emojiComponents = EMOJIS.map(emoji => (
			<span key={emoji} className="reactionSelector__emoji" onClick={this.handleEmojiClicked}>
				{emoji}
			</span>
		));
		return (
			<div
				className="reactionSelector__emojis"
				ref={ref => {
					this.elementRefs.scrollable = ref;
				}}
			>
				{emojiComponents}
			</div>
		);
	}

	render() {
		const classes = [
			'reactionSelector',
			this.visible ? 'reactionSelector--visible' : 'reactionSelector--hidden',
			`reactionSelector--${this.position}`,
			this.props.className,
		];

		return (
			<div
				ref={ref => {
					this.elementRefs.container = ref;
				}}
				className={classes.join(' ')}
				style={{ top: this.y, left: this.x }}
			>
				<div className="reactionSelector__content">{this.renderEmojis()}</div>
			</div>
		);
	}
}

export default ReactionSelector;
