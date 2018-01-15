var State = require('../../model/State')
require('./Header.sass')

module.exports = {
	view: function(){
		return m('header'
			, m('h1', 'Mithril 0-60')
			, m('button.burger', { onclick: State.toggle.bind(null, 'mainMenuOpen') })
		)
	}
}