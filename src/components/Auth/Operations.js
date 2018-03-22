window.UpdateObject = (collectionName, objectId, updateObj) => {
	firebase.firestore().collection(collectionName).doc(objectId).update(updateObj)
}

window.RemoveObject = (collectionName, objectId) => {
	firebase.firestore().collection(collectionName).doc(objectId).delete()
}


window.AddObject = (collectionName, addObj) => {
	firebase.firestore().collection(collectionName).add(addObj)
}