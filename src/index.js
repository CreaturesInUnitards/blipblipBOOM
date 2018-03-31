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
const CourseSelector = require('./components/CourseSelector/CourseSelector')
const LoadingAnimation = require('./components/LoadingAnimation/LoadingAnimation')


const setPath = params => {
	Object.assign(State.path, {
		courseID:   params['courseID'] || '',
		chapter:    +params['chapter'] || 0,
		screen:     params['screen'] || 'video',
		flem:       +params['flem'] || 0
	})
	State.loadChapter()
}


const getChaptersForCourse = courseID => {
	const course = State.courses[courseID] 
	State.chapters = []
	firebase.firestore().collection('chapters').where('parent', '==', courseID).get().then(snap => {
		State.chapters = course.data.children.map(child => {
			const doc = snap.docs.find(doc => doc.id === child.id)
			return doc.data()
		})
		startRouter()
	})
}

const getCourses = () => {
	const pathArray = location.hash.split('/')

	firebase.firestore().collection('courses').get().then(snap => {
		State.courses = {}
		snap.docs.forEach(doc => {
			State.courses[doc.id] = { id: doc.id, data: doc.data() }
		})

		if (pathArray.length > 1 && pathArray[1].length && State.courses[pathArray[1]]) {
			getChaptersForCourse(pathArray[1])
		}
		else startRouter()
	})
}

const matchRoute = params => {
	setPath(params)
	return App
}

const startRouter = () => {
	m.route(document.body, '/' , {
		'/': CourseSelector,
		'/dashboard': {
			onmatch: _params => firebase.auth().currentUser ? Dashboard : Auth
		},
		'/:courseID': {
			onmatch: matchRoute
		},
		'/:courseID/:chapter': {
			onmatch: matchRoute
		},
		'/:courseID/:chapter/:screen': {
			onmatch: matchRoute
		},
		'/:courseID/:chapter/:screen/:flem': {
			onmatch: matchRoute
		}
	})
}

const deeplink = window.location.search.split('/')
if (deeplink.length > 1) location.href = deeplink.slice(1).reduce((a, c) => a + c + '/', '/')

getCourses()
m.mount(document.body, LoadingAnimation)







// m.route.prefix('/mithril0-60')
// m.route.prefix('')

//

// const deeplink = window.location.hash.split('/')
// let url = deeplink.slice(1).reduce((a, c) => a + c + '/', '/')
// m.route.set(url)

//
//


// m.mount(document.body, App)