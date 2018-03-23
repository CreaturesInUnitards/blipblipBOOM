/***********************************
*
* ListItem
*
***********************************/
require("./ListItem.sass")

module.exports = ({attrs}) => {
	let editing = false
	let tempTitle = ''
	const isCourses = attrs.collectionName === 'courses'
	let obj
	
	const edit = o => e => {
		tempTitle = o.title
		editing = true
	}
	
	const handleStuff = o => e => {
		switch (e.which) {
			case 27: {
				editing = false
				break
			}
			case 13: {
				attrs.save(attrs.collectionName, o.id, { title: e.target.value })
				editing = false
				break
			}
			default: {
				tempTitle = e.target.value
			}
		}
	}
	
	const itemClass = () => {
		const classes = []
		if (editing) classes.push('editing')
		if (obj && (
			(isCourses && AdminData.courseCopy && obj.id === AdminData.courseCopy.id) || 
			(!isCourses && AdminData.chapterCopy && obj.id === AdminData.chapterCopy.id)
		)) classes.push('current')
		return classes.join(' ')
	}
	
	return {
		view: ({attrs}) => {
			obj = attrs.obj[attrs.key]
			return m('.item',
				{
					class: itemClass(),
					onclick: attrs.onclick(obj) 
				},
				editing
					? [
						m('input[autofocus]', {
							oncreate: _v => { tempTitle = obj.data.title; m.redraw() },
							onremove: _v => { tempTitle = '' },
							value: tempTitle, 
							onkeydown: handleStuff(obj) 
						}),
						m('', m('i.hint', '[ret] = save, [esc] = cancel'))
					]
					: [
						m('span.text', obj ? obj.data.title : m('i', 'loading...')),
						m('.button-wrapper', { onclick: e => { e.stopPropagation() } },
							isCourses && m('button.edit', { onclick: edit(obj) }, '✎'),
							m('button.delete', { onclick: attrs.remove(obj, attrs.idx) }, '⊗')

						)
					]
			)
		}
	}
}
