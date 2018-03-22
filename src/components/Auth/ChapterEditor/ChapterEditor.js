/***********************************
*
* CourseEditor
*
***********************************/
require("./ChapterEditor.sass")
const FormField = require('../FormField/FormField')

module.exports = {
	view: v => 
		m('.editor',
			m('h1', AdminData.chapterCopy.data.title)
		)
}
