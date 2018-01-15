var State = {
	chapters: [
		{
			name: 'hello_world',
			intro: "",
			flems: [
				{ name: "Using m.render", url: 'y7zau2jh' },
				{ name: "Using m.mount", url: 'ybq58myu' }
			]
		},
		{
			name: 'suck_it',
			intro: "",
			flems: [
				{ name: "Using m.render", url: 'y7zau2jh' },
				{ name: "Using m.mount", url: 'ybq58myu' }
			]
		}
	],
	currentChapterIndex: 0,
	currentFlemIndex: 0,
	menuOpen: false,
	exercise: false,
	toggle: function (w) {
		State[w] = !State[w]
	},
	screenName: function (chapter) {
		return chapter.name
			.split('_')
			.map(function (word) {
				return word[0].toUpperCase() + word.substr(1)
			})
			.join(' ')
	},
	setChapter: function (n) {
		State.currentChapterIndex = n
		State.setFlem(0)
	},
	setFlem: function (n) {
		State.currentFlemIndex = n
	}
}

module.exports = State