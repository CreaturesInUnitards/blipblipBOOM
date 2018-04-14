const exitAnimation = (exitClass, transitionSpeed) => vnode => {
	vnode.dom.classList.add(exitClass)
	return new Promise(resolve => {
		setTimeout(resolve, transitionSpeed)
	})
}

const routedLink = (selector, attrs, children) => {
	Object.assign(attrs, { oncreate: m.route.link, onupdate: m.route.link })
	return m(selector, attrs, children)
} 

module.exports = _v => {
	let menuOpen = false

	const toggleMenu = _e => { menuOpen = !menuOpen }

	return {
		view: () => {
			const courseID = State.path.courseID
			const currentChapter = State.path.chapter
			const isSandbox = State.path.screen === 'sandbox'

			return [
				menuOpen && m('.fix.t0.l0.bg-black.o8.vw100.vh100.fade-in',
					{
						onclick: _e => { menuOpen = false },
						onbeforeremove: exitAnimation('fade-out', 300) 
					}
				),
				menuOpen && m('menu.fix.bg-dark.t0.l0.w240.vh100.oa.p2x.pt60.flex.col.ae.slide-in',
					{ 
						onclick: _e => { menuOpen = false },
						onbeforeremove: exitAnimation('slide-out', 300) 
					},
					// TODO: Masthead here
					State.chapters.map((chapter, idx) => {
						const isCurrent = currentChapter === idx
						return m('.list-item.flex.jb.ac.w100p.bs-2-black',
							{ 
								class: currentChapter === idx ? 'c-green' : 'c-white',
								style: { zIndex: State.chapters.length - idx } 
							},
							routedLink('a.f2.p10.fs125', { href: `/${courseID}/${idx}` }, chapter.title),
							m('.mla.w40.h64.flex.col.pointer',
								routedLink('.w40.h32.bgs-cover.bgp-top'
									, { 
										href: `/${courseID}/${idx}/video`,
										class: !isSandbox && isCurrent ? 'bg-yah' : 'bg-off'
									 }
								 ),
								routedLink('.w40.h32.bgs-cover.bgp-bot'
									, {
										href: `/${courseID}/${idx}/sandbox`,
										class: isSandbox && isCurrent ? 'bg-yah' : 'bg-off'
									 }
								 )
							),
						)
					}),
				),
				m('.menuButton.fix.t0.w40.h40.pointer.tr3',
					{ 
						class: menuOpen ? 'O l240' : 'C l0',
						onclick: toggleMenu
					}
				)
			]
		}
	}
}