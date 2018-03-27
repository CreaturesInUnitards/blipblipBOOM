/***********************************
*
* Lecture
*
***********************************/
const Welcome = require('../Welcome/Welcome')
const LoadingAnimation = require('../LoadingAnimation/LoadingAnimation')
const VH = require('../../view_helpers')

const toggleUrl = () => {
	const cidx = State.currentChapterIndex
	const view = State.sandboxOpen ? 'content' : 'lab'
	const fidx = State.currentFlemIndex

	return `/${cidx}/${view}/${view === 'lab' && fidx > 0 ? fidx : ''}`
}

module.exports = {
	view: function () {
		const isWelcomeScreen = State.currentChapterIndex === 0
		const canPlay = State.canPlay
		
		return m('#lecture.full-main.flex.jc.ac.bg-white'
			, isWelcomeScreen
				? m(Welcome)
				: canPlay && m('#videoContainer')
			, !(isWelcomeScreen || canPlay) && m(VH.fadeInOutComponent, { fadein: true }, m(LoadingAnimation))
			, m('a.absolute.flex.jc.ac.w100pct.h40.bg-dark.slider', {
				class: State.sandboxOpen ? 'top-full' : '' ,
				href: toggleUrl(),
				oncreate: m.route.link,
				onupdate: m.route.link
			}, m('img[src=../../images/blipLogo.svg][title=blipblipBOOM.com]'))
		)
	}
}