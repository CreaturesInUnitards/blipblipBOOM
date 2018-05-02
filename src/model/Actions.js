const State = require('./State')
const Player = Vimeo.Player
const VIDEO_CONTAINER_ID = 'videoContainer'

// helpers
const normalizeParam = param => {
	let newParam = m.route.param(param)
	return param === 'courseID' 
		? newParam || ''
		: param === 'chapter'
			? +newParam || 0
			: param === 'screen'
				? newParam || 'video'
				: +newParam || 0
}

const Actions = {
	getChapters: courseID => {
		const course = State.courses[courseID]
		if (course.data && course.data.children && course.data.children.length) {
			return firebase.firestore().collection('chapters').where('parent', '==', courseID).get().then(snap => {
				State.chapters = course.data.children.map(child => {
					const doc = snap.docs.find(doc => doc.id === child.id)
					return doc.data()
				})
			})
		}
		else alert('That course has no thingies.')
	},
	getCourses: () => {
		return firebase.firestore().collection('courses').where('published', '==', true).get().then(snap => {
			State.courses = {}
			snap.docs.forEach(doc => {
				State.courses[doc.id] = { id: doc.id, data: doc.data() }
			})
		})
	},
	loadChapter: () => {
		const chapter = State.chapters[normalizeParam('chapter')]
		if (chapter === State.chapter) return
		State.chapter = chapter

		if ( !chapter || !chapter.flems || !chapter.flems.length ) {
			console.error('Chapter is invalid! At least 1 flem needs to be present. Or the thing needs to exist. Or you shutUP.', chapter)
			m.route.set('/')
		}
		
		// maybe?
		if (chapter.url) {
			if (State.videoUrl === chapter.url) return
			State.videoUrl = chapter.url
			setTimeout(() => {
				Actions.setupPlayer(chapter.url)
			}, 100)
		}
		else {
			console.error('Chapter is invalid! You need a video id (chapter.url)', chapter)
			m.route.set('/')
		}
	},
	setupPlayer: (id) => {
		const videoContainer = document.getElementById(VIDEO_CONTAINER_ID) 
		State.canPlay = false
		m.redraw()
		
		setTimeout(() => {
			if (!State.player) State.player = new Player(VIDEO_CONTAINER_ID, {id: id || State.chapters[0].id})
			else State.player.loadVideo(id)

			const player = State.player

			player.on('loaded', () => {
				let cuepointCount = 0
				State.chapter.flems.forEach(function(flem){
					if (flem.cuepoint) player.addCuePoint(flem.cuepoint, { idx: cuepointCount++ })
				})

				setTimeout(() => {
					videoContainer.classList.add('enter')
					State.canPlay = true
					m.redraw()
				}, 100)
			})

			player.on('cuepoint', (notification) => {
				player.pause()
				const { courseID, chapter } = Actions.urlComponents()
				m.route.set(`/${courseID}/${chapter}/sandbox/${notification.data.idx}`)
			})

			player.on('ended', () => {
				setTimeout( () => {
					m.route.set(Actions.toggledUrl())
					setTimeout(() => { State.player.setCurrentTime(0) }, 1000)
				}, 500)
			})
		}, 800)
	},
	toggledUrl: () => {
		const { courseID, chapter, flem } = Actions.urlComponents()
		const screen = normalizeParam('screen') === 'video' ? 'sandbox' : 'video'
		return `/${courseID}/${chapter}/${screen}/${flem}`
	},
	urlComponents: () => ({
		courseID: normalizeParam('courseID'),
		chapter: normalizeParam('chapter'),
		screen: normalizeParam('screen'),
		flem: normalizeParam('flem'),
	})
}

module.exports = Actions