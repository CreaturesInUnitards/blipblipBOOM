/***********************************
*
* Lab
*
***********************************/
const VH = require('../../view_helpers')
module.exports = VH.fadeInOutComponent({
	view: () =>  {
		const chapter = State.chapters[State.currentChapterIndex]
		const flem = chapter.flems[State.currentFlemIndex]

		return m('section.lab'
			, m('.practicum'
				, m('h5.fw400.uppercase.cl-white.mb1', 'Practicum')
				, chapter.notes.split('|').map(function (note) {
					return m('h4.fw200.notes', m.trust(note))
				})
				, m('.sandboxes'
					, m('h5.fw400.uppercase.cl-white.mb1', 'Sandboxes')
					, chapter.flems.map((fl, idx) => {
						return m('h4.fw200'
							, {
								class: idx === State.currentFlemIndex ? 'current' : '',
							}
							, m('a'
								, {
									href: `/${State.currentChapterIndex}/lab/${idx}`,
									oncreate: m.route.link,
									onupdate: m.route.link
								}
								, fl.label
							)
						)
					})
				)
				, m('ul.links'
					, m('h5.fw400.uppercase.cl-white.mb1', 'Resources')
					, chapter.links.map((link) => {
						return m('li', m('a[target=_blank]', { href: link.url }, link.text))
					})
				)
			)
			, m('.flems'
				, flem && m('iframe', { src: 'http://tinyurl.com/' + flem.url })
			)
		)
	}
})
