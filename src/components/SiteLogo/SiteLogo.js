require('./SiteLogo.sass')

module.exports = {
	view: ({attrs}) => {
		return m('.site-logo'
			, { 
				style: {
					fontSize: attrs.size || '1em',
					textAlign: attrs.align || 'center',
					width: attrs.width || '100%'
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