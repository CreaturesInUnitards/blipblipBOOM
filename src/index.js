window.m = require('mithril')
var State = require('./model/State')
var Header = require('./components/Header/Header')
var Menu = require('./components/Menu/Menu')
var Video = require('./components/Video/Video')

require('./globals.sass')

function mainClass(){
	var classes = []
	if (State.menuOpen) classes.push('open')
	if (State.exercise) classes.push('exercise')
	return classes.join(' ')
}

var App = {
	view: function(){
		var chapter = State.chapters[State.currentChapterIndex]
		var flem = chapter.flems[State.currentFlemIndex]
		return m('main'
			, { class: mainClass() }
			, m(Header)
			, m('.wrapper'
				, m('section.screencast'
					, m(Menu
						, {
							collection: State.chapters,
							screenName: State.screenName,
							onclick: State.setChapter
						}
					)
					, m('.content'
						, m(Video
							, {
								file: chapter.name,
								ended: function () {
									State.menuOpen = true
									State.exercise = true
								}
							}
						)
					)
				)
				, m('section.flems'
					, m(Menu
						, {
							intro: chapter,
							collection: chapter.flems,
							screenName: function (obj) {
								return obj.name
							},
							onclick: State.setFlem
						}
					)
					, m('.content'
						, m('iframe'
							, { src: 'http://tinyurl.com/' + flem.url }
						)
					)
				)
			)
		)
	}
}

m.mount(document.body, App)