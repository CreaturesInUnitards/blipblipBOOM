/***********************************
*
* DNDList
*
***********************************/
const ListItem = require('../ListItem/ListItem')

module.exports = _v => {
	let current = null
	let dnd = { drag: null, drop: null }

	const dndClass = (dnd, item) => {
		const classes = []
		if (item === dnd.drag) classes.push('dragging')
		if (item === dnd.drop) classes.push('dropping')
		if (item === current) classes.push('current')
		return classes.join(' ')
	}

	const dragAttrs = (o, array) => ({
		key: o.id,
		class: dndClass(dnd, o),
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
			array.splice(insertionIdx, 0, dnd.drag)
			array.splice(deletionIdx, 1)

			saveChanges()
		}
	}
	
	return {
		view: ({attrs : { header, addFn, array, saveFn, clickFn, titleSaveFn, removeFn }}) =>
			m('menu.admin-menu.flex.col.w240.m0.p0.br-1-dark',
				m('.menu-header.flex.ac.bg-grey.c-white.p10',
					m('.fs20.mra', header),
					m('button.fs24.bg-none.pointer', { onclick: addFn }, '⊕')
				),
				//
				m('.list.f1.bg-light.oa',
					{
						ondragover: dragover,
						ondrop: drop(array, saveFn)
					},
					array && array.map((o, idx) =>
						m('.drag-item[draggable]',
							dragAttrs(o, array),
							m(ListItem,
								{
									collectionName: header.toLowerCase(),
									obj: o,
									key: o.id,
									idx: idx,
									onclick: clickFn,
									remove: removeFn,
								}
							)
						)
					)
				)
			)
	}
} 
