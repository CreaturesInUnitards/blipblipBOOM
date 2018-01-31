/***********************************
*
* Lecture
*
***********************************/
const Welcome = require('../Welcome/Welcome')
const LoadingAnimation = require('../LoadingAnimation/LoadingAnimation')

const toggleUrl = () => {
	const cidx = State.currentChapterIndex
	const view = State.labOpen ? 'content' : 'lab'
	const fidx = State.currentFlemIndex
	
	return `/${cidx}/${view}/${view === 'lab' && fidx > 0 ? fidx : ''}`
}

module.exports = {
	view: function () {
		const isWelcomeScreen = State.currentChapterIndex === 0
		const canPlay = State.canPlay
		
		return m('section.lecture'
			, !(isWelcomeScreen || canPlay) && m(LoadingAnimation)
			, isWelcomeScreen
				? m(Welcome)
				: canPlay && m('#videoContainer')
			, m('a.expander.show-lab'
				, {
					href: toggleUrl(),
					oncreate: m.route.link,
					onupdate: m.route.link
				}
			)
		)
	}
}
