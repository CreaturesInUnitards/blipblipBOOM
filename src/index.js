window.m = require('mithril')
const State = require('./model/State')
const Menu = require('./components/Menu/Menu')
const Lecture = require('./components/Lecture/Lecture')
const Lab = require('./components/Lab/Lab')


require('./globals.sass')

function classListForMain() {
	const classes = []
	if (State.menuOpen) classes.push('menuOpen')
	if (State.labOpen) classes.push('labOpen')
	return classes.join(' ')
}

const App = {
	view: () => {
		const mainClass = classListForMain()
		
		return m('main'
			, { class: mainClass }
			, m(Menu)
			, m('.wrapper'
				, m(Lecture, { 
					welcomeVisible: State.currentChapterIndex === 0, 
					expandFn: State.toggleView 
				})
				, m(Lab)
			)
		)
	}
}

m.mount(document.body, App)