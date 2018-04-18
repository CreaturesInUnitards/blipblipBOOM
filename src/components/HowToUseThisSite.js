const FadeComponent = require('./FadeComponent')

const flemNotesOut = (outThing, inThing) => _e => {
	const dom = document.querySelector('.fake-flem .notes')
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

module.exports = ({state}) => {
	let menuOpen = false
	let isSandbox = false
	let currentFlem = 0
	
	const testFlems = [
		{ title: "First exercise", notes: "These are the notes for exercise 1," },
		{ title: "A second thing to do", notes: "...and yes, these are the notes for exercise 2," },
		{ title: "aaaaand finally", notes: "..but no, you're mistaken if you thought these would be the notes for anything other than exercise 3." }
	]
	const toggleMenu = _e => { menuOpen = !menuOpen }
	const toggleSwitch = _e => { isSandbox = !isSandbox }
	
	return {
		view: _v => m(FadeComponent, m('#portrait.fix.vw100.vh100.bg-brick.c-white.flex.jc.as.p10p',
			m('',
				m('h1.fsvw8.center', 'How to Use This Site'),
				m('.bg-dark.p10p.rad6x.c-white',
					// here is a row
					m('.flex.jb',
						m('.f1.flex.jc.ac',
							m('.menuButton.rel.w40.h40.pointer.tr3',
								{
									class: menuOpen ? 'HO' : 'HC',
									onclick: toggleMenu
								}
							)
						),
						m('.f5.flex.js.ac.wrap',
							m('.fsvw35.p5p', menuOpen ? 'Hide the list of chapters' : 'Show the list of chapters')
						)
					),
					m('.flex.jb',
						m('.f1.flex.jc.ac',
							m('.switch.rel.w40.h64.rad20x.pointer.tr3',
								{
									class: isSandbox ? 'S' : '',
									onclick: toggleSwitch
								}
							)
						),
						m('.f5.flex.js.ac.wrap',
							m('.fsvw35.p5p', isSandbox ? "Toggle between the coding exercises and the video" : 'Toggle between the video and the coding exercises')
						)
					),
					m('.flex.jb',
						m('.f1.flex.jc.ac',
							testFlems.map((aFlem, idx) => m('.rel.fake-flem.bs-5-dark',
								{
									key: idx,
									class: currentFlem === idx ? 'bg-green c-white' : 'bg-flem c-dark',
									style: { zIndex: testFlems.length - idx },
								},
								m('.flem-label.p10-20.fw7.pointer.flex.ac.tr3',
									{ onclick: fakeNotesOut(idx) },
									`${idx + 1}. ${aFlem.title}`
								),
								currentFlem === idx && m('.notes.bg-white.c-dark.bt-1-dark.w100.oh.none',
									{ oncreate: fakeNotesIn },
									m('.p20.lh15', m.trust(aFlem.notes))
								)
							))						),
						m('.f5.flex.js.ac.wrap',
							m('.fsvw35.p5p', isSandbox ? "Toggle between the coding exercises and the video" : 'Toggle between the video and the coding exercises')
						)
					),
					// /row
				)
			)
		))
	}
}


