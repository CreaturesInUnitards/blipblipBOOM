const Player = require('@vimeo/player')
const VIDEO_CONTAINER_ID = 'videoContainer'

const State = {
	firstRun_menu: false,
	firstRun_lab: false,
	chapters: require('./Data'),
	canPlay: true,
	currentChapterIndex: 0,
	currentFlemIndex: 0,
	menuOpen: false,
	labOpen: false,
	player: null,
	toggleView: function(w) {
		const prop = w + 'Open'
		State[prop] = !State[prop]
		
		if (w === 'lab' && State.player) State.player.pause()
	},
	setChapter: (n) => {
		State.currentChapterIndex = n
		State.setFlem(0)
		State.loadChapter(State.chapters[n].id)
	},
	setFlem: (n) => {
		State.currentFlemIndex = n
	},
	setupPlayer: (id) => {
		const player = State.player = new Player(VIDEO_CONTAINER_ID, {id: id || State.chapters[1].id})

		player.on('ended', function () {
			State.labOpen = true
			State.menuOpen = true
			m.redraw()

			setTimeout(State.player.setCurrentTime.bind(this, 0), 1000)			
		})
		
		player.on('loaded', function() {
			console.log("video loaded")
		})
	},
	loadChapter: (id) => {
		State.canPlay = false

		if (id) {
			setTimeout(() => {
				State.canPlay = true
				m.redraw()

				setTimeout(() => {
					State.setupPlayer(id)
					document.getElementById(VIDEO_CONTAINER_ID).classList.add('enter')
				}, 800)
			}, 100)
		}

	}
}

module.exports = State