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

module.exports = v => {
	let editing = currentFlem = null
	
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
		view: ({attrs}) => {
			const obj = AdminData.chapterCopy.data
			
			let dirty = false
			try {
				dirty = AdminData.chapterCopy && !alf.objectsAreEquivalent(obj, AdminData.chapters[AdminData.chapterCopy.id].data)
			} catch (e) {}
			
			return m('.editor',
				{ class: dirty ? 'dirty' : '' },
				m('.done-buttons',
					m('button.editor-button', { disabled: dirty, onclick: cancel }, 'cancel'),
					m('button.editor-button', { disabled: !dirty, onclick: revert }, 'revert'),
					m('button.editor-button', { disabled: !dirty, onclick: save }, 'save'),
				),
				m('.top-fields',
					m('',
						m(FormField, {
							type: 'text',
							placeholder: 'Chapter Title',
							label: 'Chapter Title',
							value: obj.title,
							oninput: v => obj.title = v
						})
					),
					m('',
						m(FormField, {
							type: 'text',
							placeholder: 'Vimeo ID',
							label: 'Vimeo ID',
							value: obj.url,
							oninput: v => obj.url = v
						})
					)
				),
				m('.box',
					m('h3.header', 'Exercises', m('button', { onclick: addFlem }, '⊕')),
					obj.flems && obj.flems.map((flem, idx) => {
						const isCurrent = flem === currentFlem
						return m('.flem',
							{ class: isCurrent ? 'current' : '' },
							isCurrent
							? [
								m('h6', idx + 1),
								m('.top-fields',
									m('',
										m(FormField, {
											type: 'text',
											placeholder: 'Flem Title',
											label: 'Flem Title',
											value: flem.label,
											oninput: v => flem.label = v
										})
									),
									m('',
										m(FormField, {
											type: 'text',
											placeholder: 'not including https://tinyurl.com/',
											label: 'Tinyurl',
											value: flem.url,
											oninput: v => flem.url = v
										})
									),
									m('',
										m(FormField, {
											type: 'text',
											placeholder: '...if any',
											label: 'Cue Stop',
											value: flem.cuestop,
											oninput: v => flem.cuestop = v
										})
									)
								),
								m('.flem-notes',
									m('h3', { style: 'text-align: left' }, 'Notes'),
									m('', m.trust(flem.notes)),
									m('button.editor-button', { onclick: _e => { editing = flem } }, 'edit')
								)
							]
							: m('h3.closed-flem', { onclick: _e => { currentFlem = flem } }, `${idx + 1}: ${flem.label}`)
						
						)}
					),
					editing && m(NotesEditor, { flem: editing, done: v => {
						editing.notes = v
						editing = null 
					} })
				)
			)
		}
	}
}


// TODO: new flem
