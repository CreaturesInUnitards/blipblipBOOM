/***********************************
*
* LoadingAnimation
*
***********************************/
require("./LoadingAnimation.sass")
const VH = require('../../view_helpers')

module.exports = VH.fadeInOutComponent({
	view: () => {
		return m('.spinner'
			, m('.bounce1')
			, m('.bounce2')
			, m('.bounce3')
		)
	}
}, false)
