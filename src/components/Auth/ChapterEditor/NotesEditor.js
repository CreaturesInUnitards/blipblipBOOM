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
			return m('.notes-editor.fix.flex.jc.ac.t0.l0.vw100.vh100.bg-dark',
				{ style: { zIndex: 1 } },
				m('.rel.p20.bg-white.rad6x',
					m('.notes-headline.fs24.mb20', 'Notes: ', m('i.fs-inherit', attrs.flem.label)),
					m('.quill-wrapper.rad6x',
						{ onclick: e => { e.stopPropagation() } },
						m('#toolbar', m('button.ql-bold', 'Bold'), m('button.ql-italic', 'i'), m('button.ql-code', 'code')),
						m('#quill.p40', m.trust(attrs.flem.notes)),
					),
					m('.abs.t10.r10.pointer', { onclick: getHtml }, '✖')
				)
			)
		}
	}
}