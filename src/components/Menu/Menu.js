/***********************************
*
* Menu
*
***********************************/
const SiteLogo = require('../SiteLogo/SiteLogo')
const VH = require('../../view_helpers')

let tooltip = null

const hideToolTip = () => {
	document.body.removeChild(tooltip)
	tooltip = null
}

const showToolTip = chapter => e => {
	let rect = e.target.getBoundingClientRect()
	
	if (!tooltip) {
		tooltip = document.createElement('div')
		tooltip.className = 'tooltip'
		tooltip.style.left = (rect.left + 50) + 'px'
	}
	
	tooltip.style.top = (rect.top + rect.height / 2) + 'px'
	tooltip.textContent = chapter.label
	document.body.appendChild(tooltip)
}

const getMenuItem = (child) => {
	if (child.tagName === 'MENU') return false
	return child.classList.contains('menu-item') ? child : getMenuItem(child.parentNode)
}

module.exports = VH.fadeInOutComponent({
	view: () => m('menu.animator',
		m(SiteLogo, { size: '3.5em', width: 'calc(100% - 60px)' }),
		m('button.menu-button',
			{ onclick: State.toggleMenu },
			m('.inner')
		),
		m('nav',
			State.chapters.map((chapter, idx) => m('.menu-item',
				{
					onclick: e => { if (e.target.tagName !== 'A') m.route.set(`/${idx}/content`) },
					// href: `/${idx}/content`,
					class: idx === State.currentChapterIndex ? 'current' : '',
				},
				m('.menu-item-title.animator', chapter.label),
				m('.menu-item-buttons-wrapper',
					!State.menuOpen
						? {
							onmouseenter: showToolTip(chapter),
							onmouseleave: hideToolTip
						}
						: null,
					m('a.video-button.animator', {
						href: `/${idx}/content`,
						oncreate: m.route.link,
						onupdate: m.route.link,
						class: idx === State.currentChapterIndex && !State.sandboxOpen ? 'current' : ''
					}),
					m('a.code-button.animator', {
						href: `/${idx}/lab`,
						oncreate: m.route.link,
						onupdate: m.route.link,
						class: idx === State.currentChapterIndex && State.sandboxOpen ? 'current' : ''
					}, '{ }')
				)
			))
		)
	)
})
