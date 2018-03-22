window.m = require('mithril')
window.State = require('./model/State')
require('./globals.sass')

window.firebase = require('firebase')
require('firebase/firestore')

firebase.initializeApp({
	apiKey: "AIzaSyDlu_TEe5aN8OaQhuBCkqDbjH9-UqBjmRs",
	authDomain: "mithril-0-60.firebaseapp.com",
	projectId: "mithril-0-60"
})

const App = require('./components/App/App')
const Auth = require('./components/Auth/Auth')
const Dashboard = require('./components/Auth/Dashboard/Dashboard')


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
	'/admin': Auth,
	'/dashboard': {
		onmatch: () => firebase.auth().currentUser ? Dashboard : Auth
	},
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