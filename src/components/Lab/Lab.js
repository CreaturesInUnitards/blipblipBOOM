/***********************************
 *
 * Lab
 *
 ***********************************/
const VH = require('../../view_helpers')
const Collapsible = require('../Collapsible/Collapsible')

module.exports = {
	view: _v => {
		const chapter = State.chapters[State.currentChapterIndex]
		const flem = chapter.flems[State.currentFlemIndex]

		return m('.lab.full-main.flex.pt40'
			, m('.practicum.f1.br1-dark.oya'
				, m('section.sandboxes'
					, m(Collapsible, { items: chapter.flems, label: 'label', content: 'notes' })
				)
				, m('section.resources'
					, m('h3.p10', 'Resources')
					, m('ul.m0.c-grey'
						, chapter.links.map(link =>
							m('li.p6', m('a[target=_blank].c-grey.p6', { href: link.url }, link.label))
						)
					)
				)
			)
			, m('.flems.f3.flex'
				, flem && flem.url && m(VH.fadeInOutComponent, { fadein: true, onupdate: true },
					m('iframe.f1.b0', { src: 'http://tinyurl.com/' + flem.url }),
				)
			)
		)
	}
}
