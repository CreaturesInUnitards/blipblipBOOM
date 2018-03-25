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

/*********************** GLOBAL AdminData ***********************/

let editing, currentFlem, chapter = null

const addChild = prop => _e => { 
	chapter.data[prop] = (chapter.data[prop] || [])
		.concat({ label: `New ${prop.slice(0, prop.length - 1)}` }) 
}

const cancel = _e => { chapter = null }

const revert = _e => {
	if (confirm('Revert to saved? Changes will be lost.')) {
		chapter = alf.deepClone(AdminData.chapters[chapter.id])
	}
}

const save = _e => { UpdateObject('chapters', chapter.id, chapter.data) }

const deleteChild = (array, idx) => _e => { chapter.data[array].splice(idx, 1) }

module.exports = v => {
	editing = null
	currentFlem = null
	chapter = AdminData.chapterCopy
	
	return {
		view: _v => {
			const obj = chapter.data
			let dirty = false
			
			try {
				dirty = chapter && !alf.objectsAreEquivalent(obj, AdminData.chapters[chapter.id].data)
			} catch (e) {} // swallow phantom firstrun redraw
			
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
							m('button.add-button.font-24', { onclick: addChild('flems') }, '⊕')
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
													'Edit Notes'
												)
											)											
										)
									)
									: m('.box.mt20.p10.b1-black.bg-white.flex.ac.pointer',
										m('.font-18.mra', `${n}: ${flem.label}`),
										m('button.edit-button.c-light.font-24', { onclick: _e => ( currentFlem = flem ) }, '✎'),
										m('button.delete-button.c-light.font-24', { onclick: deleteChild('flems', idx) }, '⊗')
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
							m('button.add-button.font-24', { onclick: addChild('links') }, '⊕')
						),
						obj.links && obj.links.map((link, idx) => {
							return m('.link.p6.mt20.bg-white',
								m('.flex', 
									m('button.delete-button.c-light.font-24.mla', { onclick: deleteChild('links', idx) }, '⊗')
								),
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
