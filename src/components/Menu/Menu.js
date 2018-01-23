/***********************************
*
* Menu
*
***********************************/
const State = require('../../model/State')
const VH = require('../../view_helpers')
const SiteLogo = require('../SiteLogo/SiteLogo')

module.exports = {
	view: (vnode) => {
		return m('menu'
			// TODO: fix scrolling gutter
			, m('.ovf-auto'
				, State.chapters.map((chapter, cidx) => {
					const isVideo = cidx > 0
					const isCurrent = cidx === State.currentChapterIndex

					return m('.chapter'
						, {
							class: isCurrent ? 'current' : '',
							onmouseenter: () => { vnode.state.hover = chapter },
							onmouseleave: () => { vnode.state.hover = null }
						}
						, m('.label'
							, isVideo
								? [
									, m('h4.fw200.chapter-num', cidx + '.')
									, m('h4.fw200.chapter-name',  chapter.label)
								]
								: m(SiteLogo, { size: '1.5vw' })
						)
						, (vnode.state.hover === chapter || isCurrent) && m(Selector, { isVideo: isVideo, cidx: cidx, isCurrent: isCurrent })
					)

				})
			)
			, m('button.expander.show-menu'
				, {
					class: State.firstRun.menu ? 'first-run' : '',
					onclick: State.toggleView.bind(null, 'menu')
				}
			)
		)
	}
}

const Selector = VH.fadeInOutComponent({
	enterClass: 'selector-enter',
	exitClass: 'selector-exit',
	view: (vnode) => {
		const idx = vnode.attrs.cidx
		const current = State.currentChapterIndex === idx
		
		return m('.selector'
			, m('a.center.video'
				, {
					oncreate: m.route.link,
					onupdate: m.route.link,
					href: `/${idx}/content`,
					class: current && !State.labOpen ? 'selected' : '' 
				}
				, vnode.attrs.isVideo ? 'Watch the video' : 'Home'
			)
			, m('a.center.practicum'
				, {
					oncreate: m.route.link,
					onupdate: m.route.link,
					href: `/${idx}/lab`,
					class: current && State.labOpen ? 'selected' : ''
				}
				, vnode.attrs.isVideo ? 'Practice the code' : 'Sandbox'
			)
		)
	}
})