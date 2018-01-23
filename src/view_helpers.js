module.exports = {
	fadeInOutComponent: (obj, fadein) => {
		const component = {
			oncreate: (vnode) => {
				if (fadein !== false) vnode.dom.classList.add(obj.enterClass || 'enter')
			},
			onbeforeremove: (vnode) => {
				vnode.dom.classList.add(obj.exitClass || 'exit')
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