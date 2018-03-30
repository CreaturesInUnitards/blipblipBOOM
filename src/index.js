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

const COURSE_ID = 'af6lPs1IGL3Bid2MwicE'
firebase.firestore().collection('courses').doc(COURSE_ID).get().then(csnap => {
	const allChapters = csnap.data().children
	firebase.firestore().collection('chapters').where('parent', '==', COURSE_ID).get().then(qs => {
		State.chapters = allChapters.map(obj => qs.docs.find(o => o.id === obj.id).data())
		m.route.set(m.route.get())
	})
})

const App = require('./components/App/App')
const Auth = require('./components/Auth/Auth')
const Dashboard = require('./components/Auth/Dashboard/Dashboard')
const LoadingAnimation = require('./components/LoadingAnimation/LoadingAnimation')

const handleMatch = sandboxOpen => args => {
	if ( State.chapters != null && args.chapter !== undefined ) {
		const chapter = parseInt(args.chapter)
		const sandbox = parseInt(args.sandbox) || undefined

		State.sandboxOpen = sandboxOpen
		State.loadChapter(chapter, sandbox)
	}
	return State.chapters ? App : LoadingAnimation
}


// m.route.prefix('/mithril0-60')
// m.route.prefix('')
m.route(document.body, '/' , {
	'/': {
		onmatch: handleMatch(false)
	},
	'/admin': Auth,
	'/dashboard': {
		onmatch: () => firebase.auth().currentUser ? Dashboard : Auth
	},
	'/:chapter/content': {
		onmatch: handleMatch(false)
	},
	'/:chapter/lab': {
		onmatch: handleMatch(true)
	},
	'/:chapter/content/:sandbox': {
		onmatch: handleMatch(false)
	},
	'/:chapter/lab/:sandbox': {
		onmatch: handleMatch(true)
	}
})


// m.mount(document.body, App)