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
					, m('h4'
						, `${cidx === 0 ? '' : cidx} ${chapter.name}`
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
