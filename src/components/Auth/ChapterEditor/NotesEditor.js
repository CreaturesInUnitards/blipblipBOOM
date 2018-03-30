const Quill = require('quill')
require('./quill.snow.sass')

module.exports = ({attrs}) => {
	let editor
	
	const getHtml = () => {
		attrs.done(editor ? editor.root.innerHTML : '')
	}
	
	return {
		oncreate(){
			editor = new Quill('#quill', {
				modules: { toolbar: '#toolbar' },
				theme: 'snow'
			})
		},
		onremove(){
			editor = null
		},
		view({attrs}) {
			return m('.notes-editor',
				{ onclick: getHtml, style: { zIndex: 1 } },
				m('.wrapper-wrapper',
					m('.notes-headline', `Notes: "${attrs.flem.label}"`),
					m('.quill-wrapper',
						{ onclick: e => { e.stopPropagation() } },
						m('#toolbar', m('button.ql-bold', 'Bold'), m('button.ql-italic', 'i')),
						m('#quill', m.trust(attrs.flem.notes)),
					),
					m('.fake-closer', '✖')
				)
			)
		}
	}
}