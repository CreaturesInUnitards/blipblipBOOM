/***********************************
*
* Dashboard
*
***********************************/
window.alf = require('../alf')
const FBObserve = require('../FBObserve')
const { AddObject, UpdateObject, RemoveObject } = require('../Operations')
const LoadingAnimation = require('../../LoadingAnimation')
const Logo = require('../../Logo')
const FormField = require('../FormField/FormField')
const ChapterEditor = require('../Editor/ChapterEditor')
const DNDList = require('../DNDList/DNDList')
const BooleanSwitch = require('../BooleanSwitch/BooleanSwitch')

const resetAdminData = () => ({
	user: null,
	courses: {},
	chapters: {},
	chapterCache: {}
})
window.AdminData = resetAdminData() 

const signOut = _e => {
	AdminData = resetAdminData()
	firebase.auth().signOut()
	m.route.set('/')
}

const setObserver = (collectionName, uid, targetObject, parent, parentCollectionName, AdminDataPropName) => {
	FBObserve(collectionName, targetObject, {
		condition: ['parent', '==', uid],
		callback: change => {
			const docId = change.doc.id
			const docData = change.doc.data()
			if (!parent.data.children) parent.data.children = []
			const children = parent.data.children
			const findFn = c => c.id === docId
			if (change.type !== 'modified') {
				if (change.type === 'added') {
					if (!children.find(findFn)) {
						children.push({ id: docId, title: docData.title })
					}
				}
				else if (change.type === 'removed') {
					children.splice(children.indexOf(children.find(findFn)), 1)
				}
				UpdateObject(parentCollectionName, parent.id, { children: children })
				m.redraw()
			}
			if (AdminData[AdminDataPropName] && docId === AdminData[AdminDataPropName].id) {
				AdminData[AdminDataPropName].data = docData
			}
		}
	})
}



const username = user => `${user.data.first} ${user.data.last}`

const getUser = () => {
	const user = firebase.auth().currentUser
	if (user) {
		const uid = user.uid
		firebase.firestore().collection('users').doc(uid).get().then(doc => {
			AdminData.user = { id: doc.id, data: doc.data() }
			m.redraw()
			setObserver('courses', uid, AdminData.courses, AdminData.user, 'users', 'courseCopy')
		})
	}
	else m.route.set('/auth')
}

const cleanThing = (obj, prop) => {
	return alf.objectsAreEquivalent(obj[AdminData[prop].id], AdminData[prop])
}

const weAreFilthy = () => {
	if (AdminData.courseCopy && !cleanThing(AdminData.courses, 'courseCopy')) return true
	return (AdminData.chapterCopy && !cleanThing(AdminData.chapters, 'chapterCopy'))
}

const sortedBytTitle = (a, b) => {
	if (a.title < b.title) return -1
	if (a.title > b.title) return 1
	return 0
}

const chooseChapter = obj => _e => {
	AdminData.chapterCopy = alf.deepClone(AdminData.chapters[obj.id])
}

const removeItem = (item, type) => _e => {
	const message = type === 'courses'
		? `Are you sure? "${ item.title || item.data.title }" will be gone forever, along with all of its chapters and their data. Pretty scary.`
		: `Are you sure? "${ item.title || item.data.title }" will be gone forever, along with all of its data.`
	if (confirm( message )) {
		if (confirm('Last chance...?')) {
			RemoveObject(type, item.id)
		}
	}

}

const cancel = () => {
	AdminData.courseCopy = AdminData.chapterCopy = null
}

const revert = _e => {
	if (confirm('Revert to saved? Changes will be lost.')) {
		const courseID = AdminData.courseCopy.id
		AdminData.courseCopy = alf.deepClone(AdminData.courses[courseID])
		
		if (AdminData.chapterCopy) {
			const chapterID = AdminData.chapterCopy.id
			AdminData.chapterCopy = null
			
			// this rAF fixes a weird notes editor bug
			requestAnimationFrame(() => {
				AdminData.chapterCopy = alf.deepClone(AdminData.chapters[chapterID])
				m.redraw()
			})
		}
	}
}

const save = _e => { 
	const course = AdminData.courseCopy
	UpdateObject('courses', course.id, course.data)
	
	if (AdminData.chapterCopy) {
		const chapter = AdminData.chapterCopy
		UpdateObject('chapters', chapter.id, chapter.data)
	}
}


const chooseCourse = courses => e => {
	const courseID = courses.find(course => course.id === e.target.value).id
	if (AdminData.courseCopy && AdminData.courseCopy.id === courseID) return
	AdminData.courseCopy = alf.deepClone(AdminData.courses[courseID])
	AdminData.chapters = {}
	AdminData.chapterCopy = null
	setObserver('chapters', courseID, AdminData.chapters, AdminData.courseCopy, 'courses', 'chapterCopy')
}


module.exports = {
	oninit: getUser,
	view: () => {
		const user = AdminData.user
		const courses = (user && user.data && user.data.children) ? user.data.children.sort(sortedBytTitle) : []
		const course = AdminData.courseCopy
		const dirty = weAreFilthy()
		const chapters = course ? course.data.children : null

		return user
			? m('.fix.t0.l0.vw100.vh100.flex.col.bg-white',
				[
					m('header.flex.ac.bg-dark.c-white.p10-20',
						m('a[href=/]', { oncreate: m.route.link }, m(Logo, { class: 'w40 h20 mr20' })),
						m('.fs32.mra', `Dashboard: ${username(user)}`),
						m('button.b0.rad4x.fs12.p5-20.bg-white.c-dark', { onclick: signOut }, 'log out')
					),
					m('.main.flex.col.f1',
						m('.editor-header.flex.ac.h50.p0-20.tr3',
							{ class: dirty ? 'bg-brick' : 'bg-grey' },
							m('select.mra.b0.bg-white.fs20.lh15.wka-none',
								{
									value: course ? course.id : 0,
									onchange: chooseCourse(courses) 
								},
								m('option', { value: 0, disabled: course }, 'Choose a Course'),
								courses.map((aCourse, idx) => m('option', { value: aCourse.id }, aCourse.title))
							),
							dirty && m('h4.mla', 'There are unsaved changes.'),
							course && [
								m('button.b0.p5-20.rad4x.fs12.bg-white.c-dark.pointer.ml5', { disabled: dirty, style: { opacity: dirty ? 0.25 : 1 }, onclick: cancel }, 'cancel'),
								m('button.b0.p5-20.rad4x.fs12.bg-white.c-dark.pointer.ml5', { disabled: !dirty, style: { opacity: dirty ? 1 : 0.25 }, onclick: revert }, 'revert'),
								m('button.b0.p5-20.rad4x.fs12.bg-white.c-dark.pointer.ml5', { disabled: !dirty, style: { opacity: dirty ? 1 : 0.25 }, onclick: save }, 'save')
							]
						),
						course
							? m('.flex.col.f2.p20',
								m('.flex.jb.ac.mb20',
									m(FormField, {
										label: 'Course Title',
										value: course.data.title,
										labelClass: 'mb6',
										inputClass: 'w50p fs20 p6 b-1-grey',
										oninput: v => { course.data.title = v }
									}),
									m('h3.mr10', 'Publish'),
									m(BooleanSwitch, { 
										condition: course.data.published,
										onclick: _e => { course.data.published = !course.data.published }
									}),
									m('button.c-white.bg-brick.fs20.p5-20.ml20.rad4x.pointer', { onclick: removeItem(course, 'courses') }, 'Delete Course'),
								),
								m('.flex.f1.b-1-grey.rad6x.oh.mt10',
									m(DNDList, {
										header: 'Chapters',
										addFn: AddObject('chapters', { parent: course.id, title: 'New Chapter' }),
										array: chapters,
										saveFn: () => { UpdateObject('courses', course.id, { children: chapters }) },
										clickFn: chooseChapter,
										removeFn: removeItem
									}),
									AdminData.chapterCopy
										? m(ChapterEditor, { removeItem: removeItem })
										: m('.no-content.flex.jc.ac.f1.fs32', 'Select a chapter')
								)
							)
							: m('.no-content.flex.jc.ac.f1.fs32', 'Select a course')
					)
				]
			)
			
			: m(LoadingAnimation)
	}
	
}