/***********************************
*
* App
*
***********************************/
const Menu = require('../Menu/Menu')
const Lecture = require('../Lecture/Lecture')
const Lab = require('../Lab/Lab')
require("../../globals.sass")

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
				m('main',
					m(Lab),
					m(Lecture)
				),
				m(Menu),
			]
		}
	}
}
