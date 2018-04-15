module.exports = module.exports = {
	oncreate: ({ dom, attrs }) => {
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
}

