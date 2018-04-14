window.m = require('mithril')
window.State = require('./model/State')
window.firebase = require('firebase')
require('firebase/firestore')
require('./index.css')

firebase.initializeApp({
	apiKey: "AIzaSyDlu_TEe5aN8OaQhuBCkqDbjH9-UqBjmRs",
	authDomain: "mithril-0-60.firebaseapp.com",
	projectId: "mithril-0-60"
})

const App = require('./components/App')
const Auth = require('./components/Auth/Auth')
const Dashboard = require('./components/Auth/Dashboard/Dashboard')
const CourseSelector = require('./components/CourseSelector/CourseSelector')
const LoadingAnimation = require('./components/LoadingAnimation')

const getCourses = () => {
	const pathArray = location.pathname.split('/')
	State.getCourses().then(() => {
		// I want to find a better identifying datapoint but my brain isn't very good
		if (pathArray.length > 1 && pathArray[1].length && State.courses[pathArray[1]]) {
			State.getChapters(pathArray[1]).then(startRouter)
		}
		else startRouter()
	})
}

const mainResolver = { onmatch: params => {
	Object.assign(State.path, {
		courseID:   params['courseID'] || '',
		chapter:    +params['chapter'] || 0,
		screen:     params['screen'] || 'video',
		flem:       +params['flem'] || 0
	})
	console.log(State.path.chapter)
	State.loadChapter()
	// if (State.path.chapter !== chapter || State.path.flem !== flem || params['flem'] === undefined || (screen === 'video' && State.path.screen === 'sandbox')) {
	// 	requestAnimationFrame(() => {
	// 		const e = new Event('ShowFlemNotes')
	// 		window.dispatchEvent(e)
	// 	})
	// }
	return App
}}

const startRouter = () => {
	m.route.prefix('')
	m.route(document.body, '/' , {
		'/': CourseSelector,
		'/dashboard': { onmatch: _params => firebase.auth().currentUser ? Dashboard : Auth },
		'/:courseID': mainResolver,
		'/:courseID/:chapter': mainResolver,
		'/:courseID/:chapter/:screen': mainResolver,
		'/:courseID/:chapter/:screen/:flem': mainResolver
	})
}


// show loader until we have data, then enable routes
m.mount(document.body, LoadingAnimation)
getCourses()
