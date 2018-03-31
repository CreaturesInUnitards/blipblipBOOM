/***********************************
*
* App
*
***********************************/
const Menu = require('../Menu/Menu')
const Lecture = require('../Lecture/Lecture')
const Lab = require('../Lab/Lab')
const LoadingAnimation = require('../LoadingAnimation/LoadingAnimation')

module.exports = () => {
	// set menu open/closed and sandbox open/closed
	const bodyClass = _v => {
		document.body.className = `menu-${State.menuOpen ? 'open' : 'closed'} sandbox-${m.route.param('screen') == 'sandbox' ? 'open' : 'closed'}`
	}

	return {
		oncreate: bodyClass,
		onupdate: bodyClass,
		view(){
			return State.courses && State.chapters
				? [
					m('main',
						m(Lab),
						m(Lecture)
					),
					m(Menu), 
					m('img#logo.pointer[src=../../images/blipLogo.svg][title=blipblipBOOM.com]', {
						onclick: _e => { m.route.set('/') }
					})
				]
				: m(LoadingAnimation)
		}
	}
}
