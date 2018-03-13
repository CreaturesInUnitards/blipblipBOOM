window.m = require('mithril')
window.State = require('./model/State')
require('./globals.sass')

const App = require('./components/App/App')


const handleMatch = (sandboxOpen, args) => {
	const chapter = parseInt(args.chapter)
	const sandbox = parseInt(args.sandbox) || undefined
	
	State.sandboxOpen = sandboxOpen
	State.loadChapter(chapter, sandbox)
	return App
}


// m.route.prefix('/mithril0-60')
// m.route.prefix('')
m.route(document.body, '/' , {
	'/': App,
	'/:chapter/content': {
		onmatch: handleMatch.bind(null, false)
	},
	'/:chapter/lab': {
		onmatch: handleMatch.bind(null, true)
	},
	'/:chapter/content/:sandbox': {
		onmatch: handleMatch.bind(null, false)
	},
	'/:chapter/lab/:sandbox': {
		onmatch: handleMatch.bind(null, true)
	}
})


// m.mount(document.body, App)