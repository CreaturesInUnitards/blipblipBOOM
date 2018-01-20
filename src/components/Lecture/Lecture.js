/***********************************
*
* Lecture
*
***********************************/
const State = require('../../model/State')
const Welcome = require('../Welcome/Welcome')
const VideoContainer = require('../VideoContainer/VideoContainer')
const LoadingAnimation = require('../LoadingAnimation/LoadingAnimation')

module.exports = {
	view: function (vnode) {
		const welcome = vnode.attrs.welcomeVisible
		const canPlay = State.canPlay
		return m('section.lecture'
			, !(welcome || canPlay) && m(LoadingAnimation)
			, welcome
				? m(Welcome, { visible: true })
				: canPlay && m(VideoContainer)
			, m('button.expander.show-lab'
				, {
					class: State.firstRun_lab ? 'first-run' : '',
					onclick: vnode.attrs.expandFn.bind(null, 'lab')
				}
			)
		)
	}
}
