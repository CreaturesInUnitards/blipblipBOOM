/***********************************
*
* ChapterEditor
*
***********************************/
require("./ChapterEditor.sass")
const alf = require('../alf')
const FormField = require('../FormField/FormField')
const NotesEditor = require('./NotesEditor')
const UpdateObject = require('../Operations').UpdateObject

const addFlem = _e => {
	const newFlems = ( AdminData.chapterCopy.data.flems || [] ).concat({ label: 'New Flem' })
	UpdateObject('chapters', AdminData.chapterCopy.id, { flems: newFlems })
}

const addLink = _e => {
	const newLinks = ( AdminData.chapterCopy.data.links || [] ).concat({ label: 'new link', url: '' })
	UpdateObject('chapters', AdminData.chapterCopy.id, { links: newLinks })
}

module.exports = v => {
	let editing = null
	let currentFlem = null
	
	const cancel = _e => {
		AdminData.chapterCopy = null
	}
	
	const save = _e => {
		UpdateObject('chapters', AdminData.chapterCopy.id, AdminData.chapterCopy.data)
	}
	
	const revert = _e => {
		if (confirm('Discard changes?')) {
			AdminData.chapterCopy = alf.deepClone(AdminData.chapters[AdminData.chapterCopy.id])
		}
	}
	
	return {
		view: () => {
			const obj = AdminData.chapterCopy.data
			
			let dirty = false
			try {
				dirty = AdminData.chapterCopy && !alf.objectsAreEquivalent(obj, AdminData.chapters[AdminData.chapterCopy.id].data)
			} catch (e) {}
			
			return m('.editor.f1.flex.col',
				m('.editor-header.flex.ac.h50.ph20',
					{ class: dirty ? 'bg-brick' : 'bg-grey' },
					dirty && m('h4', 'There are unsaved changes.'),
					m('button.b0.brad4.f-12.bg-white.c-dark.mla', { disabled: dirty, onclick: cancel }, 'cancel'),
					m('button.b0.brad4.f-12.bg-white.c-dark', { disabled: !dirty, onclick: revert }, 'revert'),
					m('button.b0.brad4.f-12.bg-white.c-dark', { disabled: !dirty, onclick: save }, 'save')
				),
				m('.editor-content.f1.oya.p40',
					m('.top-fields.flex.ac.mb20',
						m(FormField, {
							labelClass: 'font-18 mb6',
							inputClass: 'font-18 p6 w100pct',
							type: 'text',
							placeholder: 'Chapter Title',
							label: 'Chapter Title',
							value: obj.title,
							oninput: v => obj.title = v
						}),
						m(FormField, {
							class: 'ml20',
							labelClass: 'font-18 mb6',
							inputClass: 'font-18 p6 w100pct',
							type: 'text',
							placeholder: 'Vimeo ID',
							label: 'Vimeo ID',
							value: obj.url,
							oninput: v => obj.url = v
						})
					),
					m('.flem-box.bg-light.p10.b1-black.mb20',
						m('.flem-header.bg-dark.c-white.flex.ac.h50.ph10',
							m('h3.mra', 'Exercises'),
							m('button.add-button.font-24', { onclick: addFlem }, '⊕')
						),
						obj.flems && obj.flems.map((flem, idx) => {
							const isCurrent = flem === currentFlem
							const n = idx + 1
						
							return m('.flem',
								{ class: isCurrent ? 'current' : '' },
								isCurrent
									? m('.current-box.p10.bg-dark.mt20.c-white',
										m('.font-12.mb20', n),
										m('.top-fields.flex.ac',
											m(FormField, {
												labelClass: 'mb6',
												inputClass: 'p6 font-16 w100pct',
												type: 'text',
												placeholder: 'Flem Title',
												label: 'Flem Title',
												value: flem.label,
												oninput: v => flem.label = v
											}),
											m(FormField, {
												class: 'ml20',
												labelClass: 'mb6',
												inputClass: 'p6 font-16 w100pct',
												type: 'text',
												placeholder: 'not including https://tinyurl.com/',
												label: 'Tinyurl',
												value: flem.url,
												oninput: v => { flem.url = v.subtr(0, 8) }
											}),
											m(FormField, {
												class: 'ml20',
												labelClass: 'mb6',
												inputClass: 'p6 font-16 w100pct',
												type: 'text',
												placeholder: '...if any',
												label: 'Cue Stop',
												value: flem.cuestop,
												oninput: v => {
													const n = parseInt(v)
													flem.cuestop = (typeof n == 'number' && n == n) ? n : ''
												}
											})
										),
										m('.notes-box.mt20.bg-light.c-dark.p10',
											m('h3.mb6', 'Notes'),
											m('.p20.bg-grey.c-white', m.trust(flem.notes)),
											m('.pt10.flex.ac', 
												m('button.bg-dark.c-white.brad4.mla', 
													{ onclick: _e => { editing = flem } }, 
													'edit'
												)
											)											
										)
									)
									: m('.box.mt20.p10.b1-black.bg-white.flex.ac.pointer',
										{ onclick: _e => { currentFlem = flem } },
										m('.font-18.mra', `${n}: ${flem.label}`),
										m('button.b0.brad4.f-12.bg-dark.c-white', 'view')
									) 

							)}
						),
						editing && m(NotesEditor, { flem: editing, done: v => {
							editing.notes = v
							editing = null
						} })
					),
					m('.link-box.bg-light.p10.b1-black.mb20',
						m('.link-header.bg-dark.c-white.flex.ac.h50.ph10',
							m('h3.mra', 'Links'),
							m('button.add-button.font-24', { onclick: addLink }, '⊕')
						),
						obj.links && obj.links.map((link) => {
							return m('.link.p6.mt20.bg-white',
								m('.top-fields.flex.ac',
									m(FormField, {
										labelClass: 'mb6',
										inputClass: 'p6 font-16 w100pct',
										type: 'text',
										placeholder: 'Link Text',
										label: 'Link Text',
										value: link.label,
										oninput: v => link.label = v
									}),
									m(FormField, {
										class: 'ml20',
										labelClass: 'mb6',
										inputClass: 'p6 font-16 w100pct',
										type: 'text',
										placeholder: 'Link URL',
										label: 'Link URL',
										value: link.url,
										oninput: v => { link.url = v }
									})
								)
							)
						})
					)
				)
			)
		}
	}
}


// TODO: dragsort flems & links (abstract the array of children from DNDList.js)
// TODO: flem and link deleters
// TODO: make sure chapter's course is currentCourse before setting currentChapter = null