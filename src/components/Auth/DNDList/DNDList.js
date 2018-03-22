/***********************************
*
* DNDList
*
***********************************/
require("./DNDList.sass")
const ListItem = require('../ListItem/ListItem')

module.exports = _v => {
	let dnd = { drag: null, drop: null }

	const dndClass = (dnd, item) => 
		item === dnd.drag ? 'dragging' : item === dnd.drop ? 'dropping' : ''

	const dragAttrs = (key, array) => ({
		key: key,
		class: dndClass(dnd, key),
		ondragstart: () => { dnd.drag = key },
		ondragover: () => { if (dnd.drag && array.indexOf(key) > -1) dnd.drop = key },
		ondragend: () => { dnd = { drag: null, drop: null } }
	})

	const dragover = e => { e.preventDefault() }
	const drop = (array, saveChanges) => e => {
		e.stopPropagation()
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
		dnd = { drag: null, drop: null }
	}
	
	return {
		view: ({attrs : { header, addFn, array, saveFn, object, clickFn, titleSaveFn, removeFn }}) =>
			m('.menu',
				m('h3.menu-header', header, m('button.add', { onclick: addFn }, '⊕')),
				m('.list',
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
									obj: object,
									key: o,
									idx: idx,
									onclick: clickFn,
									save: titleSaveFn,
									remove: removeFn,
								}
							)
						)
					)
				)
			)
	}
} 


/* 

header: string in header
addFn: function for adding a thing
array: items array
saveFn: save after drop
object: object that has the roadmap
clickFn: click to select the list item
titleSaveFn: method for saving the title
removeFn: method for removing the item
 
*/