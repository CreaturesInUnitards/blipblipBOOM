window.m = require('mithril')
const State = require('./model/State')
const Player = require('@vimeo/player')

require('./globals.sass')

const ViewModel = {
	mainClass: () => {
		const classes = []
		if (State.menuOpen) classes.push('menuOpen')
		if (State.labOpen) classes.push('labOpen')
		return classes.join(' ')
	}
}

const App = {
	oncreate: () => {
		State.player = new Player('videoContainer', {id: 251386037})
	},
	view: () => {
		const chapter = State.chapters[State.currentChapterIndex]
		const flem = chapter.flems[State.currentFlemIndex]
		const mainClass = ViewModel.mainClass()
		
		return m('main'
			, { class: mainClass }
			, m('menu'
				, m('button.expander.show-menu', { onclick: State.toggleView.bind(null, 'menu')})
			)
			, m('.wrapper'
				, m('section.lecture'
					, m('h1.center', 'Mithril 0-60')
					, m('#videoContainer')
					, m('button.expander.show-lab', { onclick: State.toggleView.bind(null, 'lab')})
				)
				, m('section.lab', 'bar')
			)
		)
	}
}

m.mount(document.body, App)