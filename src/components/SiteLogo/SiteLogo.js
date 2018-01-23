require('./SiteLogo.sass')

module.exports = {
	view: (vnode) => {
		return m('.site-logo'
			, { style: { fontSize: vnode.attrs.size || '1em' } }
			, m('i', 'm') 
			, '('
			, m('i'
				, ' Mithril { 0-60 } ')
			, ')'
		)
	}
}