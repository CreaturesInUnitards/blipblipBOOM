/***********************************
*
* Lab
*
***********************************/
const VH = require('../../view_helpers')
const Collapsible = require('../Collapsible/Collapsible')

module.exports = VH.fadeInOutComponent({
	view: () =>  {
		const chapter = State.chapters[State.currentChapterIndex]
		const flem = chapter.flems[State.currentFlemIndex]

		return m('.screen.sandbox'
			, m('.practicum'
				, m('section.sandboxes'
					, m('h5', 'Sandboxes')
					, m(Collapsible, { items: chapter.flems, label: 'label', content: 'notes' })
				)
				, m('section.resources'
					, m('h5', 'Resources')
					, m('ul.links'
						, chapter.links.map((link) => {
							return m('li', m('a[target=_blank]', { href: link.url }, link.text))
						})
					)
				)
			)
			, m('.flems'
				, flem && m('iframe', { src: 'http://tinyurl.com/' + flem.url })
			)
		)
	}
})
