/***********************************
*
* App
*
***********************************/
const Menu = require('../Menu/Menu')
const Lecture = require('../Lecture/Lecture')
const Lab = require('../Lab/Lab')
const Mobile = require('../Mobile/Mobile')

const classListForMain = () => {
	const classes = []
	if (State.menuOpen) classes.push('menuOpen')
	if (State.labOpen) classes.push('labOpen')
	return classes.join(' ')
}

module.exports = {
	oninit: () => {
		const deeplink = window.location.search.split('/')
		let url = deeplink.slice(1).reduce((a, c) => a + c + '/', '/')
		m.route.set(url)
	},
	view: () => {
		const mainClass = classListForMain()

		return m('main.width100vw.height100vh.ovf-hidden'
			, { class: mainClass }
			, m(Menu)
			, m('.wrapper'
				, m(Lecture)
				, m(Lab)
			)
			, m(Mobile)
		)
	}
}
