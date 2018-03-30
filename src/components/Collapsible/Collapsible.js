require('./Collapsible.sass')

let firstRun = true

const inout = (dom) => {
	const notes = dom.querySelector('.notes')
	const h = notes.offsetHeight
	return { notes, h }
}

const grow = ({dom}) => {
	const o = inout(dom)
	setTimeout(() => {
		dom.style.height = o.h + 'px'
		setTimeout(()=>{
			o.notes.style.position = 'relative'
			dom.style.height = 'auto'
		}, 300)
	}, firstRun ? 1000 : 10)
	firstRun = false
}

const shrink = ({dom}) => {
	const o = inout(dom)
	o.notes.style.position = 'absolute'
	dom.style.height = o.h + 'px'
	return new Promise((res) => {
		setTimeout(()=>{
			dom.style.height = 0
			setTimeout(res, 300)
		})
	})
}
const Collapsible = _vnode => ({
	view: ({attrs}) => {
		let {items, label, content} = attrs
		return m('.collapsible',
			items.map((item, idx) =>
				m('.item',
					{class: idx === State.currentFlemIndex ? 'current' : ''},
					m('label',
						m('a.c-light', idx === State.currentFlemIndex
							? {}
							: {
								href: `/${State.currentChapterIndex}/lab/${idx}`,
								oncreate: m.route.link,
								onupdate: m.route.link
							},
							`${idx + 1}: ${item[label]}`
						)
					),
					State.currentFlemIndex === idx && m('.notes-wrapper',
						{
							oncreate: grow,
							onbeforeremove: shrink
						},
						m('.notes', m.trust(item[content]))
					)
				)
			)
		)
	}
})


module.exports = Collapsible
