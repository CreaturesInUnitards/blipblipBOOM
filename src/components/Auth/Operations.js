const EditObjectProperty = (collectionName, object, prop, newValue) => {
	object[prop] = newValue
	const saveObject = {}
	saveObject[prop] = newValue
	UpdateObject(collectionName, object.id, saveObject)
}

const UpdateObject = (collectionName, objectId, updateObj) => {
	firebase.firestore().collection(collectionName).doc(objectId).update(updateObj)
}

const RemoveObject = (collectionName, objectId) => {
	firebase.firestore().collection(collectionName).doc(objectId).delete()
}


const AddObject = (collectionName, addObj) => {
	firebase.firestore().collection(collectionName).add(addObj)
}

module.exports = { AddObject, UpdateObject, RemoveObject, EditObjectProperty }