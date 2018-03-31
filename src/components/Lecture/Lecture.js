/***********************************
*
* Lecture
*
***********************************/
const Welcome = require('../Welcome/Welcome')
const LoadingAnimation = require('../LoadingAnimation/LoadingAnimation')
const VH = require('../../view_helpers')

module.exports = {
	view: function () {
		const isWelcomeScreen = State.path.chapter === 0
		const canPlay = State.canPlay
		
		return m('#lecture.full-main.flex.jc.ac.bg-dark'
			, isWelcomeScreen
				? m(Welcome)
				: canPlay && m('#videoContainer')
			, !(isWelcomeScreen || canPlay) && m(VH.fadeInOutComponent, { fadein: true }, m(LoadingAnimation))
			, m('a.absolute.flex.jc.ac.w100pct.h40.slider', {
				href: State.toggleUrl(),
				oncreate: m.route.link,
				onupdate: m.route.link
			})
		)
	}
}