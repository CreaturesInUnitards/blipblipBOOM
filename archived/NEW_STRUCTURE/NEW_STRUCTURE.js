/***********************************
*
* NEW_STRUCTURE
*
***********************************/
const State = require('../../src/model/State')
const Menu = require('../../src/components/Menu/Menu')
require("./NEW_STRUCTURE.sass")

module.exports = () => {
	const bodyClass = () => {
		document.body.className = `menu-${State.menuOpen ? 'open' : 'closed'} sandbox-${State.sandboxOpen ? 'open' : 'closed'}`
	}

	return {
		oninit: () => {
			// const deeplink = window.location.search.split('/')
			// let url = deeplink.slice(1).reduce((a, c) => a + c + '/', '/')
			// m.route.set(url)
		},
		oncreate: bodyClass,
		onupdate: bodyClass,
		view(){
			return [
				m(Menu),
				m('main.animator',
					m('.screen.theater.animator'),
					m('.screen.sandbox'),
					m('button.slider.animator', { onclick: () => { State.sandboxOpen = !State.sandboxOpen } })
				)
			]
		}
	}
}
