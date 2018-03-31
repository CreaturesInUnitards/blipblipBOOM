/***********************************
*
* ListItem
*
***********************************/
const UpdateObject = require('../Operations').UpdateObject

module.exports = ({attrs}) => {
	let editing = false
	let tempTitle = ''
	const isCourses = attrs.collectionName === 'courses'
	
	const edit = o => e => {
		tempTitle = o.title
		editing = true
	}
	
	const doneEditing = _e => ( editing = false ) 
	
	const handleStuff = o => e => {
		switch (e.which) {
			case 27: {
				doneEditing()
				break
			}
			case 13: {
				UpdateObject(attrs.collectionName, o.id, { title: e.target.value })
				doneEditing()
				break
			}
			default: {
				tempTitle = e.target.value
			}
		}
	}
	
	const itemClass = obj => {
		const classes = []
		if (editing) classes.push('editing')
		if (obj && (
			(isCourses && AdminData.courseCopy && obj.id === AdminData.courseCopy.id) || 
			(!isCourses && AdminData.chapterCopy && obj.id === AdminData.chapterCopy.id)
		)) classes.push('current')
		return classes.join(' ')
	}
	
	return {
		view: ({attrs: { obj, onclick, remove, collectionName, idx }}) => {
			return m('.list-item.flex.ac.p10',
				{
					class: itemClass(obj),
					onclick: onclick(obj) 
				},
				editing
					? m('.w100pct',
						m('input[autofocus].w100pct.mb6.font-16', {
							oncreate: _v => { tempTitle = obj.title; m.redraw() },
							onremove: _v => { tempTitle = '' },
							onblur: doneEditing,
							value: tempTitle,
							onkeydown: handleStuff(obj)
						}),
						m('', m('i.flex.jc.font-12', '[ret] = save, [esc] = cancel'))
					)
					: [
						m('.title-label.mra.font-18', obj ? obj.title : m('i', 'loading...')),
						m('.flex.ac', { onclick: e => { e.stopPropagation() } },
							isCourses && m('button.edit-button.c-light.font-24', { onclick: edit(obj) }, '✎'),
							m('button.delete-button.c-light.font-24', { onclick: remove(obj, collectionName, idx) }, '⊗')
						)
					]
			)
		}
	}
}
