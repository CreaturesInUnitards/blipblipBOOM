const Player = require('@vimeo/player')
const VIDEO_CONTAINER_ID = 'videoContainer'

const State = {
	chapters: require('./Data'),
	canPlay: false,
	currentChapterIndex: 0,
	currentFlemIndex: 0,
	menuOpen: localStorage.getItem('menuOpen') === 'true',
	sandboxOpen: false,
	player: null,
	setFlem: (n) =>  State.currentFlemIndex = n ,
	setupPlayer: (id) => {
		const player = State.player = new Player(VIDEO_CONTAINER_ID, {id: id || State.chapters[1].id})

		player.on('play', (data) => {
			if (data.seconds === 0) {
				State.menuOpen = false
				m.redraw()
			}
		})
		
		player.on('ended', () => {
			State.menuOpen = true
			m.redraw()
			
			setTimeout( () => {
				State.sandboxOpen = true
				m.redraw()

				setTimeout(State.player.setCurrentTime.bind(this, 0), 1000)
			}, 500)
		})
		
		player.on('loaded', () => {
			const chapter = State.chapters[State.currentChapterIndex]
			let cuepointCount = 0
			chapter.flems.forEach(function(flem){
				if (flem.cuepoint) player.addCuePoint(flem.cuepoint, { idx: cuepointCount++ })
			})

			document.getElementById(VIDEO_CONTAINER_ID).classList.add('enter')

		})
		
		player.on('cuepoint', (notification) => {
			State.setFlem(notification.data.idx)
			State.toggleMenu()
			m.redraw()
		})
	},
	toggleMenu: () => { 
		State.menuOpen = !State.menuOpen
		localStorage.setItem('menuOpen', State.menuOpen)
	},
	loadChapter: (ch, fl) => {
		const chapterIsChanging = State.currentChapterIndex !== ch
		State.currentChapterIndex = ch
		const id = State.chapters[ch].id

		State.setFlem(fl || 0)
		if (fl !== undefined) State.sandboxOpen = true
		
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