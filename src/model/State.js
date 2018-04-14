const Player = require('@vimeo/player/dist/player.min')
const VIDEO_CONTAINER_ID = 'videoContainer'

const State = {
	courses: null,
	chapters: null,
	path: {},
	animators: { in: null, out: null },
	canPlay: false,
	player: null,
	getChapters: courseID => {
		const course = State.courses[courseID]
		return firebase.firestore().collection('chapters').where('parent', '==', courseID).get().then(snap => {
			State.chapters = course.data.children.map(child => {
				const doc = snap.docs.find(doc => doc.id === child.id)
				return doc.data()
			})
		})
	},
	getCourses: () => {
		return firebase.firestore().collection('courses').get().then(snap => {
			State.courses = {}
			snap.docs.forEach(doc => {
				State.courses[doc.id] = { id: doc.id, data: doc.data() }
			})
		})
	},
	setupPlayer: (id) => {
		const player = State.player = new Player(VIDEO_CONTAINER_ID, {id: id || State.chapters[1].id})
		
		player.on('play', (data) => {
			if (data.seconds === 0) {
				State.menuOpen = false
				m.redraw()
			}
		})
		
		player.on('ended', () => {
			m.redraw()
			
			setTimeout( () => {
				State.toggleUrl(true)
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
			player.pause()
			const { courseID, chapter } = State.path
			const url = `/${courseID}/${chapter}/sandbox/${notification.data.idx}`
			m.route.set(url)
		})
	},
	toggleUrl: auto => {
		const { courseID, chapter, flem } = State.path
		const screen = State.path.screen === 'video' ? 'sandbox' : 'video'
		const url = `/${courseID}/${chapter}/${screen}/${flem}`
		if (!auto) return url // player.onended sets auto: true
		m.route.set(url)
	},
	loadChapter: () => {
		const chapter = State.chapters[State.path.chapter]

		if ( !chapter || !chapter.flems || !chapter.flems.length ) {
			console.error('Chapter is invalid! At least 1 flem needs to be present. Or the thing needs to exist. Or you shutUP.', chapter)
			m.route.set('/')
		}
		
		if (State.path.chapter === 0) delete State.player

		/* brought to you by Firefox being bad at its job */  
		/* ---------------------------------------------- */
		if (State.videoID !== chapter.url) go()
		State.videoID = chapter.url
		/* ---------------------------------------------- */

		function go() {
			if (!chapter.url) return
			
			State.canPlay = false // canPlay: false will force main view to fade loader in/out across new vid, ish. 
			setTimeout(() => {
				State.canPlay = true
				m.redraw()
				setTimeout(State.setupPlayer.bind(null, chapter.url), 100)
			}, 100)
		}
	}
}

module.exports = State

// TODO: Course should allow authors to select a vimeo Collection as its Chapters; pre-populate with Titles and IDs

