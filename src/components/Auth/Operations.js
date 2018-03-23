const UpdateObject = (collectionName, objectId, updateObj) => {
	firebase.firestore().collection(collectionName).doc(objectId).update(updateObj)
}

const RemoveObject = (collectionName, objectId) => {
	if (collectionName === 'courses') {
		const chapters = AdminData.courses[objectId].data.chapters || []
		chapters.forEach(id => { RemoveObject('chapters', id) })
	} 
	firebase.firestore().collection(collectionName).doc(objectId).delete()
}


const AddObject = (collectionName, addObj) => _e => {
	firebase.firestore().collection(collectionName).add(addObj)
}

module.exports = { AddObject, UpdateObject, RemoveObject }