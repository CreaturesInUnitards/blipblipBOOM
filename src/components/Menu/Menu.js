/***********************************
*
* Menu
*
***********************************/
const State = require('../../model/State')

module.exports = {
	view: () => {
		return m('menu'
			, State.chapters.map((chapter, cidx) => {
				const isVideo = cidx > 0
				return m('.chapter'
					, { class: cidx === State.currentChapterIndex ? 'current' : '' }
					, m('.label'
						, m('h4.chapter-num', (isVideo ? cidx + '.' : ''))
						, m('h4.chapter-name',  chapter.label)
					)
					, m('.selector'
						, { onclick: State.setChapter.bind(null, cidx) }
						, m('button.video', isVideo ? 'video' : 'home')
						, m('button.practicum', 'practicum')
					)
				)

			})
			, m('button.expander.show-menu'
				, {
					class: State.firstRun.menu ? 'first-run' : '',
					onclick: State.toggleView.bind(null, 'menu')
				}
			)
		)
	}
}
