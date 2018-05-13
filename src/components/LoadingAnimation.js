/***********************************
*
* LoadingAnimation
*
***********************************/
module.exports = {
	view: ({children}) => m('.spinner'
		, m(''
			, m('.blip.bounce1')
			, m('.blip.bounce2')
			, m('.blip.bounce3')
		)
		, m('.c-grey.p20.center.nowrap.fs08.w100p', m('i', children))
	) 
} 
	
