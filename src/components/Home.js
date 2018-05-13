/***********************************
*
* CourseSelector
*
***********************************/
const State = require('../model/State')
const Actions = require('../model/Actions')
const LoadingAnimation = require('./LoadingAnimation')
const Logo = require('./Logo')


module.exports = _v => {
	let loading = false
	
	const selectCourse = courseID => _e => {
		loading = true
		Actions.getChapters(courseID).then(() => { m.route.set(`/${courseID}`) })
	}
	
	return {
		oncreate: _v => {
			if (State.player) {
				State.player.destroy()
				State.reset(State) 
			} 
		},
		view: _vnode => m('.vw100.vh100.flex.jc.ac.col.bg-dark.c-white'
			, m(Logo, { class: 'w60 h30' })
			, m('p.mt20.mw300x.lh15', "blipblipBOOM is a coding-education platform, currently in alpha, built on these free web services:")
			, m('ul.mt20'
				, m('li.mt10', m('a.underline[href=//firebase.google.com][target=_blank]', 'Firebase BaaS (free tier)'))
				, m('li.mt10', m('a.underline[href=//vimeo.com][target=_blank]', 'Vimeo'))
				, m('li.mt10', m('a.underline[href=//flems.io][target=_blank]', 'Flems coding sandboxes'))
				, m('li.mt10', m('a.underline[href=//tinyurl.com][target=_blank]', 'TinyURL url-shortening service'))
			)
			, m('p.mt20.mw300x.lh15', "The site is built for 2 activities: watching code-instruction videos and actually writing code. Neither of these activities is great on a phone, and both are horrible in portrait orientation. Whenever possible, please visit blipblipBOOM using a desktop or laptop computer.")
			, m('p.mt20.mw300x.lh15', 'Mithril 0-60 is the first course available, serving as a testbed for the platform.')
			, m('.course-selector.flex.wrap'
				, State.courses
					? Object.keys(State.courses).map(key => {
						const course = State.courses[key]
						return m('.course.p20.m20.bg-brick.c-white.pointer.rad6x'
							, { onclick: selectCourse(course.id) }
							, course.data.title
						)
					})
					: m(LoadingAnimation)
			)
			, m('.i.fs12.center', '© ', m('a[href=//github.com/creaturesinunitards]', 'Scott Simpson'))
			, m('.fix.t10.r10', m('a.fs12[href=/dashboard]', { oncreate: m.route.link }, 'admin'))
			, loading && m('i', 'just a sec...')
		)
	}
}
