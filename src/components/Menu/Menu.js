/***********************************
*
* Menu
*
***********************************/
const SiteLogo = require('../SiteLogo/SiteLogo')

module.exports = {
	view: () => {
		return m('menu'
			, m('.menu-sled.ovf-auto.height100pct'
				, State.chapters.map((chapter, idx) => {
					const isCurrent = idx === State.currentChapterIndex
					const isWelcome = idx === 0
					return m('.chapter'
						, { class: isCurrent ? 'current' : '' }
						, m('.label'
							, idx === 0
								? m(SiteLogo, { size: '1.5vw', width: '17vw' })
								: m('.text-container'
									, m('h5.fw200.chapter-num', !isWelcome && (idx + '.'))
									, m('h5.fw200.chapter-name', chapter.label)
								) 
								
						)
						, m('.elevator'
							, m('a.content'
								, {
									href: `/${idx}/content`,
									oncreate: m.route.link,
									onupdate: m.route.link,
									class: isCurrent && !State.labOpen ? 'selected' : ''
								}
							)
							, m('a.lab'
								, {
									href: `/${idx}/lab `,
									oncreate: m.route.link,
									onupdate: m.route.link,
									class: isCurrent && State.labOpen ? 'selected' : ''
								}
							)
						)
					)

				})
			)
			, m('button.expander.show-menu'
				, { onclick: State.toggleMenu }
			)
		)
	}
}
