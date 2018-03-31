/***********************************
*
* App
*
***********************************/
const Menu = require('../Menu/Menu')
const Lecture = require('../Lecture/Lecture')
const Lab = require('../Lab/Lab')
const LoadingAnimation = require('../LoadingAnimation/LoadingAnimation')
require("../../globals.sass")

module.exports = () => {
	const bodyClass = _v => {
		document.body.className = `menu-${State.menuOpen ? 'open' : 'closed'} sandbox-${m.route.param('screen') == 'sandbox' ? 'open' : 'closed'}`
	}

	return {
		oninit: _v => {
			if (State.chapters) getChapter() 
			else {
				const courseID = State.path.courseID
				firebase.firestore().collection('courses').doc(courseID).get().then(csnap => {
					const allChapters = csnap.data().children
					firebase.firestore().collection('chapters').where('parent', '==', courseID).get().then(qs => {
						State.chapters = allChapters.map(obj => qs.docs.find(o => o.id === obj.id).data())
						getChapter()
					})
				})
			}
			
			function getChapter(){
				State.loadChapter()
			}
		},
		oncreate: bodyClass,
		onupdate: bodyClass,
		view(){
			return State.courses && State.chapters
				? [
					m('main',
						m(Lab),
						m(Lecture)
					),
					m(Menu), 
					m('img#logo.pointer[src=../../images/blipLogo.svg][title=blipblipBOOM.com]', {
						onclick: _e => { State.chapters = null; m.route.set('/') }
					})
				]
				: m(LoadingAnimation)
		}
	}
}
