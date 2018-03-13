/***********************************
*
* Lecture
*
***********************************/
const Welcome = require('../Welcome/Welcome')
const LoadingAnimation = require('../LoadingAnimation/LoadingAnimation')

module.exports = {
	view: function () {
		const isWelcomeScreen = State.currentChapterIndex === 0
		const canPlay = State.canPlay
		
		return m('.screen.theater.animator'
			, !(isWelcomeScreen || canPlay) && m(LoadingAnimation)
			, isWelcomeScreen
				? m(Welcome)
				: canPlay && m('#videoContainer')
		)
	}
}
