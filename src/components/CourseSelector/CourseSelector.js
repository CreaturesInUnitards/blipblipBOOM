/***********************************
*
* CourseSelector
*
***********************************/
const State = require('../../model/State')
const Actions = require('../../model/Actions')
const LoadingAnimation = require('../LoadingAnimation')

module.exports = _v => {
	let loading = false
	
	const selectCourse = courseID => _e => {
		loading = true
		Actions.getChapters(courseID).then(() => { m.route.set(`/${courseID}`) })
	}
	
	return {
		view: ({attrs}) => m('.fullscreen.flex.jc.ac.col',
			m('h1', "ShutUP! Obviously this isn't designed yet."),
			m('.course-selector.flex',
				State.courses
					? Object.keys(State.courses).map(key => {
						const course = State.courses[key]
						return m('.course.p20.m20.bg-brick.c-white.pointer',
							{ onclick: selectCourse(course.id) },
							course.data.title
						)
					})
					: m(LoadingAnimation)
			),
			loading && m('i', 'just a sec...')
		)
	}
}
