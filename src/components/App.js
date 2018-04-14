/***********************************
*
* App
*
***********************************/
// const Menu = require('../../New_Components/Menu')
// const Menu = require('./Menu')
// const Sandbox = require('./Sandbox')
// const Lab = require('./Lab/Lab')
const Logo = require('./Logo')
const LoadingAnimation = require('./LoadingAnimation')
const VH = require('../view_helpers')

// big shoutout to @porsager for enabling this disabling :) 
const sendMessage = _e => {
	setTimeout(()=>{
		document.getElementById('flemFrame').contentWindow.postMessage({
			name: 'assign',
			content: {
				fullscreenButton: false
			}
		}, 'https://flems.io')
	}, 10)
}


/*
SETUP:

1. display: none; position: absolute; opacity: 0; height: auto; transition: 0

IN:

1. display: block
2. wait a tick, then:
3. get height
4. set display: block; position: relative; opacity: 1; height: 0; transition: 0.3s
5. wait a tick, then:
6. set height

OUT:

1. height: 0
2. wait 300, then:
3. display: none; position: absolute; opacity: 0; height: auto; transition: 0

* */

const setDomStyle = (dom, newStyle) => {
	Object.assign(dom.style, newStyle)
}

const animateOut = idx => _e => {
	console.log("animating out")
	const dom = document.querySelectorAll('.flem .notes')[State.path.flem]
	const newHeight = dom.offsetHeight
	setDomStyle(dom, { display: 'block', position: 'relative', transition: '0.3s', opacity: 1, height: newHeight + 'px' })
	requestAnimationFrame(() => {
		setDomStyle(dom, { height: 0 })
		setTimeout(() => {
			setDomStyle(dom, {
				display: 'none',
				position: 'absolute',
				opacity: 0,
				height: 'auto',
				transition: '0s'
			})
			history.pushState('', '', idx)
			State.path.flem = idx
			animateIn()
		}, 300)
	})
}

const animateIn = e => {
	const dom = document.querySelectorAll('.flem .notes')[State.path.flem]
	if (!dom)requestAnimationFrame(animateIn)
	else {
		setDomStyle(dom, { display: 'block' })
		requestAnimationFrame(() => { 
			const newHeight = dom.offsetHeight
			setDomStyle(dom, { position: 'relative', transition: '0.3s', opacity: 1, height: 0 })
			requestAnimationFrame(() => { 
				setDomStyle(dom, { height: newHeight + 'px' })
			})
		})
	}

	// 1. display: block
	// 2. wait a tick, then:
	// 3. get height
	// 4. set position: relative; opacity: 1; height: 0; transition: 0.3s
	// 5. wait a tick, then:
	// 6. set height
	//

}

const menuExitAnimation = (exitClass, transitionSpeed) => vnode => {
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
	const toggleMenu = _e => { menuOpen = !menuOpen }
	let menuOpen = false
	
	return 	{
		// oninit: _v => {
		// 	window.addEventListener('ShowFlemNotes', animateIn)
		// },
		// onremove: _v => {
		// 	window.removeEventListener('ShowFlemNotes', animateIn)
		// },
		view: _v => {
			const { courseID, chapter: chapterIdx, screen, flem: flemIdx } = State.path
			const chapter = State.chapters[chapterIdx]
			const flem = chapter.flems[flemIdx]
			const isSandbox = screen === 'sandbox'
			

			return State.courses && State.chapters
				? [
					m('main.fix.f1.flex.jc.bg-dark.vw100.vh100',
						m('#sandbox.fix.w100p.vh100.pl60.t0.l0.flex',
							m('.w240.oa.bg-black',
								m('.flex.jc.ac.c-green.bg-black.h38', m('span.fw7.fs125', 'EXERCISES')),
								m('.flex.col',
									chapter.flems.map((aFlem, idx) => m('.rel.flem.bg-green.bs-5-dark',
										{
											key: flem.id,
											class: aFlem === flem ? 'bg-flem' : 'bg-green',
											style: { zIndex: chapter.flems.length - idx },
										},
										m('.flem-label.p10-20.fw7.c-white.pointer.flex.ac',
											{ onclick: animateOut(idx) },
											aFlem.label
										),
										// m('.flem-label.p10-20.fw7.c-white.pointer.flex.ac',
										// 	{ onclick: animateOut(`/${courseID}/${chapterIdx}/sandbox/${idx}`) },
										// 	aFlem.label
										// ),
										 m('.notes.bg-white.bt-1-dark.w100.oh',
											{ style: aFlem === flem ? {
												// display: 'none',
												// position: 'absolute',
												// opacity: 0, 
												// height: 'auto',
												// transition: '0s'
											} : { display: 'none' } },
											m('.p20', m.trust(aFlem.notes))
										)
									))
								),
								m('.flex.jc.ac.c-green.bg-black.h38', m('span.fw7.fs125', 'RESOURCES')),
								m('.bg-black',
									chapter.links.map(link => m('.p10-20',
										m('a.c-white[target=_blank]',
											{ href: link.url },
											link.label
										))
									)
								)
							),
							m('.flems.f2.bg-white',
								flem.url
									? m('iframe#flemFrame.w100p.h100p', {
										onload: sendMessage,
										src: `https://tinyurl.com/${flem.url}`
									})
									: m(LoadingAnimation)
							),
						),
						m('#video.fix.w100p.vh100.t0.l0.pl60.trVid.oh',
							{ class: isSandbox ? 'transY-100' : ''},
							State.canPlay
								? m('#videoContainer.fix.t0.w100p.vh100.bg-dark.flex.jc.ac')
								: m(VH.fadeInOutComponent, { fadein: true }, m(LoadingAnimation)),
						)
					),
					m('.switch', {
						class: isSandbox ? 'S' : 'V',
						onclick: State.toggleUrl
					}),
					[
						menuOpen && m('.fix.t0.l0.bg-black.o8.vw100.vh100.fade-in',
							{
								onclick: _e => { menuOpen = false },
								onbeforeremove: menuExitAnimation('fade-out', 300)
							}
						),
						menuOpen && m('menu.fix.bg-dark.t0.l0.w240.vh100.oa.p2x.pt60.flex.col.ae.slide-in',
							{
								onclick: _e => { menuOpen = false },
								onbeforeremove: menuExitAnimation('slide-out', 300)
							},
							// TODO: Masthead here
							State.chapters.map((chapter, idx) => {
								const isCurrent = chapterIdx === idx
								return m('.list-item.flex.jb.ac.w100p.bs-2-black',
									{
										class: chapterIdx === idx ? 'c-green' : 'c-white',
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
					],
					m(Logo)
				]
				: m(LoadingAnimation)
		}
	}
}
