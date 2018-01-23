const Player = require('@vimeo/player')
const VIDEO_CONTAINER_ID = 'videoContainer'

const State = {
	chapters: require('./Data'),
	canPlay: false,
	currentChapterIndex: 0,
	currentFlemIndex: 0,
	menuOpen: false,
	labOpen: false,
	player: null,
	setFlem: (n) => { State.currentFlemIndex = n },
	setupPlayer: (id) => {
		const player = State.player = new Player(VIDEO_CONTAINER_ID, {id: id || State.chapters[1].id})

		player.on('ended', function () {
			State.labOpen = true
			State.menuOpen = true
			m.redraw()

			setTimeout(State.player.setCurrentTime.bind(this, 0), 1000)			
		})
		
		player.on('loaded', function() {
			const chapter = State.chapters[State.currentChapterIndex]
			let cuepointCount = 0
			chapter.flems.forEach(function(flem){
				if (flem.cuepoint) player.addCuePoint(flem.cuepoint, { idx: cuepointCount++ })
			})

			document.getElementById(VIDEO_CONTAINER_ID).classList.add('enter')

		})
		
		player.on('cuepoint', function(notification){
			State.setFlem(notification.data.idx)
			State.toggleMenu()
			m.redraw()
		})
	},
	toggleMenu: () => { State.menuOpen = !State.menuOpen },
	loadChapter: (ch, fl) => {
		const chapterIsChanging = State.currentChapterIndex !== ch
		State.currentChapterIndex = ch
		const id = State.chapters[ch].id

		State.setFlem(fl || 0)
		if (fl !== undefined) State.labOpen = true

		if (id && chapterIsChanging) {
			State.canPlay = false

			setTimeout(() => {
				State.canPlay = true
				m.redraw()
				setTimeout(State.setupPlayer.bind(null, id), 100)
			}, 100)
		}
	}
}

module.exports = State