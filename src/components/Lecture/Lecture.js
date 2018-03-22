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
		const isWelcomeScreen = State.currentChapterIndex === 0
		const canPlay = State.canPlay
		
		return m('.screen.theater.animator'
			, isWelcomeScreen
				? m(Welcome)
				: canPlay && m('#videoContainer')
			, !(isWelcomeScreen || canPlay) && m(VH.fadeInOutComponent, { fadein: true }, m(LoadingAnimation))
		)
	}
}