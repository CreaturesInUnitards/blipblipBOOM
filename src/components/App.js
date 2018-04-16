/***********************************
*
* App
*
***********************************/
const State = require('../model/State')
const Actions = require('../model/Actions')
const Logo = require('./Logo')
const LoadingAnimation = require('./LoadingAnimation')
const FadeComponent = require('./FadeComponent')

// big shoutout to @porsager for enabling this disabling :) 
const sendMessage = _e => {
	setTimeout(() => {
		document.getElementById('flemFrame').contentWindow.postMessage({
			name: 'assign',
			content: {
				fullscreenButton: false
			}
		}, 'https://flems.io')
	}, 250)
}

// helpers
const setDomStyle = (dom, newStyle) => {
	Object.assign(dom.style, newStyle)
}

const routedLink = (selector, attrs, children) => {
	Object.assign(attrs, { oncreate: m.route.link, onupdate: m.route.link })
	return m(selector, attrs, children)
}

// programmatic animations
const flemNotesOut = idx => _e => {
	State.flemReady = false
	const dom = document.querySelector('.flem .notes')
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
			const { courseID, chapter } = Actions.urlComponents()
			m.route.set(`/${courseID}/${chapter}/sandbox/${idx}`)
		}, 300)
	})
}

const flemNotesIn = ({dom}) => {
	requestAnimationFrame(() => {
		setDomStyle(dom, { position: 'absolute', opacity: 0, display: 'block', height: 'auto' })
		requestAnimationFrame(() => {
			const newHeight = dom.offsetHeight
			setDomStyle(dom, { position: 'relative', transition: '0.3s', opacity: 1, height: 0 })
			requestAnimationFrame(() => {
				setDomStyle(dom, { height: newHeight + 'px' })
				setTimeout(() => { 
					State.flemReady = true
					m.redraw()
				}, 300)
			})
		})
	})
}

const menuExitAnimation = (exitClass, transitionSpeed) => vnode => {
	vnode.dom.classList.add(exitClass)
	return new Promise(resolve => {
		setTimeout(resolve, transitionSpeed)
	})
}


module.exports = _v => {
	// transient state
	const toggleMenu = _e => { menuOpen = !menuOpen }
	let menuOpen = false
	
	return 	{
		oninit: _v => { document.title = `bbB! - ${State.courses[m.route.param('courseID')].data.title}` },
		view: _v => {
			const { courseID, chapter: chapterIdx, screen, flem: flemIdx } = Actions.urlComponents()
			const chapter = State.chapters[chapterIdx]
			const flem = chapter.flems[flemIdx]
			const isSandbox = screen === 'sandbox'
			

			return State.courses && State.chapters && State.chapters.length
				? [
					m('main.fix.f1.flex.jc.bg-dark.vw100.vh100',
						
						// sandbox 
						m('#sandbox.fix.w100p.vh100.pl60.t0.l0.flex',
							
							// exercises/resources panel
							m('.w240.bg-panel.flex.col.jb.h100',
								
								// exercises
								m('.oa',
									m('.flex.jc.ac.c-white.h38', m('span.fw7.fs125', 'EXERCISES')),
									m('',
										chapter.flems.map((aFlem, idx) => m('.rel.flem.bs-5-dark',
											{
												key: flem.id,
												class: aFlem === flem ? 'bg-flem' : 'bg-green',
												style: { zIndex: chapter.flems.length - idx },
											},
											m('.flem-label.p10-20.fw7.c-white.pointer.flex.ac.tr3',
												{ onclick: flemNotesOut(idx) },
												`${idx + 1}. ${aFlem.label}`
											),
											aFlem === flem && m('.notes.bg-white.bt-1-dark.w100.oh.none',
												{ oncreate: flemNotesIn },
												m('.p20.lh15', m.trust(aFlem.notes))
											)
										))
									)
								),
								
								// resources
								m('.pb20',
									m('.flex.jc.ac.c-white.h38', m('span.fw7.fs125', 'RESOURCES')),
									chapter.links.map(link => m('.p5-20',
										m('a.c-white.underline.fs08[target=_blank]',
											{ href: link.url },
											link.label
										))
									)
								)
							),
							
							// flemsesezz
							m('.flems.f2.rel.h100p',
								State.flemReady
									? m(FadeComponent, { fadein: true }, m('iframe#flemFrame.w100p.h100p.bg-white', {
										onload: sendMessage, // disable fullscreen flemses
										src: `https://tinyurl.com/${flem.url }`
										// TODO: ditch tinyurl once @porsager ships persistence
									})) 
									: m(LoadingAnimation, m('', 'loading flemses'))
							),
						),
						
						// video player
						m('#video.fix.w100p.vh100.t0.l0.pl60.trVid.oh.bg-dark',
							{ class: isSandbox ? 'transY-100' : ''},
							m('#videoContainer.rel.t0.w100p.vh100.bg-dark.flex.jc.ac.o0'),
							State.canPlay || m(FadeComponent, { fadein: true }, m('.abs.t0.l0.w100p.h100p.bg-dark', m(LoadingAnimation, m('.c-green', 'loading wideo'))))
						)
					),
					
					// sandbox/video toggler
					routedLink('a.switch', {
						class: isSandbox ? 'S' : 'V',
						href: Actions.toggleUrl(),
					}),
					
					// menu overlay
					menuOpen && m('.fix.t0.l0.bg-black.o8.vw100.vh100.fade-in',
						{
							onclick: _e => { menuOpen = false },
							onbeforeremove: menuExitAnimation('fade-out', 300)
						}
					),
					
					// menu
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
									class: isCurrent ? 'c-green' : 'c-white',
									style: { zIndex: State.chapters.length - idx }
								},
								
								// chapter title text
								routedLink('a.f2.p10.fs125', { href: `/${courseID}/${idx}` }, chapter.title),
								
								// chapter video/sandbox buttons
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
					),
					m(Logo)
				]
				: m(LoadingAnimation)
		}
	}
}
