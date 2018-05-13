const blankState = {
	canPlay: false,
	chapter: null,
	chapters: null,
	flemReady: false,
	player: null,
	videoUrl: null,
	reset: obj => { Object.assign(obj, blankState) }
}

module.exports = Object.create(blankState)

// TODO: Course should allow authors to select a vimeo Collection as its Chapters; pre-populate with Titles, posterimages and IDs

