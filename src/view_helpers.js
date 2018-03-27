module.exports = {
	fadeInOutComponent: _vnode => ({
		oncreate: ({ dom, attrs }) => {
			console.log('creating', dom)
			if (attrs.fadein) dom.classList.add(attrs.enterClass || 'enter')
			if (attrs.onupdate) {
				this.onupdate = this.oncreate
			}
		},
		onremove: ({dom}) => { console.log('removed', dom) },
		onbeforeremove: ({ dom, attrs }) => {
			console.log('removing!')
			dom.classList.add(attrs.exitClass || 'exit')
			return new Promise((resolve) => {
				setTimeout(resolve, 800)
			})
		},
		view: ({ children }) => children
	})
}
