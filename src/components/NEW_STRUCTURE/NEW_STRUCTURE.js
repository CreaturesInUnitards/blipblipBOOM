/***********************************
*
* NEW_STRUCTURE
*
***********************************/
require("./NEW_STRUCTURE.sass")

const SiteLogo = require('../SiteLogo/SiteLogo')

const things = [
	{ name: "Hello, World!" },
	{ name: "Hyperscript" },
	{ name: "Auto-Redraw" },
	{ name: "Passing Data to Components" },
	{ name: "sepulveda" },
	{ name: "crunchy" },
	{ name: "banff" },
	{ name: "sepulveda" },
	{ name: "crunchy" },
	{ name: "banff" },
	{ name: "sepulveda" },
	{ name: "crunchy" },
	{ name: "banff" },
	{ name: "sepulveda" },
	{ name: "crunchy" },
	{ name: "banff" },
	{ name: "sepulveda" },
	{ name: "crunchy" },
	{ name: "banff" },
	{ name: "sepulveda" },
	{ name: "crunchy" },
	{ name: "banff" }
]

module.exports = () => {
	let menuOpen = false
	let sandboxOpen = false
	let current = 0
	let tooltip = null

	const bodyClass = () => {
		document.body.className = `menu-${menuOpen ? 'open' : 'closed'} sandbox-${sandboxOpen ? 'open' : 'closed'}`
	}
	
	const getMenuItem = (child) => {
		if (child.tagName === 'MENU') return false
		return child.classList.contains('menu-item') ? child : getMenuItem(child.parentNode)
	}
	
	const navClick = e => {
		const item = getMenuItem(e.target)
		if (item) {
			current = parseInt(item.getAttribute('data-idx'))
			sandboxOpen = e.target.classList.contains('code-button') 
		}
	}
	
	const hideToolTip = () => {
		document.body.removeChild(tooltip)
		tooltip = null
	}
	
	const showToolTip = (obj, e) => {
		if (tooltip) hideToolTip()
		let rect = e.target.getBoundingClientRect()
		tooltip = document.createElement('div')
		tooltip.className = `tooltip`
		tooltip.style.top = (rect.top + rect.height / 2) + 'px'
		tooltip.style.left = (rect.left + 50) + 'px'
		tooltip.textContent = obj.name
		document.body.appendChild(tooltip)
	}

	return {
		oncreate: bodyClass,
		onupdate: bodyClass,
		view(){
			return [
				m('menu.animator',
					m(SiteLogo, { size: '3.5em', width: 'calc(100% - 60px)' }),
					m('button.menu-button',
						{ onclick: () => { menuOpen = !menuOpen } },
						m('.inner')
					),
					m('nav', { onclick: navClick },
						things.map((t, idx) => m('.menu-item',
							{
								class: idx === current ? 'current' : '',
								"data-idx": idx
							},
							m('.menu-item-title.animator', t.name),
							m('.menu-item-buttons-wrapper', 
								!menuOpen 
									? { 
										onmouseenter: showToolTip.bind(null, t), 
										onmouseleave: hideToolTip 
									} 
									: null,
								m('button.video-button.animator', {
									title: `Video: ${t.name}`,
									class: idx === current && !sandboxOpen ? 'current' : ''
								}),
								m('button.code-button.animator', {
									title: `Sandbox: ${t.name}`,
									class: idx === current && sandboxOpen ? 'current' : ''
								}, '{ }')
							)
						))
					)
				),
				m('main.animator',
					m('.sled.animator',
						m('.screen.theater'),
						m('button.slider', { onclick: () => { sandboxOpen = !sandboxOpen } }),
						m('.screen.sandbox')
					),
				)
			]
		}
	}
}
