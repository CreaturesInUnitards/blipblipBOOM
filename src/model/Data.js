/*
  ********************************************************************************** 
  ********************************************************************************** 
  ********************************************************************************** 
  ********************************************************************************** 
  * 
  * SCHEMA:
  * ________________________________________________________________________________
  * 
  * label:   Button text label
  * 
  * notes:  "Practicum text"; should be thoughts on intended general focus
  * 
  * links:  Links to relevant resources, for each:
  *             text: html text
  *             url: link url
  *             
  * flems:  Array of flems, for each:
  *             label:  button text label
  *             url:    flems url
  *             cue:    optional timecode in seconds where the video should stop
  *                     and display this flems
  * 
  ********************************************************************************** 
  ********************************************************************************** 
  ********************************************************************************** 
  ********************************************************************************** 
*/



module.exports = [
	{
		label: 'Welcome',
		notes: "Here you will see suggestions for activities related to your current chapter in the series.|" +
		"Click the sandboxes for various starting points, then experiment with coding ideas and see your results in real time on the right.|" +
		"(<i>Sandboxes are implemented using Rasmus Porsager's excellent Flems.io</i>)",
		links: [
			{ text: 'Official Mithril.js site', url: 'https://mithril.js.org' },
			{ text: 'Mithril on GitHub', url: 'https://github.com/MithrilJS/mithril.js' },
			{ text: 'Official Gitter channel', url: 'https://gitter.im/mithriljs/mithril.js' },
			{ text: 'Mithril 10-minute guide', url: 'https://mithril.js.org/index.html' },
			{ text: 'Official Mithril tutorial', url: 'https://mithril.js.org/simple-application.html' },
			{ text: 'Flems.io by @porsager', url: 'https://flems.io' },
			{ text: '@porsager on GitHub', url: 'https://github.com/porsager' },
		],
		flems: [
			{ label: '"Hello world" in HTML :)', url: 'y9da38m6' },
			{ label: '"Hello world" in vanilla JS', url: 'y8vhu2vg' }
		]
	},
	{
		label: 'Hello, World!',
		id: 251555927,
		notes: "We used two different methods to put text on the page: <code>m.render</code> and <code>m.mount</code>.|See what kind of damage you can do with each of them in the sandboxes.",
		links: [
			{ text: 'm.render API reference', url: 'https://mithril.js.org/render.html' },
			{ text: 'm.mount API reference', url: 'https://mithril.js.org/mount.html' },
		],
		flems: [
			{ label: "Using m.render", url: 'y7zau2jh', cuepoint: 45 },
			{ label: "Using m.mount", url: 'ybq58myu' }
		]
	},
	{
		label: 'Hyperscript and Auto-Redraw',
		id: 251976348,
		notes: "Here are a few hyperscript examples. Make sure you check out the CSS and try a few different ways of dynamically affecting the page contents in response to user events.",
		links: [],
		flems: [
			{ label: "Using m.render", url: 'y7zau2jh' },
			{ label: "Using m.mount", url: 'ybq58myu' }
		]
	},
	{
		label: 'Components, "attrs", and "state"',
		id: 251976348,
		notes: "",
		links: [],
		flems: []
	}
]