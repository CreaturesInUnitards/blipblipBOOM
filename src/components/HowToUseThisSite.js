const FadeComponent = require('./FadeComponent')
const Logo = require('./Logo')

module.exports = _vnode => {
	let menuOpen = false
	let isSandbox = false
	let currentFlem = 0
	
	const flemUrls = ['y75cpf8r', 'yd8tkq9q', 'yah5lu4c']
	let iframeSrc = 'https://tinyurl.com/' + flemUrls[0]
	
	let happy = false
	
	
	const fakeFlems = [
		{ title: "First exercise", notes: "These are the notes for fake exercise #1," },
		{ title: "A second thing to do", notes: "...and yes, these are the notes for fake exercise #2," },
		{ title: "More? Really?", notes: "..but no, you're mistaken if you thought these would be the notes for anything other than fake exercise #3." }
	]
	
	const toggleMenu = _e => { menuOpen = !menuOpen }
	const toggleSwitch = _e => { isSandbox = !isSandbox }


	const setDomStyle = (dom, newStyle) => {
		Object.assign(dom.style, newStyle)
	}

	const flemNotesOut = (inThing, outThing) => _e => {
		if (outThing === inThing) return
		
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
				
				currentFlem = inThing
				requestAnimationFrame(m.redraw)
			}, 400)
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
					m.redraw()
				})
			})
		})
	}


	return {
		view: _v => m(FadeComponent
			, m('#portrait.fix.vw100.vh100.bg-white.flex.jc.as.oa'
				,{ style: { padding: '0 5% 5%' } }
				, m(Logo, {
					blipColor: 'dark',
					class: 'abs t10 l10 w40 h20'
				})
				, m('.lh125'
				, m('h1.fsvw6.flex.jc.ac.mt5vw.underline'
					, 'How to Use This Site'
				)
				, m('.flex.col.ac.mt10vw'
					, m('.rel.w75p.oh'
						, m('.fsvw4.p5p.center', '1. Show the list of chapters')
						, m('.fsvw4.abs.t0.tr3.w100p.p5p.center.bg-white'
							, { style: { left: menuOpen ? 0 : '-110%' }}
							, '1. ( Hide the list of chapters )'
						)
					)
					, m('.menuButton.rel.w40.h40.pointer.tr3',
						{
							class: menuOpen ? 'HO' : 'HC',
							onclick: toggleMenu
						}
					)
				)
				, m('.flex.col.ac.mt10vw'
					, m('.rel.w75p.oh'
						, m('.fsvw4.p5p.center'
							, '( 2. Toggle between the coding'
							, m('br')
							, 'exercises and the video )'
						)
						, m('.fsvw4.abs.l0.tr3.w100p.p5p.center.bg-white'
							, { style: { top: isSandbox ? '-110%' : 0 } }
							, '2. Toggle between the video'
							, m('br')
							, ' and the coding exercises'
						)
					)
					, m('.switch.rel.w40.h64.rad20x.pointer.tr3',
						{
							class: isSandbox ? 'S' : '',
							onclick: toggleSwitch
						}
					)
				)
				, m('.flex.col.ac.mt10vw'
					, m('.fsvw4.p5p.center.w75p', '3. Choose an exercise')
					, m('.flex.jc.as.col'
						, { style: { width: '260px' } }
						, fakeFlems.map((aFlem, idx) => 
							m('.rel.fake-flem.bs-5-dark'
								, {
									key: idx,
									class: currentFlem === idx ? 'bg-green c-white' : 'bg-light c-dark',
									style: { zIndex: fakeFlems.length - idx },
								}
								, m('.flem-label.p10-20.fw7.pointer.flex.ac.tr3',
									{ onclick: flemNotesOut(idx, currentFlem) },
									`${idx + 1}. ${aFlem.title}`
								)
								, currentFlem === idx && m('.notes.bg-white.c-dark.bt-1-dark.oh.none'
								, { oncreate: flemNotesIn }
								, m('.p20', m.trust(aFlem.notes))
							)
						))
					)
				)
				, m('.flex.col.ac.mt10vw'
					, m('.fsvw4.w75p.p5p.center', '4. Hack away...')
					, m('iframe.bs-5-dark[height=400][background=white]'
						, {
							src: iframeSrc,
							onbeforeupdate: (n, o) => {
								const newSrc = 'https://tinyurl.com/' + flemUrls[currentFlem]
								if (o.dom.src !== newSrc) {
									setTimeout(() => {
										iframeSrc = newSrc
										m.redraw()
									}, 300)
								}
							}
						}
					)
				)
				, m('.flex.col.ac.mt10vw'
					, m('.fsvw4.w75p.p5p.center'
						, "5. If you're having trouble finding features 1-4, please click this help widget:"
					)
					, m('#help-widget.f2.rel.pointer.mb20',
						{
							class: happy ? 'happy' : '',
							style: {
								width: '35vw',
								height: '35vw',
							},
							onclick: _e => { happy = !happy }
						}
						, m('img.rel.w100p.h100p.tr3[src=./img/phone.png]',
							{ style: { transform : `rotateZ(${ happy ? -90 : 0 }deg)`} }
						)
						, m('img.abs.t0.l0.w100p.h100p[src=./img/eyes.png]')
						, m('img.abs.l0.w100p.tr3[src=./img/mouth.png]', {
							style: {
								top: '50%',
								transform: `scaleY(${ happy ? '-1' : '1' })`
							}
						})
					)
				)
			)
		))
	}
}



