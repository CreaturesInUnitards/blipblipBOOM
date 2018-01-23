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
		
		return m('main.width100vw.height100vh.ovf-hidden'
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

const handleMatch = (labOpen, args) => {
	const chapter = parseInt(args.chapter)
	const sandbox = parseInt(args.sandbox) || undefined
	
	if (!labOpen && chapter === 0) {
		State.currentChapterIndex = 0
		State.labOpen = false
		// m.route.set('/')
		return App
	}	
	else {
		State.labOpen = labOpen
		State.loadChapter(chapter, sandbox)
		return App
	}
}

m.route(document.body, '/' , {
	'/': App,
	'/:chapter/content': {
		onmatch: handleMatch.bind(null, false)
	},
	'/:chapter/lab': {
		onmatch: handleMatch.bind(null, true)
	},
	'/:chapter/lab/:sandbox': {
		onmatch: handleMatch.bind(null, true)
	}
})