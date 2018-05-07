module.exports = () => {
	let editor
	
	const getHtml = (attrs, editor) => _e => {
		attrs.done(editor.getContent())
	}
	
	return {
		oncreate({attrs}){
			if (!editor) {

				tinymce.init({
					selector: '#html-editor',
					statusbar: false,
					menubar: false,
					plugins: [ 'autoresize' ],
					autoresize_min_height: 100,
					autoresize_bottom_margin: 0,
					toolbar: 'bold italic inline-code',
					setup: editor => {
						editor.addButton('inline-code', {
							text: '{...}',
							tooltip: 'Code',
							icon: false,
							onclick: () => { editor.execCommand('FormatBlock', null, 'code') },
							onpostrender: btn => {
								editor.on('init', () => {
									editor.formatter.formatChanged('code', state => {
										btn.control.active(state)
									})
								})
							}
						})
					},
					init_instance_callback: ed => {
						editor = ed
						ed.on('keydown', getHtml(attrs, ed))
						ed.on('change', getHtml(attrs, ed))
					}
				})
			}
		},
		onremove() {
			if (editor) {
				console.log("destroying the editor")
				editor.destroy()
				editor = null
				setTimeout(m.redraw, 1000)
			}
		},
		view({attrs}) {
			return m(''
				, { style: { zIndex: 1 } }
				, m('.rel.p20.bg-white.rad6x'
					, m('.editor-wrapper'
						, m('#html-editor'
							, m.trust(attrs.flem.notes || '')
						)
					)
				)
			)
		}
	}
}
