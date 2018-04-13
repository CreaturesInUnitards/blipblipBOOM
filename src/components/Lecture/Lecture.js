/***********************************
*
* Lecture
*
***********************************/
const LoadingAnimation = require('../LoadingAnimation/LoadingAnimation')
const VH = require('../../view_helpers')

module.exports = {
	view: () => 
		m('#lecture.full-main.flex.jc.ac.bg-dark'
			, State.canPlay 
				? m('#videoContainer')
				: m(VH.fadeInOutComponent, { fadein: true }, m(LoadingAnimation))
			, m('a.absolute.flex.jc.ac.w100pct.h40.slider', {
				href: State.toggleUrl(),
				oncreate: m.route.link,
				onupdate: m.route.link
			})
		)
}