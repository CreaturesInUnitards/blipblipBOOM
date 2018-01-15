require('./Video.sass')
var State = require('../../model/State')

var Video = {
	oninit: function (vnode) {
		vnode.state.playing = false
	},
	oncreate: function (vnode) {
		vnode.dom.addEventListener('ended', onVideoEvent)
		vnode.dom.addEventListener('playing', onVideoEvent)
		vnode.dom.addEventListener('pause', onVideoEvent)

		vnode.state.onremove = function () {
			vnode.dom.removeEventListener('ended', onVideoEvent)
			vnode.dom.removeEventListener('playing', onVideoEvent)
			vnode.dom.removeEventListener('pause', onVideoEvent)
		}

		function onVideoEvent(e) {
			switch (e.type) {
				case 'pause':
					vnode.state.playing = false
					break

				case 'ended':
					vnode.state.playing = false
					vnode.attrs.ended()
					break

				case 'playing':
					vnode.state.playing = true
					break

				default:
					console.log(e.type)
			}
			m.redraw()
		}
	},
	view: function (vnode) {
		var playing = vnode.state.playing
		return [
			m('video'
				, {
					src: './video/' + vnode.attrs.file + '.mp4',
					onclick: function (e) {
						e.target[playing ? 'pause' : 'play']()
					}
				}
			)
			, m('.play-icon'
				, {
					class: playing ? 'playing' : '',
					onclick: function () {
						vnode.dom.click()
					}
				}
			)
		]
	}
}

module.exports = Video