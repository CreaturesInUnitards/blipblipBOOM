/***********************************
*
* Lecture
*
***********************************/
const Welcome = require('../Welcome/Welcome')
const LoadingAnimation = require('../LoadingAnimation/LoadingAnimation')
const VH = require('../../view_helpers')

const toggleUrl = () => {
	const { courseID, chapter, flem } = State.path
	const screen = State.path.screen == 'video' ? 'sandbox' : 'video'

	return `/${courseID}/${chapter}/${screen}/${flem}`
}

module.exports = {
	view: function () {
		const isWelcomeScreen = m.route.param('chapter') === 0
		const canPlay = State.canPlay
		
		return m('#lecture.full-main.flex.jc.ac.bg-dark'
			, isWelcomeScreen
				? m(Welcome)
				: canPlay && m('#videoContainer')
			, !(isWelcomeScreen || canPlay) && m(VH.fadeInOutComponent, { fadein: true }, m(LoadingAnimation))
			, m('a.absolute.flex.jc.ac.w100pct.h40.slider', {
				class: State.sandboxOpen ? 'top-full' : '' ,
				href: toggleUrl(),
				oncreate: m.route.link,
				onupdate: m.route.link
			})
		)
	}
}