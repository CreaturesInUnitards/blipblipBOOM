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
const HowToUseThisSite = require('./HowToUseThisSite')

// necessary evil
const isMobile = (() => {
	return check((navigator.userAgent||navigator.vendor||window.opera))
	function check(a){return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))}
})()

// big shoutout to @porsager for enabling this disabling :) 
const disableFullscreenFlems = _e => {
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
	const { courseID, chapter, flem } = Actions.urlComponents()
	if (idx === +flem) return
	
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
	let wSize = { w: window.innerWidth, h: window.innerHeight }
	let sizeCheckInterval
	
	// show/hide HowToUseThisSite
	const checkForResize = () => {
		const w = window.innerWidth, h = window.innerHeight  

		if ( w !== wSize.w || h !== wSize.h) {
			Object.assign(wSize, { w: w, h: h })
			m.redraw()
		}
	}
	
	return 	{
		oninit: _v => { 
			if (isMobile) document.body.classList.add('mobile')
			document.title = `bbB! - ${State.courses[m.route.param('courseID')].data.title}`
			sizeCheckInterval = setInterval(checkForResize, 500)
		},
		onremove: _v => {
			clearInterval(sizeCheckInterval)
		},
		view: _v => {
			const { courseID, chapter: chapterIdx, screen, flem: flemIdx } = Actions.urlComponents()
			const chapter = State.chapters[chapterIdx]
			const flem = chapter.flems[flemIdx]
			const isSandbox = screen === 'sandbox'
			
			return State.courses && State.chapters && State.chapters.length
				? [
					m('main.fix.f1.flex.jc.bg-dark.vw100.vh100'
						
						// sandbox 
						, m('#sandbox.fix.w100p.vh100.pl60.t0.l0.flex'							
					
							// exercises/resources panel
							, m('.bg-panel.flex.col.jb.h100p.br-1-dark'
								, { class: isMobile ? 'w240' : 'w300' }
								, m('.oa'
									
									// exercises
									, m('.flex.jc.ac.c-white.h38', m('span.fw7.fs20', 'EXERCISES'))
									, m(''
										, chapter.flems.map((aFlem, idx) => m('.rel.flem.bs-5-dark'
											, {
												key: flem.id,
												class: aFlem === flem ? 'bg-green c-white' : 'bg-light c-dark',
												style: { zIndex: chapter.flems.length - idx },
											}
											, m('.flem-label.p10-20.fw7.pointer.flex.ac.tr3',
												{ onclick: flemNotesOut(idx) },
												`${idx + 1}. ${aFlem.label}`
											)
											,aFlem === flem && m('.notes.bg-white.c-dark.bt-1-dark.w100.oh.none'
												, { oncreate: flemNotesIn }
												, m('.p20.lh15', m.trust(aFlem.notes))
											)
										))
									)

									// resources
									, (chapter.links && chapter.links.length) && m('.mt20.pb20'
										, m('.flex.jc.ac.c-white.h38', m('span.fw7.fs20', 'RESOURCES'))
										, chapter.links.map(link => m('.p5-20'
											, m('a.c-white.underline.fs08[target=_blank]'
												, { href: link.url }
												, link.label
											))
										)
									)

								)
							)
							
							// flemsesezz
							, m('.flems.f2.rel.h100p.flex.col.jb'
								, m('.flex.h38.jb.ac.p0-20.bg-panel.c-white'
									, m('span.fs12', `${chapterIdx + 1}: ${chapter.title}`)
									, m('i.fs12', State.courses[courseID].data.title)
								)
								, m('.rel.f2'
									, { style: { height: 'calc(100% - 38px)' } }
									, State.flemReady
										? m(FadeComponent
											, { key: 'flem' }
											, m('iframe#flemFrame.w100p.h100p.bg-white'
												, {
													onload: disableFullscreenFlems,
													src: `https://tinyurl.com/${flem.url }`
													// TODO: ditch tinyurl once @porsager ships persistence
												}
											)
										)
										: m(FadeComponent
											, { key: 'fade' }
											, m('.w100p.bg-dark'
												, m(LoadingAnimation, 'loading exercise...')
											)
										)
								)
							)
						)
						
						// video player
						, m('#video.fix.w100p.vh100.t0.l0.p0-60.trVid.oh.bg-dark'
							, { class: isSandbox ? 'transY-100' : ''}
							, m('#videoContainer.rel.t0.w100p.vh100.bg-dark.flex.jc.ac.o0')
						)
					)
					
					// sandbox/video toggler
					, routedLink('a.switch.fix.l10.t80.w40.h64.rad20x'
						, {
							class: isSandbox ? 'S' : 'V',
							href: Actions.toggledUrl()
						}
					)
					
					// menu overlay
					, menuOpen && m('.fix.t0.l0.bg-black.o8.vw100.vh100.fade-in'
						, {
							onclick: _e => { menuOpen = false },
							onbeforeremove: menuExitAnimation('fade-out', 300)
						}
					)
					
					// menu
					, menuOpen && m('menu.fix.bg-dark.t0.l0.vh100.oa.p2x.pt60.pb60.flex.col.ae.slide-in'
						, {
							class: isMobile ? 'w240' : 'w300',
							onclick: _e => { menuOpen = false },
							onbeforeremove: menuExitAnimation('slide-out', 300)
						}
						// TODO: Masthead here
						, State.chapters.map((chapter, idx) => {
							const isCurrent = chapterIdx === idx
							return m('.list-item.flex.jb.ac.w100p.bs-2-black.mh64'
								, {
									class: isCurrent ? 'c-green' : 'c-white',
									style: { zIndex: State.chapters.length - idx }
								}
								
								// chapter title text
								, routedLink('a.f2.p10.fs20', { href: `/${courseID}/${idx}` }, chapter.title)
								
								// chapter video/sandbox buttons
								, m('.mla.w40.h64.flex.col.pointer'
									, routedLink('.w40.h32.bgs-cover.bgp-top'
										, {
											href: `/${courseID}/${idx}/video`,
											class: !isSandbox && isCurrent ? 'bg-yah' : 'bg-off'
										}
									)
									, routedLink('.w40.h32.bgs-cover.bgp-bot'
										, {
											href: `/${courseID}/${idx}/sandbox`,
											class: isSandbox && isCurrent ? 'bg-yah' : 'bg-off'
										}
									)
								)
							)
						})
					)
					, m('.menuButton.fix.t10.l10.w40.h40.pointer.tr3'
						, {
							class: menuOpen ? 'O l240' : 'C l0',
							onclick: toggleMenu
						}
					)
					, m('a[href=/]'
						, { oncreate: m.route.link }
						, m(Logo, { class: 'fix w40 h20 bot10 l10' })
					)
					, !(State.canPlay || isSandbox) && m(FadeComponent
						, m('.abs.t0.l0.w100p.h100p.bg-dark', m(LoadingAnimation, 'loading chapter...'))
					)
					, (wSize.w < wSize.h) && [
						m('.fix.vw100.vh100.t0.l0.bg-dark'),
						m(HowToUseThisSite)
					]
				]
				: m(LoadingAnimation, 'loading course data...')
		}
	}
}
