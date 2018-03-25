const saveNewTitle = (collectionName, childID, update) => {
	const child = AdminData[collectionName][childID]
	const parentCollectionName = collectionName == 'courses' ? 'users' : 'courses'
	const parent = parentCollectionName == 'courses' ? AdminData.courses[child.data.parent] : AdminData.user
	;(parent.data.children.find(c => c.id == childID)).title = update.title
	UpdateObject(parentCollectionName, parent.id, { children: parent.data.children })
}

const cleanup = (collectionName, objectID) => {
	if (collectionName == 'courses') {
		if (AdminData.courseCopy && AdminData.courseCopy.id === objectID) {
			AdminData.courseCopy = null
			AdminData.chapterCopy = null
		}
		
		const chapters = AdminData.courses[objectID].data.chapters || []
		chapters.forEach(id => {
			RemoveObject('chapters', id)
		})
	} else if (collectionName == 'chapters') {
		if (AdminData.chapterCopy && AdminData.chapterCopy.id === objectID) AdminData.chapterCopy = null
	}
}

const UpdateObject = (collectionName, objectID, updateObj) => {
	if (updateObj.title) saveNewTitle(collectionName, objectID, updateObj)
	firebase.firestore().collection(collectionName).doc(objectID).update(updateObj)
}

const RemoveObject = (collectionName, objectID) => {
	cleanup(collectionName, objectID)
	firebase.firestore().collection(collectionName).doc(objectID).delete()
}


const AddObject = (collectionName, addObj) => _e => {
	firebase.firestore().collection(collectionName).add(addObj)
}

module.exports = { AddObject, UpdateObject, RemoveObject, saveNewTitle }