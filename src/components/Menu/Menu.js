/***********************************
*
* Menu
*
***********************************/
require("./Menu.sass")

module.exports = {
	view: function (vnode) {
		return m('menu', vnode.attrs.text)
	}
}
