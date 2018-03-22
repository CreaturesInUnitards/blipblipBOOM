/***********************************
*
* Welcome
*
***********************************/
const VH = require('../../view_helpers')
const SiteLogo = require('../SiteLogo/SiteLogo')

module.exports = {
	view: () => m(VH.fadeInOutComponent,
		{
			oninit: () => {
				if (localStorage.getItem('menuOpen') === null) {
					setTimeout(() => {
						State.toggleMenu()
						m.redraw()
					}, 2000)
				}
			},
			fadein: true
		}, 
		m('#welcome'
			, m(SiteLogo, { size: '7vw' })
		)
	)
}
