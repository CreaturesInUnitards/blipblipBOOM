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
	tooltip.textContent = chapter.title
	document.body.appendChild(tooltip)
}

module.exports = _v => {
	const courseID = State.path.courseID
	
	return {
		view: () => {
			const chapterIdx = +m.route.param('chapter') || undefined
			const isSandbox = State.path.screen === 'sandbox'
			
			return [
				m(VH.fadeInOutComponent, { fadein: true }, [
					m('menu.animator.fixed.m0.p0.flex.col.oya',
						{ class: State.menuOpen ? 'bg-grey' : '' },
						m('.flex',
							// TODO: put masthead here, e.g. "Mithril 0-60 /n by Scotty Simpson"
							m('button.menu-button',
								{ onclick: State.toggleMenu },
								m('.inner')
							)
						),
						m('nav.mt60',
							State.chapters.map((chapter, idx) => {
								const isCurrent = ( chapterIdx === undefined && idx === 0 ) || idx === chapterIdx
								return m('.menu-item.p6.flex',
									{
										onclick: e => {
											if (e.target.tagName !== 'A') m.route.set(`/${courseID}/${idx}/video`)
										},
									},
									m('.menu-item-title.mra.p10.b1-grey.brad6-l.br0.f1.fw.flex.ac.pointer',
										{ class: isCurrent ? 'bg-green c-white' : 'bg-white c-dark' },
										chapter.title
									),
									m('.menu-item-buttons-wrapper.flex.col.b1-grey.oh.bg-white',
										!State.menuOpen
											? {
												class: 'brad6 w50',
												onmouseenter: showToolTip(chapter),
												onmouseleave: hideToolTip
											}
											: { class: 'brad6-r w60' },
										m('a.video-button.animator.h40.flex.jc.ac.bb1-grey', {
											class: isCurrent && !isSandbox ? 'bg-green on' : '',
											href: `/${courseID}/${idx}/video`,
											oncreate: m.route.link,
											onupdate: m.route.link,
										}),
										m('a.code-button.animator.h40.flex.jc.ac.tx-deco-none', {
											class: isCurrent && isSandbox ? 'bg-green c-white' : 'c-dark',
											href: `/${courseID}/${idx}/sandbox`,
											oncreate: m.route.link,
											onupdate: m.route.link,
										}, '{ }')
									)
								)
							})
						)
					)
				])
		]}
	}
}
