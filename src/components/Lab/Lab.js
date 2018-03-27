/***********************************
 *
 * Lab
 *
 ***********************************/
const VH = require('../../view_helpers')
const Collapsible = require('../Collapsible/Collapsible')

module.exports = {
	view: vnode => {
		const chapter = State.chapters[State.currentChapterIndex]
		const flem = chapter.flems[State.currentFlemIndex]

		return m(VH.fadeInOutComponent
			, m('.lab.full-main.flex.pt40'
				, m('.practicum.f1'
					, m('section.sandboxes'
						, m(Collapsible, { items: chapter.flems, label: 'label', content: 'notes' })
					)
					, m('section.resources'
						, m('ul.links'
							, chapter.links.map(link =>
								m('li', m('a[target=_blank]', { href: link.url }, link.text))
							)
						)
					)
				)
				, m('.flems.f1'
					, flem && m(VH.fadeInOutComponent, { fadein: true, onupdate: true },
						m('iframe', { src: 'http://tinyurl.com/' + flem.url }),
					)
				)
			)
		)
	}
}
