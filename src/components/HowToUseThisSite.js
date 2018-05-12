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
		oncreate: _v => { window.scroll(0, 0) },
		view: _v => m(FadeComponent
			, m('#portrait.abs.t0.l0.vw100.bg-dark.flex.jc.as.oa'
				,{ style: { padding: '0 5% 5%' } }
				, m('a.abs.t10.l10[href=/]', { oncreate: m.route.link }, m(Logo, { class: 'w40 h20' }))
				, m('.lh125.c-grey'
					, m('.flex.jc.ac.mt10vw.source-code'
						, 'How to Use This Site'
					)
					, m('.flex.col.ac.mt10vw'
						, m('.rel.w90p.oh'
							, m('.fsvw3.source-code.p5p.center', 'Show the list of chapters')
							, m('.fsvw3.source-code.abs.t0.tr3.w100p.p5p.center.bg-dark'
								, { style: { left: menuOpen ? 0 : '-110%' }}
								, '( Hide the list of chapters )'
							)
						)
						, m('.menuButton.rel.w40.h40.pointer.tr3',
							{
								class: menuOpen ? 'HO' : 'HC',
								onclick: toggleMenu
							}
						)
					)
	
					, m('.flex.col.ac.mt20vw'
						, m('.rel.w90p.oh'
							, m('.fsvw3.source-code.center'
								, '( Toggle between the coding'
								, m('br')
								, 'exercises and the video )'
							)
							, m('.fsvw3.source-code.abs.l0.tr3.w100p.center.bg-dark'
								, { style: { top: isSandbox ? '-110%' : 0 } }
								, 'Toggle between the video'
								, m('br')
								, ' and the coding exercises'
							)
						)
						, m('.switch.rel.w40.h64.rad20x.pointer.tr3.mt5vw',
							{
								class: isSandbox ? 'S' : '',
								onclick: toggleSwitch
							}
						)
					)
	
	
	
						/**/
					, m('.flex.col.ac.mt10vw'
						, m('.fsvw3.source-code.p5p.center.w90p', 'Choose an exercise')
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
						, m('.fsvw3.source-code.w90p.p5p.center', 'Hack away...')
						, m('iframe.bs-5-dark[height=400][background=white].bg-white'
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
						, m('.fsvw3.source-code.w90p.p5p.center'
							, "If you're having trouble finding these features, click this help widget:"
						)
						, m('#help-widget.f2.rel.pointer',
							{
								class: happy ? 'happy' : '',
								style: {
									width: '35vw',
									height: '35vw',
									marginBottom: '100px'
								},
								onclick: _e => { happy = !happy }
							}
							, m('img.rel.w100p.h100p.tr3[src=/img/phone.png]',
								{ style: { transform : `rotateZ(${ happy ? -90 : 0 }deg)`} }
							)
							, m('img.abs.t0.l0.w100p.h100p[src=/img/eyes.png]')
							, m('img.abs.l0.w100p.tr3[src=/img/mouth.png]', {
								style: {
									top: '50%',
									transform: `scaleY(${ happy ? '-1' : '1' })`
								}
							})
						)
					)
				)
			)
		)
	}
}



