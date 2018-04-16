module.exports = module.exports = {
	oncreate: ({ dom, attrs }) => {
		dom.classList.add('enter')
		if (attrs.onupdate) {
			this.onupdate = this.oncreate
		}
	},
	onbeforeremove: ({ dom }) => {
		dom.classList.add('exit')
		return new Promise((resolve) => {
			setTimeout(resolve, 800)
		})
	},
	view: ({ children }) => children
}

