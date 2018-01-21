module.exports = {
	classListForMain: (state) => {
		const classes = []
		if (state.menuOpen) classes.push('menuOpen')
		if (state.labOpen) classes.push('labOpen')
		return classes.join(' ')
	},
	fadeInOutComponent: (obj, fadein) => {
		const component = {
			oncreate: (vnode) => {
				if (fadein !== false) vnode.dom.classList.add('enter')
			},
			onbeforeremove: (vnode) => {
				vnode.dom.classList.add("exit")
				return new Promise((resolve) => {
					setTimeout(resolve, 800)
				})
			}
		}
	
		Object.keys(obj).forEach(function(key){
			if (obj.hasOwnProperty(key)) {
				component[key] = obj[key]
			}
		})
	
		return component
	}
}