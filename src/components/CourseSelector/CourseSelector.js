/***********************************
*
* CourseSelector
*
***********************************/
const LoadingAnimation = require('../LoadingAnimation/LoadingAnimation')

module.exports = _v => {
	let loading = false
	
	const selectCourse = courseID => _e => {
		const course = State.courses[courseID]
		firebase.firestore().collection('chapters').where('parent', '==', courseID).get().then(snap => {
			State.chapters = course.data.children.map(child => {
				const doc = snap.docs.find(doc => doc.id === child.id)
				return doc.data()
			})
			console.log(State.chapters)
			m.route.set(`/${courseID}`)
		})
	}
	
	return {
		oninit(_v){
			console.log("wiping State")
			Object.assign(State.path, { courseID: null, chapter: null, screen: null, flem: null})
		},
		view: ({attrs}) => m('.fullscreen.flex.jc.ac.col',
			m('.course-selector.flex',
				State.courses
					? Object.keys(State.courses).map(key => {
						const course = State.courses[key]
						return m('.course.p20.m20.bg-brick.c-white.pointer',
							{
								onclick: selectCourse(course.id)
							},
							course.data.title
						)
					})
					: m(LoadingAnimation)
			),
			loading && m(LoadingAnimation)
		)
	}
}
