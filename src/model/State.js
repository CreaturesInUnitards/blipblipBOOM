const Player = require('@vimeo/player')
const VIDEO_CONTAINER_ID = 'videoContainer'

const State = {
	courses: null,
	chapters: null,
	path: {},
	canPlay: false,
	menuOpen: localStorage.getItem('menuOpen') === 'true',
	sandboxOpen: false,
	player: null,
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
			const chapter = State.chapters[State.path.chapter]
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
	loadChapter: () => {
		const chapter = State.chapters[State.path.chapter]

		if ( !chapter || !chapter.flems || !chapter.flems.length ) {
			console.error('Chapter is invalid! At least 1 flem needs to be present.', chapter)
			m.route.set('/')
		}
		
		if (!State.player) go()
		else State.player.getVideoId()
			.then(id => { 
				if (chapter.url != id) go()
			})
		
		function go() {
			if (!chapter.url) return
			
			State.canPlay = false

			setTimeout(() => {
				State.canPlay = true
				m.redraw()
				setTimeout(State.setupPlayer.bind(null, chapter.url), 100)
			}, 100)
		}
		//
		// const chapterIsChanging = !State.player || State.player.element.src.indexOf(chapter.url) === -1
		//
		// if (chapter.url && chapterIsChanging) {
		// 	State.canPlay = false
		//
		// 	setTimeout(() => {
		// 		State.canPlay = true
		// 		m.redraw()
		// 		setTimeout(State.setupPlayer.bind(null, chapter.url), 100)
		// 	}, 100)
		// }
	}
}

module.exports = State