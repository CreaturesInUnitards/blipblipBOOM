/***********************************
*
* LoadingAnimation
*
***********************************/
module.exports = {
	view: ({children}) => m('.spinner'
		, m('.blip.bounce1')
		, m('.blip.bounce2')
		, m('.blip.bounce3')
		, m('.c-grey.p20.center.nowrap.fs08', m('i', children))
	)
} 
	
