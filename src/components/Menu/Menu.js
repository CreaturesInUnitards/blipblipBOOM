/***********************************
*
* Menu
*
***********************************/
const State = require('../../model/State')
const VH = require('../../view_helpers')


module.exports = {
	view: (vnode) => {
		return m('menu'
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
								, m('h4.chapter-num', cidx + '.')
								, m('h4.chapter-name',  chapter.label)
							] 
							: m('.menu-logo', m('i', 'm') , '(', m('i', ' Mithril { 0-60 } '), ')')
					)
					, (vnode.state.hover === chapter || isCurrent) && m(Selector, { isVideo: isVideo, cidx: cidx })
				)

			})
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
		return m('.selector'
			, { onclick: State.setChapter.bind(null, vnode.attrs.cidx) }
			, m('button.video', vnode.attrs.isVideo ? 'Watch the video' : 'Home')
			, m('button.practicum', 'Practice the code')
		)
	}
})