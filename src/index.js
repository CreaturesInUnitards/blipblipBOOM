window.m = require('mithril')
var State = require('./model/State')
var Header = require('./components/Header/Header')
var Menu = require('./components/Menu/Menu')

require('./globals.sass')

function mainClass(){
	var classes = []
	if (State.mainMenuOpen) classes.push('open')
	if (State.exercise) classes.push('exercise')
	return classes.join(' ')
}

var App = {
	view: function(){
		return m('main'
			, { class: mainClass() }
			, m(Header)
			, m('.wrapper'
				, m('section.screencast'
					, m(Menu, { text: 'screencast' })
					, m('.content'
						, m('video[src=video/hello_world.mp4][autoplay]')
					)
				)
				, m('section.flems'
					, m(Menu, { text: 'flems' })
					, m('.content'
						, m('button', { onclick: State.toggle.bind(null, 'exercise') }, 'toggle')
						, 'here is my flems thingy'
					)
				)
			)
			, m('.overlay')
		)
	}
}

m.mount(document.body, App)