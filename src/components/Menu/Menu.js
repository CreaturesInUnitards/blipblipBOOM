/***********************************
*
* Menu
*
***********************************/
var State = require('../../model/State')
require("./Menu.sass")

module.exports = {
	view: function (vnode) {
		return m('menu'
			, vnode.attrs.collection.map(function (obj, idx) {
				return m('.menu-item'
					, { onclick: vnode.attrs.onclick.bind(null, idx) }
					, vnode.attrs.screenName(obj)
				)
			})
		)
	}
}
