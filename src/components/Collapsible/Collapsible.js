require('./Collapsible.sass')

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
	}, 10)
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
const Collapsible = (vnode) => {
	return {
		view: ({attrs}) => {
			let { items, label, content } = attrs
			return m('.collapsible',
				items.map((item, idx) =>
					m('.item',
						{ class: idx === State.currentFlemIndex ? 'current' : '' },
						m('label',
							m('a', {
								href: `/${State.currentChapterIndex}/lab/${idx}`,
								oncreate: m.route.link,
								onupdate: m.route.link
							}, item[label])
						),
						// m('label', { onclick: () => { State.currentFlemIndex = idx } }, item[label]),
						State.currentFlemIndex === idx && m('.notes-wrapper',
						{
							oncreate: grow,
							onbeforeremove: shrink
						},
						m('.notes', item[content])
						)
					)
				)
			)
		}
	}
}

module.exports = Collapsible
