/***********************************
*
* ChapterEditor
*
***********************************/
const alf = require('../alf')
const FormField = require('../FormField/FormField')
const NotesEditor = require('./NotesEditor')
const UpdateObject = require('../Operations').UpdateObject

/*********************** GLOBAL AdminData ***********************/

let currentFlem, chapter = null, dirty = false
let dnd = { drag: null, drop: null }

const addChild = prop => _e => { 
	chapter.data[prop] = (chapter.data[prop] || [])
		.concat({ id: Date.now(), label: `New ${prop.slice(0, prop.length - 1)}`, url: '' }) 
}

const cancel = _e => { AdminData.chapterCopy = null }

const revert = _e => {
	if (confirm('Revert to saved? Changes will be lost.')) {
		AdminData.chapterCopy = alf.deepClone(AdminData.chapters[chapter.id])
	}
}

const save = _e => { UpdateObject('chapters', chapter.id, chapter.data) }

const deleteChild = (array, idx) => e => { 
	e.stopPropagation()
	chapter.data[array].splice(idx, 1) 
}

const windowClick = e => {
	if (dirty) {
		let el = e.target, all = [el.tagName]
		while (el.tagName != 'MENU' && el.tagName != 'BODY' ) {
			el = el.parentNode
			all.push(el.tagName)
		}
		if (all.indexOf('MENU') > -1) {
			if (confirm('This chapter has unsaved changes. Discard them?')) {
				AdminData.chapterCopy = null
				m.redraw()
			}
			else e.stopPropagation()
		}
	}
}

const dndClass = (item, current) => {
	const classes = []
	if (item === dnd.drag) classes.push('dragging')
	if (item === dnd.drop) classes.push('dropping')
	if (item === current) classes.push('current')
	return classes.join(' ')
}


const dragAttrs = (o, array, current) => ({
	key: o.id,
	draggable: true,
	class: dndClass(o, current),
	ondragstart: _e => { dnd.drag = o },
	ondragover: _e => { if (dnd.drag && array.indexOf(o) > -1) dnd.drop = o },
	ondragleave: _e => { dnd.drop = null },
	ondragend: _e => { dnd = { drag: null, drop: null } }
})

const dragover = e => { e.preventDefault() }
const drop = (array, saveChanges) => e => {
	e.stopPropagation()
	if (!(dnd.drag && dnd.drop)) return
	const draggedIdx = array.indexOf(dnd.drag)
	const droppedIdx = array.indexOf(dnd.drop)

	const insertionIdx = draggedIdx < droppedIdx ? droppedIdx + 1 : droppedIdx
	const deletionIdx = draggedIdx > droppedIdx ? draggedIdx + 1 : draggedIdx

	if (insertionIdx !== deletionIdx) {
		// your custom  code for updating the list goes here.
		array.splice(insertionIdx, 0, dnd.drag)
		array.splice(deletionIdx, 1)

		saveChanges()
	}
}


module.exports = v => {
	return {
		oncreate: _v => {
			window.addEventListener('click', windowClick, true)
		},
		onremove: _v => {
			window.removeEventListener('click', windowClick, true)
		},
		view: _v => {
			chapter = AdminData.chapterCopy

			const obj = chapter.data
			
			try {
				dirty = chapter && !alf.objectsAreEquivalent(obj, AdminData.chapters[chapter.id].data)
			} catch (e) {} // swallow phantom firstrun redraw
			
			return m('.editor.f1.flex.col',
				m('.editor-header.flex.ac.h50.p0-20',
					{ class: dirty ? 'bg-brick' : 'bg-grey' },
					dirty && m('h4', 'There are unsaved changes.'),
					m('button.b0.p5-20.rad4x.fs12.bg-white.c-dark.pointer.mla', { disabled: dirty, style: { opacity: dirty ? 0.25 : 1 }, onclick: cancel }, 'cancel'),
					m('button.b0.p5-20.rad4x.fs12.bg-white.c-dark.pointer.ml5', { disabled: !dirty, style: { opacity: dirty ? 1 : 0.25 }, onclick: revert }, 'revert'),
					m('button.b0.p5-20.rad4x.fs12.bg-white.c-dark.pointer.ml5', { disabled: !dirty, style: { opacity: dirty ? 1 : 0.25 }, onclick: save }, 'save')
				),
				m('.editor-content.f1.oa.p40',
					m('.top-fields.flex.ac.mb20',
						m(FormField, {
							labelClass: 'fs20 mb6',
							inputClass: 'fs20 p6 w100p b-1-grey',
							type: 'text',
							placeholder: 'Chapter Title',
							label: 'Chapter Title',
							value: obj.title,
							oninput: v => obj.title = v
						}),
						m(FormField, {
							class: 'ml20',
							labelClass: 'fs20 mb6',
							inputClass: 'fs20 p6 w100p b-1-grey',
							type: 'text',
							placeholder: 'Vimeo ID',
							label: 'Vimeo ID',
							value: obj.url || '',
							oninput: v => obj.url = v
						})
					),
					m('.flem-box.bg-light.p10.b1-dark.mb20',
						m('.flex.ac.bg-grey.c-white.p10',
							m('.fs20.mra', 'Exercises'),
							m('button.fs24.bg-none.pointer', { onclick: addChild('flems') }, '⊕')
						),
						m('',
							{
								ondragover: dragover,
								ondrop: drop(obj.flems, () => { })
							},
							obj.flems && obj.flems.map((flem, idx) => {
								const isCurrent = flem === currentFlem
								const n = idx + 1

								return m('.drag-item',
									currentFlem ? {} : dragAttrs(flem, obj.flems, currentFlem),
									m('.flem',
										isCurrent
											? m('.p10.mt20.c-white.bg-dark',
												// key is needed to keep the "close" button from propagating its bullshit
												{ key: 'open' },
												m('.fs16.mb20.flex.jb'
													, n
													, m('button.bg-none.fs-inherit.pointer', { onclick: _e => { currentFlem = null } }, '✖')
												),
												m('.top-fields.flex.ac',
													m(FormField, {
														labelClass: 'mb6',
														inputClass: 'p6 fs16 w100p c-dark',
														type: 'text',
														placeholder: 'Flem Title',
														label: 'Flem Title',
														value: flem.label,
														autofocus: true,
														oninput: v => { flem.label = v }
													}),
													m(FormField, {
														class: 'ml20',
														labelClass: 'mb6',
														inputClass: 'p6 fs16 w100p c-dark',
														type: 'text',
														placeholder: 'not including https://tinyurl.com/',
														label: 'Tinyurl',
														value: flem.url,
														oninput: v => { flem.url = v.substr(0, 8) }
													}),
													m(FormField, {
														class: 'ml20',
														labelClass: 'mb6',
														inputClass: 'p6 fs16 w100p c-dark',
														type: 'text',
														placeholder: '...if any',
														label: 'Cue Point',
														value: flem.cuepoint,
														oninput: v => {
															const n = parseInt(v)
															flem.cuepoint = (typeof n === 'number' && n === n) ? n : ''
														}
													})
												),
												m('.notes-box.mt20.bg-light.c-dark.p10',
													m('h3.mb6', 'Notes'),



													m(NotesEditor, { flem: flem, done: v => { flem.notes = v } }),


													// m('.p20.bg-grey.c-white', m.trust(flem.notes)),
													// // TODO: move the notes editor inline right fucking here



													//
													//
													// m('.mt10.flex.ac',
													// 	m('button.bg-dark.c-white.rad4x.mla.fs12.p5-20.pointer',
													// 		{ onclick: _e => { editing = flem } },
													// 		'Edit Notes'
													// 	)
													// )
												)
											)
											: m('.box.mt20.p10.b-1-grey.flex.ac',
												// key is needed to keep the "close" button from propagating its bullshit
												{ key: 'closed', onclick: _e => ( currentFlem = flem ) },
												m('.fs20.mra', flem.label),
												m('button.fs24.bg-none.c-grey.pointer.ml5', { onclick: deleteChild('flems', idx) }, '⊗')
											)

								))
							})
						),
						// editing && m(NotesEditor, { flem: editing, done: v => {
						// 	editing.notes = v
						// 	editing = null
						// } })
					),
					m('.link-box.bg-light.p10.b1-dark.mb20',
						m('.flex.ac.bg-grey.c-white.p10',
							m('.fs20.mra', 'Links'),
							m('button.fs24.bg-none.pointer', { onclick: addChild('links') }, '⊕')
						),
						m('',
							{
								ondragover: dragover,
								ondrop: drop(obj.links, () => { })
							},
							obj.links && obj.links.map((link, idx) => {
								return m('.drag-item[draggable]',
									dragAttrs(link, obj.links, null),
									m('.link.p6.mt20',
										m('.fs16.mb20.flex.jb',
											idx + 1,
											m('.fs24.bg-none.c-grey.pointer.mla', { onclick: deleteChild('links', idx) }, '⊗')
										),
										m('.top-fields.flex.ac',
											m(FormField, {
												labelClass: 'fs20 mb6',
												inputClass: 'fs20 p6 w100p b-1-grey',
												type: 'text',
												placeholder: 'Link Text',
												label: 'Link Text',
												value: link.label,
												oninput: v => link.label = v
											}),
											m(FormField, {
												class: 'ml20',
												labelClass: 'fs20 mb6',
												inputClass: 'fs20 p6 w100p b-1-grey',
												type: 'text',
												placeholder: 'Link URL',
												label: 'Link URL',
												value: link.url,
												oninput: v => { link.url = v }
											})
										)
									)
								)
							})
						)
					)
				)
			)
		}
	}
}

// TODO: add Course Editor
// TODO: add "Course Title" and "Publish" fields
// TODO: move Chapters DND list into "Course Editor"






/*
*       -------------------------------------------------------------
*       -     course title                    publish               -
*       -------------------------------------------------------------
*       -                                                           -
*       - --------------------------------------------------------- - 
*       - ------------                                              -
*       - - chapters -                                              -
*       - -          -                                              -
*       - -          -                                              -
*       - -          -                   etc.                       -
*       - -          -                                              -
*       - -          -                                              -
*       - -          -                                              -
*       - ------------                                              -
*       -------------------------------------------------------------
* 
* 
* 
* 
* 
* 
* 
* 
* */











// TODO: Vimeo player/set cue stop button, or maybe just scrub a mini of the vid? Hmm...
