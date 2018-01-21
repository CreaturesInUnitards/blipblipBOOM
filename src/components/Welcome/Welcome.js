/***********************************
*
* Welcome
*
***********************************/
const VH = require('../../view_helpers')

module.exports = VH.fadeInOutComponent({
	view: () => {
		return m('#welcome'
			, m('.logo', m('i', 'm') , '(', m('i', ' Mithril { 0-60 } '), ')')
		)
	}
})
