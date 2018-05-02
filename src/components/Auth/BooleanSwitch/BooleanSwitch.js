module.exports = {
	view: ({attrs : { condition, onclick }}) => m('.boolean-switch', {
		class: condition ? 'on' : 'off',
		onclick: onclick
	})
}