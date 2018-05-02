const State = require('./model/State')
const Actions = require('./model/Actions')
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
	Actions.getCourses().then(() => {

		// if we're deeplinking into a course, make sure the course exists
		// I want to find a better identifying datapoint but my brain isn't very good
		if (pathArray.length > 1 && pathArray[1].length && State.courses[pathArray[1]]) {
			Actions.getChapters(pathArray[1]).then(startRouter)
		}
		else startRouter()
	})
}

const mainResolver = { 
	onmatch: _params => App,
	render: vnode => {
		Actions.loadChapter()
		return vnode
	}
}

const startRouter = () => {
	m.route.prefix('')
	m.route(document.body, '/' , {
		// '/': Dashboard,
		'/': CourseSelector,
		'/auth': Auth,
		'/dashboard': Dashboard ,
		'/:courseID': mainResolver,
		'/:courseID/:chapter': mainResolver,
		'/:courseID/:chapter/:screen': mainResolver,
		'/:courseID/:chapter/:screen/:flem': mainResolver
	})
}


// show loader until we have data, then enable routes
m.mount(document.body, { view: () => m(LoadingAnimation, 'loading course data...') })
getCourses()
