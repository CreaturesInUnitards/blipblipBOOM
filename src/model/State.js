var State = { 
	menuOpen: false,
	exercise: false,
	toggle: function (w) {
		State[w] = !State[w]
	}
}

module.exports = State