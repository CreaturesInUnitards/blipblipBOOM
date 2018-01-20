/***********************************
*
* Welcome
*
***********************************/
module.exports = {
	view: (vnode) => {
		return m('#welcome'
			, { style: { display: vnode.attrs.visible ? 'flex' : 'none'} }
			, m('.logo', m('i', 'm') , '(', m('i', ' Mithril, { 0-60 } '), ')')
		)
	}
}
