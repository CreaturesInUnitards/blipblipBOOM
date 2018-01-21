window.m = require('mithril')
const VH = require('./view_helpers')
const State = require('./model/State')
const Menu = require('./components/Menu/Menu')
const Lecture = require('./components/Lecture/Lecture')
const Lab = require('./components/Lab/Lab')

require('./globals.sass')

const App = {
	view: () => {
		const mainClass = VH.classListForMain(State)
		
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