// const LoadingAnimation = require('./LoadingAnimation')
// const VH = require('../view_helpers')
//
// let flemUrl = null // temp bucket for collapsible animation
//
// // big shoutout to @porsager for enabling this disabling :) 
// const sendMessage = _e => {
// 	setTimeout(()=>{
// 		document.getElementById('flemFrame').contentWindow.postMessage({
// 			name: 'assign',
// 			content: {
// 				fullscreenButton: false
// 			}
// 		}, 'https://flems.io')
// 	}, 10)
// }
//
// const setDomStyle = (dom, newStyle) => {
// 	Object.assign(dom.style, newStyle)
// }
//
// const COLLAPSIBLE_SPEED = 300
// const animateIn = flem => ({ dom }) => {
// 	const height = dom.getBoundingClientRect().height
// 	setDomStyle(dom, { height: 0, position: 'relative', transition: '0.3s' })
// 	requestAnimationFrame(() => {
// 		setDomStyle(dom, { height: height + 'px', opacity: 1 })
// 		setTimeout(() => {
// 			flemUrl = flem.url
// 			m.redraw()
// 		}, COLLAPSIBLE_SPEED)
// 	})	
// }
//
// const animateOut = ({ dom }) => {
// 	flemUrl = null
// 	m.redraw()
// 	setDomStyle(dom, { height: 0 })
// 	dom.style.height = 0
// 	return new Promise(kill => {
// 		setTimeout(kill, COLLAPSIBLE_SPEED)
// 	})
// }
//
// module.exports = {
// 	// oncreate: vnode => { setCurrentFlem(0)() },
// 	view: vnode => {
// 		const { courseID, chapter: chapterIdx, flem: flemIdx} = State.path
// 		const chapter = State.chapters[chapterIdx]
// 		const flem = chapter.flems[flemIdx]
//
// 		return m('#sandbox.fix.w100p.vh100.pl60.t0.l0.flex',
// 			m('.w240.oa.bg-black',
// 				m('.flex.jc.ac.c-green.bg-black.h38', m('span.fw7.fs125', 'EXERCISES')),
// 				m('.flex.col',
// 					chapter.flems.map((aFlem, idx) => m('.rel.flem.bg-green.bs-5-dark',
// 						{ 
// 							class: aFlem === flem ? 'bg-flem' : 'bg-green',
// 							style: { zIndex: chapter.flems.length - idx } 
// 						},
// 						m('a.flem-label.p10-20.fw7.c-white.pointer.flex.ac', 
// 							{ href: `/${courseID}/${chapter}/sandbox/${idx}` }, 
// 							aFlem.label
// 						),
// 						aFlem === flem && m('.notes.bg-white.bt-1-dark.abs.w100.oh.o0',
// 							{ oncreate: animateIn(flem), onbeforeremove: animateOut },
// 							m('.p20', m.trust(flem.notes))
// 						)
// 					))
// 				),
// 				m('.flex.jc.ac.c-green.bg-black.h38', m('span.fw7.fs125', 'RESOURCES')),
// 				m('.bg-black',
// 					chapter.links.map(link => m('.p10-20',
// 						m('a.c-white[target=_blank]',
// 							{ href: link.url },
// 							link.label
// 						))
// 					)
// 				)
// 			),
// 			flemUrl 
// 				? m('.flems.f2.bg-white',
// 					m('iframe#flemFrame.w100p.h100p', {
// 						onload: sendMessage, 
// 						src: `https://tinyurl.com/${flemUrl}`
// 					})
// 				)
// 				: m(LoadingAnimation)
// 		)
// 	}
// }