module.exports = {
	fadeInOutComponent: _vnode => ({
		oncreate: ({ dom, attrs }) => {
			console.log(attrs.fadein)
			if (attrs.fadein) dom.classList.add(attrs.enterClass || 'enter')
			if (attrs.onupdate) {
				this.onupdate = this.oncreate
			}
		},
		onbeforeremove: ({ dom, attrs }) => {
			dom.classList.add(attrs.exitClass || 'exit')
			return new Promise((resolve) => {
				setTimeout(resolve, 800)
			})
		},
		view: ({ children }) => children
	})
}
