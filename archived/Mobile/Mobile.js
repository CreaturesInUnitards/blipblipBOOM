/***********************************
*
* Mobile
*
***********************************/
const SiteLogo = require('../../src/components/SiteLogo/SiteLogo')

module.exports = {
	view: () => {
		return m('#mobile'
			, m(SiteLogo, { size: '10vw' })
			, m('h1.fw100.mt1'
				, "Let's be honest: you're not seriously gonna be typing out code on that tiny little screen. You should just "
				, m('a[href=https://vimeo.com/channels/1336947]', "watch the videos")
				,  " until you're in front of a proper device."
			)
		)

	}
}
