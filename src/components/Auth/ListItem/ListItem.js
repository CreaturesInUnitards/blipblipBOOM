/***********************************
*
* ListItem
*
***********************************/
require("./ListItem.sass")

module.exports = ({attrs}) => {
	let editing = false
	let tempTitle = ''
	
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
				console.log(o)
				attrs.save(o, e.target.value)
				editing = false
				break
			}
			default: {
				tempTitle = e.target.value
			}
		}
	}
	
	return {
		view: ({attrs}) => {
			const obj = attrs.obj[attrs.key]
			return m('.item',
				{
					class: editing ? 'editing' : '',
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
							m('button.edit', { onclick: edit(obj) }, '✎'),
							m('button.delete', { onclick: attrs.remove(obj, attrs.idx) }, '⊗')

						)
					]
			)
		}
	}
}
