require('./Collapsible.sass')

let firstRun = true // wait a second on deeplink/firstrun

const inout = dom => {
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
		const { courseID, chapter, flem } = State.path
		return m('.collapsible',items.map((item, idx) => {
			const isCurrentFlem = idx === flem
			return m('.item',
				{class: isCurrentFlem ? 'current' : ''},
				m('label',
					m('a.c-light', isCurrentFlem
						? {}
						: {
							href: `/${courseID}/${chapter}/sandbox/${idx}`,
							oncreate: m.route.link,
							onupdate: m.route.link
						},
						`${idx + 1}: ${item[label]}`
					)
				),
				isCurrentFlem && m('.notes-wrapper',
					{
						oncreate: grow,
						onbeforeremove: shrink
					},
					m('.notes', m.trust(item[content]))
				)
			)
		}))
	}
})


module.exports = Collapsible
