const blipColor = color => `bg-${color || 'brick'}`

module.exports = {
	view: ({attrs}) => m('.logo.flex.jc.ac',
		attrs,
		m('.blip-wrapper.rel.flex.ja.ae.w100p.h50p', 
			m('.blip.in-block.rad50p.w20p.h40p', { class: blipColor(attrs.blipColor) }),
			m('.blip.in-block.rad50p.w20p.h40p', { class: blipColor(attrs.blipColor) }),
			m('.blip.in-block.rad50p.w50p.h100p', { class: blipColor(attrs.blipColor) })
		)
	)	
}


