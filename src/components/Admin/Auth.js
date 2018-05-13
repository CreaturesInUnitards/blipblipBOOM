/***********************************
*
* Auth
*
***********************************/
const Logo = require('../Logo')
module.exports = _v => {
	const creds = { email: '', password: '' }
	let tries = 0
	let trying = false
	let badCreds = false
	
	const signIn = () => {
		firebase.auth().signInWithEmailAndPassword(creds.email, creds.password)
			.then(_data => { trying = badCreds = false; m.route.set('/dashboard') })
			.catch(_e => {
				Object.assign(creds, { email: '', password: '' })
				document.querySelector('[type=email]').focus()
				trying = false
				badCreds = true
				m.redraw()
			})
	}
	
	const handleKeyDown = e => {
		if (e.which === 13) {
			tries++
			trying = true
			signIn()
		}
	}
	
	return {
		view: () =>
			m('.auth.fix.vw100.vh100.flex.jc.ac.bg-dark',
				m('.login.flex.col',
					{ onkeydown: handleKeyDown }
					, m('a.flex.jc.w100p[href=/]', { oncreate: m.route.link }, m(Logo, { class: 'w60 h30' }))
					, m('input.mt20.fs24.p10-20.rad4x[type=email][placeholder=email][autofocus]'
						, { 
							class: (creds.email === '' && tries > 0) ? 'error' : '',
							value: creds.email, 
							oninput: m.withAttr('value', v => creds.email = v) 
						}
					)
					, m('input.fs24.p10-20.mt10.rad4x[type=password][placeholder=password]'
						, { 
							class: (creds.password === '' && tries > 0) ? 'error' : '',
							value: creds.password, 
							oninput: m.withAttr('value', v => creds.password = v) 
						}
					)
					// ************ AUTO LOGIN HERE *************
					, trying && m('i.mt10.c-white.center', 'logging in...')
					, (!trying && badCreds) && m('.mt10.c-brick.center', 'Bad Creds. BAD.')
					, !(trying || badCreds) && m('.mt10', m.trust('&nbsp;')) 
				)
			)
	}
}
