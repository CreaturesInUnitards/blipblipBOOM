/***********************************
*
* Dashboard
*
***********************************/
window.alf = require('../alf')
const FBObserve = require('../FBObserve')
const { AddObject, UpdateObject, RemoveObject, EditObjectProperty } = require('../Operations')
const LoadingAnimation = require('../../LoadingAnimation/LoadingAnimation')
const ChapterEditor = require('../ChapterEditor/ChapterEditor')
const DNDList = require('../DNDList/DNDList')
require("./Dashboard.sass")

const resetAdminData = () => ({
	courses: {},
	chapters: {}
}) 

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
			} 
		})
}

const chooseCourse = v => _e => {
	AdminData.courseCopy = alf.deepClone(v)
	AdminData.chapters = {}
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
			RemoveObject('courses', course.id)
		}
	}
}

const removeChapter = (chapter, idx) => _e => {
	if (confirm(`Are you sure? "${chapter.data.title}" will be gone forever, along with all of its data.`)) {
		if (confirm('Last chance...?')) {
			RemoveObject('chapters', chapter.id)
		}
	}
}

const addCourse = _e => {
	AddObject('courses', {
		author: AdminData.user.id,
		title: 'New Course'
	})
}

const addChapter = course => _e => {
	AddObject('chapters', {
		course: course.id,
		title: 'New Chapter'
	})
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
							addFn: addCourse,
							array: courses,
							saveFn: () => { UpdateObject('users', user.id, { courses: courses }) },
							object: AdminData.courses,
							clickFn: chooseCourse,
							titleSaveFn: EditObjectProperty,
							removeFn: removeCourse
						}),
						AdminData.courseCopy && m(DNDList, {
							header: 'Chapters',
							addFn: addChapter(AdminData.courseCopy),
							array: AdminData.courseCopy.data.chapters,
							saveFn: () => { UpdateObject('courses', AdminData.courseCopy.id, { chapters: AdminData.courseCopy.data.chapters }) },
							object: AdminData.chapters,
							clickFn: chooseChapter,
							titleSaveFn: EditObjectProperty,
							removeFn: removeChapter
						}), 
						AdminData.chapterCopy && m(ChapterEditor, { key: Date.now() })
					)
				]
			)
			: m(LoadingAnimation)
	}
}

// TODO: make a form for all this shit
// TODO: fix going from 0-something