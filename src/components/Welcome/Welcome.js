/***********************************
*
* Welcome
*
***********************************/
const VH = require('../../view_helpers')
const SiteLogo = require('../SiteLogo/SiteLogo')

module.exports = VH.fadeInOutComponent({
	view: () => {
		return m('#welcome'
			, m(SiteLogo, { size: '8vw' })
		)
	}
})
