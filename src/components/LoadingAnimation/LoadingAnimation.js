/***********************************
*
* LoadingAnimation
*
***********************************/
require("./LoadingAnimation.sass")

module.exports = {
	onbeforeremove: () => {
		return new Promise((resolve) => {
			setTimeout(resolve, 1000)
		})
	},
	view: () => {
		return m('.spinner'
			, m('.bounce1')
			, m('.bounce2')
			, m('.bounce3')
		)
	}
}
