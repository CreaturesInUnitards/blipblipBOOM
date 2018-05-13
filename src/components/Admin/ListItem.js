/***********************************
*
* ListItem
*
***********************************/
module.exports = _v => {
	const itemClass = obj => {
		return (obj && AdminData.chapterCopy && obj.id === AdminData.chapterCopy.id) ? 'current' : ''
	}
	
	return {
		view: ({attrs: { obj, onclick, idx }}) => {
			return m('.list-item.flex.ac.p20',
				{
					class: itemClass(obj),
					onclick: onclick(obj) 
				},
				m('.title-label.mra.fs18', obj ? obj.title : m('i', 'loading...')),
				m('.abs.fs12.c-grey', { style: { top: '2px', left: '2px' } }, idx + 1)
				// m('.flex.ac', { onclick: e => { e.stopPropagation() } },
				// 	m('button.delete-button.c-grey.bg-none.fs24.lh15.ml5.pointer', { onclick: remove(obj, collectionName, idx) }, '⊗')
				// )
			)
		}
	}
}
