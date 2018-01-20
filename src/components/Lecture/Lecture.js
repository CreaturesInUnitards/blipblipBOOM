/***********************************
*
* Lecture
*
***********************************/
const State = require('../../model/State')
const Welcome = require('../Welcome/Welcome')
const VideoContainer = require('../VideoContainer/VideoContainer')
const LoadingAnimation = require('../LoadingAnimation/LoadingAnimation')


require("./Lecture.sass")

module.exports = {
	view: function (vnode) {
		const welcome = vnode.attrs.welcomeVisible
		const canPlay = vnode.attrs.canPlay
		return m('section.lecture'
			, !(welcome || canPlay) && m(LoadingAnimation)
			, canPlay && m(VideoContainer)
			, m(Welcome, { visible: welcome })
			, m('button.expander.show-lab'
				, {
					class: State.firstRun_lab ? 'first-run' : '',
					onclick: vnode.attrs.expandFn.bind(null, 'lab')
				}
			)
		)
	}
}
