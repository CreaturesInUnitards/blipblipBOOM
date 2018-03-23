/***********************************
*
* Dashboard
*
***********************************/
window.alf = require('../alf')
const FBObserve = require('../FBObserve')
const { AddObject, UpdateObject, RemoveObject } = require('../Operations')
const LoadingAnimation = require('../../LoadingAnimation/LoadingAnimation')
const ChapterEditor = require('../ChapterEditor/ChapterEditor')
const DNDList = require('../DNDList/DNDList')
require("./Dashboard.sass")

const resetAdminData = () => ({
	courses: {},
	chapters: {}
})

// TODO: go with AdminData.users = {} and AdminData.currentUser

window.AdminData = resetAdminData() 

const signOut = _e => {
	AdminData = resetAdminData()
	firebase.auth().signOut()
	m.route.set('/admin')
}

const getUser = () => {
	const uid = firebase.auth().currentUser.uid
	FBObserve('users', { FBLocalObject: AdminData, FBLocalProp: 'user' }, { condition: ['id', '==', uid] })
	FBObserve('courses', AdminData.courses, 
		{ 
			condition: ['author', '==', uid], 
			callback: change => {
				const docId = change.doc.id
				const user = AdminData.user
				const courses = user.data.courses || []
				if (change.type != 'modified') {
					if (change.type == 'added') {
						if (courses.indexOf(docId) < 0) {
							courses.push(change.doc.id)
						}
					}
					else if (change.type == 'removed') {
						courses.splice(courses.indexOf(docId), 1)
					}
					UpdateObject('users', user.id, { courses: courses })
					m.redraw()
				}
				if (AdminData.courseCopy && docId == AdminData.courseCopy.id) {
					AdminData.courseCopy.data = change.doc.data()
				}
			} 
		})
}

const chooseCourse = v => _e => {
	// TODO: cache courses and chapters and check to see if they're still here
	AdminData.courseCopy = alf.deepClone(v)
	AdminData.chapters = {}
	AdminData.chapterCopy = null
	
	FBObserve('chapters', AdminData.chapters, 
		{ 
			condition: ['course', '==', AdminData.courseCopy.id],
			callback: change => {
				const docId = change.doc.id
				const course = AdminData.courseCopy
				const chapters = course.data.chapters || []
				if (change.type != 'modified') {
					if (change.type == 'added') {
						if (chapters.indexOf(docId) < 0) {
							chapters.push(change.doc.id)
						}
					}
					else if (change.type == 'removed') {
						chapters.splice(chapters.indexOf(docId), 1)
					}
					UpdateObject('courses', course.id, { chapters: chapters })
					m.redraw()
				}
				if (AdminData.chapterCopy && docId == AdminData.chapterCopy.id) {
					AdminData.chapterCopy.data = change.doc.data()
				}
			}
		})
}

const chooseChapter = v => _e => {
	AdminData.chapterCopy = alf.deepClone(v)
}

const removeCourse = (course, idx) => _e => {
	if (confirm(`Are you sure? "${course.data.title}" will be gone forever, along with all of its chapters and their data. Pretty scary.`)) {
		if (confirm('Last chance...?')) {
			AdminData.courseCopy = null
			RemoveObject('courses', course.id)
		}
	}
}

const removeChapter = (chapter, idx) => _e => {
	if (confirm(`Are you sure? "${chapter.data.title}" will be gone forever, along with all of its data.`)) {
		if (confirm('Last chance...?')) {
			AdminData.chapterCopy = null
			RemoveObject('chapters', chapter.id)
		}
	}
}

const username = user => `${user.data.first} ${user.data.last}`



module.exports = {
	oninit: getUser,
	view: () => {
		const user = AdminData.user
		const courses = (user && user.data && user.data.courses) ? user.data.courses : []
		return user
			?   m('.dashboard',
				[
					m('header',
						`Courses: ${username(user)}`,
						m('button', { onclick: signOut }, 'sign out')
					),
					m('.main',
						m(DNDList, {
							header: 'Courses',
							addFn: AddObject('courses', { author: AdminData.user.id, title: 'New Courset' }),
							array: courses,
							saveFn: () => { UpdateObject('users', user.id, { courses: courses }) },
							object: AdminData.courses,
							clickFn: chooseCourse,
							titleSaveFn: UpdateObject,
							removeFn: removeCourse
						}),
						AdminData.courseCopy
							? m(DNDList, {
								header: 'Chapters',
								addFn: AddObject('chapters', { course: AdminData.courseCopy.id, title: 'New Chaptert' }),
								array: AdminData.courseCopy.data.chapters,
								saveFn: () => { UpdateObject('courses', AdminData.courseCopy.id, { chapters: AdminData.courseCopy.data.chapters }) },
								object: AdminData.chapters,
								clickFn: chooseChapter,
								titleSaveFn: UpdateObject,
								removeFn: removeChapter
							})
							: m('.no-course', 'Select a course'),
						AdminData.chapterCopy && m(ChapterEditor)
					)
				]
			)
			: m(LoadingAnimation)
	}
}