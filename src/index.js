window.m = require('mithril')
const State = require('./model/State')
const Menu = require('./components/Menu/Menu')
const Lecture = require('./components/Lecture/Lecture')

require('./globals.sass')

function classListForMain() {
	const classes = []
	if (State.menuOpen) classes.push('menuOpen')
	if (State.labOpen) classes.push('labOpen')
	return classes.join(' ')
}

const App = {
	view: () => {
		const chapter = State.chapters[State.currentChapterIndex]
		const flem = chapter.flems ? chapter.flems[State.currentFlemIndex] : {}
		const welcomeVisible = State.currentChapterIndex === 0
		const mainClass = classListForMain()
		
		return m('main'
			, { class: mainClass }
			, m(Menu)
			, m('.wrapper'
				, m(Lecture, { 
					canPlay: State.canPlay, 
					welcomeVisible: welcomeVisible, 
					expandFn: State.toggleView 
				})
				, m('section.lab'
					, m('.resources'
						, m('h5', 'Practicum')
						, chapter.notes.split('|').map(function (note) {
							return m('h4.notes', m.trust(note)) 
						})
						, m('ul.sandboxes'
							, m('h5', 'Sandboxes')
							, chapter.flems.map((fl, idx) => {
								return m('h4'
									, {
										class: idx === State.currentFlemIndex ? 'current' : '',
										onclick: State.setFlem.bind(null, idx) 
									}
									, fl.label
								)
							})
						)
						, m('ul.links'
							, m('h5', 'Resources')
							, chapter.links.map((link) => {
								return m('li', m('a[target=_blank]', { href: link.url }, link.text))
							})
						)
					)
					, m('.flems'
						, m('iframe', { src: 'http://tinyurl.com/' + flem.url })
					)
				)
			)
		)
	}
}

m.mount(document.body, App)