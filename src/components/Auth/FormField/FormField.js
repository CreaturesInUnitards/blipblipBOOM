/***********************************
*
* FormField
*
***********************************/
require("./FormField.sass")

function text (attrs) {
	const selector = attrs.type = 'text' ? 'input[type=text]' : 'textarea'
	return m(selector,
		{
			placeholder: attrs.placeholder,
			value: attrs.value,
			oninput: m.withAttr('value', attrs.oninput)
		}
	)
}

const fieldTypes = {
	text: text
}

module.exports = {
	view: ({attrs}) => {
		const labelFirst = ('passwordtextareaemail').indexOf(attrs.type > -1)
		const labelDOM = m('', attrs.label)
		return m('label.form-field',
			labelFirst && labelDOM,
			fieldTypes[attrs.type](attrs),
			!labelFirst && labelDOM
		)
	}
}
