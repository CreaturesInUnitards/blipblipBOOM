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
		onremove() { editor = null },
		view({attrs}) {
			return m('',
				{ style: { zIndex: 1 } },
				m('.rel.p20.bg-white.rad6x',
					m('.quill-wrapper',
						{ onclick: e => { e.stopPropagation() } },
						m('#toolbar', m('button.ql-bold', 'Bold'), m('button.ql-italic', 'i'), m('button.ql-code', 'code')),
						m('#quill.p20', { 
							oninput: getHtml,
							onbeforeupdate: () => false
						}, m.trust(attrs.flem.notes) )
					)
				)
			)
		}
	}
}