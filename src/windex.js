// require('../../index.css')
// const m = require('mithril')
// const Sandbox = require('../../../Desktop/wp4/src/components/Sandbox')
// const Menu = require('../../../Desktop/wp4/src/components/Menu')
// const Logo = require('../../../Desktop/wp4/src/components/Logo')
//
// const State = {
// 	sandboxOpen: false
// }
//
// const Actions = {
// 	goHome: _e => {
// 		console.log('going home')
// 	},
// 	toggle: prop => _e => {
// 		const key = `${prop}Open`
// 		State[key] = !State[key]
// 	}
// }
//
// Object.assign(window, { m, State, Actions })
//
// const App = {
// 	view: _v => [
// 		m('main.fix.f1.flex.jc.bg-dark.vw100.vh100',
// 			m(Sandbox),
// 			m('#video.fix.w100p.vh100.t0.l0.pl60.trVid.oh',
// 				{ class: State.sandboxOpen ? 'transY-100' : ''},
// 				m('#videoContainer.fix.t0.w100p.vh100.bg-dark.flex.jc.ac',
// 					m('iframe',
// 						{ 
// 							src: "https://player.vimeo.com/video/263671735",
// 							style: {
// 								width: '100%',
// 								height: '100%',
// 								maxWidth: '100%',
// 								maxHeight: '100%',
// 								border: 0
// 							}
// 						}
// 					)
// 				)
// 			)
// 		),
// 		m('.switch', { 
// 			class: State.sandboxOpen ? 'S' : 'V',
// 			onclick: Actions.toggle('sandbox') 
// 		}),
// 		m(Menu),
// 		m(Logo)
// 	]
// }
//
//
// m.mount(document.body, App)