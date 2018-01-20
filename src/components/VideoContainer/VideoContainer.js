/***********************************
*
* VideoContainer
*
***********************************/
module.exports = {
	onbeforeremove: (vnode) => {
		vnode.dom.classList.add("exit")
		return new Promise((resolve) => {
			setTimeout(resolve, 800)
		})
	},
	view: (vnode) => {
		return m('#videoContainer', vnode.children)
	}
}
