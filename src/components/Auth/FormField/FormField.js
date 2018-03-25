/***********************************
*
* FormField
*
***********************************/

module.exports = {
	view: ({attrs}) => {
		return m('.form-field.f1',
			{ class: attrs.class || '' },
			m('label',
				m('', { class: attrs.labelClass || '' }, attrs.label),
				m('input[type=text]',
					{
						class: attrs.inputClass || '',
						placeholder: attrs.placeholder,
						value: attrs.value,
						oninput: m.withAttr('value', attrs.oninput)
					}
				)
			)
		)
	}
}
