/***********************************
 *
 * Lab
 *
 ***********************************/
const VH = require('../../view_helpers')
const Collapsible = require('../Collapsible/Collapsible')

// big shoutout to @porsager for enabling this disabling :) 
const sendMessage = _e => {
	setTimeout(()=>{
		document.getElementById('flemFrame').contentWindow.postMessage({
			name: 'assign',
			content: {
				fullscreenButton: false
			}
		}, 'https://flems.io')
	}, 10)
}

module.exports = {
	view: _v => {
		const chapter = State.chapters[State.path.chapter]
		const flem = chapter.flems ? (chapter.flems[State.path.flem] || 0) : null

		return m('.lab.full-main.flex.pt40'
			, m('.practicum.f1.br1-dark.oya'
				, m('section.sandboxes'
					, m(Collapsible, { items: chapter.flems, label: 'label', content: 'notes' })
				)
				, m('section.resources'
					, m('h3.p10', 'Resources')
					, m('ul.m0.c-grey'
						, chapter.links.map(link =>
							m('li.p6', m('a[target=_blank].c-grey.p6', { href: link.url }, link.label))
						)
					)
				)
			)
			, m('.flems.f3.flex'
				, flem && flem.url && m(VH.fadeInOutComponent, { fadein: true, onupdate: true },
					m('iframe#flemFrame.f1.b0', { onload: sendMessage, src: 'http://tinyurl.com/' + flem.url }),
				)
			)
		)
	}
}
