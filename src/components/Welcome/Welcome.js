/***********************************
*
* Welcome
*
***********************************/
const VH = require('../../view_helpers')
const SiteLogo = require('../SiteLogo/SiteLogo')

module.exports = VH.fadeInOutComponent({
	oncreate: () => {
		if (localStorage.getItem('menuOpen') === null) {
			setTimeout(() => {
				State.toggleMenu()
				m.redraw()
			}, 2000)
		}
	},
	view: () => {
		return m('#welcome'
			, m(SiteLogo, { size: '7vw' })
		)
	}
})
