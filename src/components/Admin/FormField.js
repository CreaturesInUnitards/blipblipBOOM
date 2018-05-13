/***********************************
*
* FormField
*
***********************************/

module.exports = {
	view: ({attrs : { class: className, labelClass, label, autofocus, inputClass, placeholder, value, oninput }}) => {
		return m('.form-field.f1',
			{ class: className || '' },
			m('label',
				m('', { class: labelClass || '' }, label),
				m('input[type=text]',
					{
						autofocus: autofocus,
						class: inputClass || '',
						placeholder: placeholder,
						value: value,
						oninput: m.withAttr('value', oninput)
					}
				)
			)
		)
	}
}
