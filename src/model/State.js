const State = {
	chapters: [
		{
			name: 'Hello, World!',
			id: 251386037,
			flems: [
				{ name: "Using m.render", url: 'y7zau2jh' },
				{ name: "Using m.mount", url: 'ybq58myu' }
			]
		}
	],
	currentChapterIndex: 0,
	currentFlemIndex: 0,
	menuOpen: false,
	labOpen: false,
	player: null,
	toggleView: (w) => {
		const prop = w + 'Open'
		State[prop] = !State[prop]
		
		if (w === 'lab') State.player.pause()
	},
	setChapter: (n) => {
		State.currentChapterIndex = n
		State.setFlem(0)
	},
	setFlem: (n) => {
		State.currentFlemIndex = n
	}
}

module.exports = State