/***********************************
*
* Menu
*
***********************************/
const VH = require('../../view_helpers')

let tooltip = null

const hideToolTip = e => {
	e.stopPropagation()
	document.body.removeChild(tooltip)
}

const showToolTip = chapter => e => {
	e.stopPropagation()
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

module.exports = {
	view: () => m(VH.fadeInOutComponent, { fadein: true }, [
		m('menu.animator.fixed.m0.p0.flex.col.oya',
			m('.flex',
				// m('img[src=../../images/blipLogo.svg]'),
				m('button.menu-button',
					{onclick: State.toggleMenu},
					m('.inner')
				)
			),
			m('nav.mt60',
				State.chapters.map((chapter, idx) => {
					const isCurrent = idx === State.currentChapterIndex
					return m('.menu-item.p6.flex',
						{
							onclick: e => {
								if (e.target.tagName !== 'A') m.route.set(`/${idx}/content`)
							},
							// class: isCurrent ? 'current' : '',
						},
						m('.menu-item-title.animator.mra.p10.b1-grey.brad6-l.br0.f1.fw.flex.ac',
							{ class: isCurrent ? 'bg-dark c-green' : 'bg-white c-dark' },
							chapter.label
						),
						m('.menu-item-buttons-wrapper.flex.col.b1-grey.oh',
							!State.menuOpen
								? {
									class: 'brad6 w50',
									onmouseenter: showToolTip(chapter),
									onmouseleave: hideToolTip
								}
								: { class: 'brad6-r w60' },
							m('a.video-button.animator.h40.flex.jc.ac.bb1-grey', {
								class: isCurrent && !State.sandboxOpen ? 'bg-dark on' : '',
								href: `/${idx}/content`,
								oncreate: m.route.link,
								onupdate: m.route.link,
							}),
							m('a.code-button.animator.h40.flex.jc.ac.tx-deco-none', {
								class: isCurrent && State.sandboxOpen ? 'bg-dark c-green' : 'c-dark',
								href: `/${idx}/lab`,
								oncreate: m.route.link,
								onupdate: m.route.link,
							}, '{ }')
						)
					)
				})
			)
		)
	])
}
