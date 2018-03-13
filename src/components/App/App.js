/***********************************
*
* App
*
***********************************/
const Menu = require('../Menu/Menu')
const Lecture = require('../Lecture/Lecture')
const Lab = require('../Lab/Lab')
require("../../globals.sass")

const toggleUrl = () => {
	const cidx = State.currentChapterIndex
	const view = State.sandboxOpen ? 'content' : 'lab'
	const fidx = State.currentFlemIndex

	return `/${cidx}/${view}/${view === 'lab' && fidx > 0 ? fidx : ''}`
}

module.exports = () => {
	const bodyClass = () => {
		document.body.className = `menu-${State.menuOpen ? 'open' : 'closed'} sandbox-${State.sandboxOpen ? 'open' : 'closed'}`
	}

	return {
		oninit: () => {
			const deeplink = window.location.search.split('/')
			let url = deeplink.slice(1).reduce((a, c) => a + c + '/', '/')
			m.route.set(url)
		},
		oncreate: bodyClass,
		onupdate: bodyClass,
		view(){
			return [
				m(Menu),
				m('main.animator',
					m(Lab),
					m(Lecture),
					m('a.slider.animator', { 
						href: toggleUrl(),
						oncreate: m.route.link,
						onupdate: m.route.link
					})
				)
			]
		}
	}
}
