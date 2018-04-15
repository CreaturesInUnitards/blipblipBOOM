const State = require('./State')

const Player = require('@vimeo/player/dist/player.min')
const VIDEO_CONTAINER_ID = 'videoContainer'

// helpers
const normalizeParam = param => {
	let newParam = m.route.param(param)
	return param == 'courseID' 
		? newParam || ''
		: param == 'chapter'
			? +newParam || 0
			: param == 'screen'
				? newParam || 'video'
				: +newParam || 0
}

const Actions = {
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
	loadChapter: () => {
		const chapter = State.chapters[normalizeParam('chapter')]

		if ( !chapter || !chapter.flems || !chapter.flems.length ) {
			console.error('Chapter is invalid! At least 1 flem needs to be present. Or the thing needs to exist. Or you shutUP.', chapter)
			m.route.set('/')
		}
		
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
				setTimeout(Actions.setupPlayer.bind(null, chapter.url), 100)
			}, 300)
		}
	},
	setupPlayer: (id) => {
		const player = State.player = new Player(VIDEO_CONTAINER_ID, {id: id || State.chapters[0].id})
		
		player.on('ended', () => {
			setTimeout( () => {
				Actions.toggleUrl(true)
				setTimeout(State.player.setCurrentTime.bind(this, 0), 1000)
			}, 500)
		})

		player.on('loaded', () => {
			const chapter = State.chapters[normalizeParam('chapter')]
			let cuepointCount = 0
			chapter.flems.forEach(function(flem){
				if (flem.cuepoint) player.addCuePoint(flem.cuepoint, { idx: cuepointCount++ })
			})

			setTimeout(() => { document.getElementById(VIDEO_CONTAINER_ID).classList.add('enter') }, 100)
		})

		player.on('cuepoint', (notification) => {
			player.pause()
			const { courseID, chapter } = Actions.urlComponents()
			m.route.set(`/${courseID}/${chapter}/sandbox/${notification.data.idx}`)
		})
	},
	toggleUrl: auto => {
		const { courseID, chapter, flem } = Actions.urlComponents()
		const screen = normalizeParam('screen') === 'video' ? 'sandbox' : 'video'
		const url = `/${courseID}/${chapter}/${screen}/${flem}`
		if (!auto) return url // player.onended sets auto: true
		m.route.set(url)
	},
	urlComponents: () => ({
		courseID: normalizeParam('courseID'),
		chapter: normalizeParam('chapter'),
		screen: normalizeParam('screen'),
		flem: normalizeParam('flem'),
	})
}

module.exports = Actions