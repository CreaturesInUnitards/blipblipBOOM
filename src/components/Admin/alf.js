const deepClone = object => {
	if (object === null) return null
	if (typeof object !== 'object') return object

	const clone = Array.isArray(object) ? [] : {}
	Object.keys(object).forEach(key => {
		if (object.hasOwnProperty(key)) {
			const prop = object[key]
			if (typeof prop === 'object') clone[key] = deepClone(prop)
			else clone[key] = prop
		}
	})
	return clone
}

const objectsAreEquivalent = (a, b) => {
	if(!(a && b)) return true

	// if _ids don't match, it's because we're looking at a new object
	if (a._id !== b._id) return false

	if (Object.keys(a).length !== Object.keys(b).length) return false

	let equiv = true
	Object.keys(b).forEach(function (key) {
		if (b.hasOwnProperty(key)) {
			if (typeof b[key] === 'object') {
				if (!objectsAreEquivalent(a[key], b[key])) equiv = false
			}
			else if (a[key] !== b[key]) equiv = false
		}
	})

	return equiv
} 

module.exports = { deepClone, objectsAreEquivalent }