require('./SiteLogo.sass')

module.exports = {
	view: (vnode) => {
		return m('.site-logo'
			, { 
				style: { 
					fontSize: vnode.attrs.size || '1em',
					textAlign: vnode.attrs.align || 'center',
					width: vnode.attrs.width || '100%'
				} 
			}
			, m('i', 'm') 
			, '('
			, m('i'
				, ' Mithril { 0-60 } ')
			, ')'
		)
	}
}