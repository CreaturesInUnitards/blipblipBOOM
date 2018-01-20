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
				return m('.chapter'
					, {
						class: cidx === State.currentChapterIndex ? 'current' : '',
						onclick: State.setChapter.bind(null, cidx)
					}
					, m(''
						, cidx > 0 && m('h4.chapter-num', cidx + '.')
						, m('h4.chapter-name',  chapter.name)
					)
				)

			})
			, m('button.expander.show-menu'
				, {
					class: State.firstRun_menu ? 'first-run' : '',
					onclick: State.toggleView.bind(null, 'menu')
				}
			)
		)
	}
}
