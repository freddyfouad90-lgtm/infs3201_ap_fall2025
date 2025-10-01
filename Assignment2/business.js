const persistence = require('./persistence')

/**
 * this function will display the names of the albums the photo is in
 * @param {object} photo -the object of the photo
 * @returns the names of the albums the photo is in
 */
async function displayPhotoAlbum(photo) {
    let albumsID = photo.albums
    let albums = await persistence.readAlbumsFile()
    
    albumNames = '' // epmty string to store the names of the albums
    if(albums.length === 0){
        return 'No albums'
    }
    else{
        for(id of albumsID){ // loop through the album ids in the photo object
            for(a of albums){      // loop through the albums in the albums file
                if(a.id === id){
                    albumNames += a.name + ', ' // concatenate the names of the albums
                }   
        }
    }
    return albumNames // return the names of the albums
    }
}

/**
 * //   this function will display the tags of the photo
 * @param {number} id -- the id of the photo to search for
 * @param {} photo-- the object of the photo 
 * @param {string} sep -- the separator between the tags
 * @returns --  the tags of the photo
 */
async function displayPhotoTags(photo,sep,id) {
    if(photo === null || photo === `Sorry can't find photo with ID => ${id}`){
        return 'No tags found'
    }
    let tags = photo.tags  // get the tags of the photo
    if(tags.length === 0){
        return 'No tags'
    }
    else{
        let tagsString = '' // empty string to store the tags
        for(tag of tags){
            tagsString += tag + sep // concatenate the tags
        }
        return tagsString.slice(0,-2) // return the tags
    }       
}

/**
 * // this function will display the title of the photo with the given id
 * @param {*} id // the id of the photo to search for
 * @returns // the title of the photo with the given id
 */
async function displayPhototitle(id){
    let photo = await persistence.findPhoto(id)
    if(photo === null){
        return `Sorry can't find photo with ID => ${id}`
    }
    else{
        return photo.title
    }
}

/**
 * // this function will display the description of the photo with the given id
 * @param {number} id 
 * @returns // the description of the photo with the given id
 */
async function displayPhotodes(id){
    let photo = await persistence.findPhoto(id)
    if(photo === null){
        return `Sorry can't find photo with ID => ${id}`
    }
    else{
        return photo.description
    }
}

/** this function will display the details of the photo with the given id
 * @param {number} id 
 */
async function displayPhoto(userID, id) {
    let photo = await persistence.findPhoto(id)
    if(photo === null){
        return `Sorry can't find photo with ID => ${id}`
    }
    else{
        if(photo.owner === userID){
            return  `FileName: ${photo.filename}\nTile: ${photo.title}\nDate: ${new Date(photo.date).toDateString()}\nAlbums: ${await displayPhotoAlbum(photo)}\nTags: ${await displayPhotoTags(photo,', ', id)}\n` 
        }
        else{
            return 'Access denied. You do not own this photo.'
        }
    }

}

/**
 * this function will update the title of the photo with the given id
 * @param {number} id this is the id of the photo to be updated
 * @param {string} newTitle this is the new title to be updated
 */
async function updatePhotoTitle(id, newTitle){
    let photos = await persistence.readPhotosFile()
    for (p of photos){
        if(p.id === id){
            p.title = newTitle
        }
    }

    await persistence.writePhotoDetails(photos)
}

/**
 * this function will update the description of the photo with the given id
 * @param {number} id this is the id of the photo to be updated
 * @param {string} newDes this is the new description to be updated
 */
async function updatePhotoDes(id, newDes){
    let photos = await persistence.readPhotosFile()
    for (p of photos){
        if(p.id === id){
            p.description = newDes
        }
    }

    await persistence.writePhotoDetails(photos)
}

/**
 * this function will update the photo with the given id the user must be the owner of the photo to update it
 * it will prompt the user to enter the new title and description
 * if the user presses enter without entering any value, the existing value will be reused
 * @param {number} id
 */
async function updatePhotos(userID,id,updatedTitle,updatedDes) {
    
    let photo = await persistence.findPhoto(id)

    if(photo.owner !== userID){
        return 'Access denied. You do not own this photo.'
    }

    if(photo === null){ // if the photo with the given id is not found
        return `Sorry can't find photo with ID => ${id}`
    }
    
    if(updatedTitle == ''){
        
    }
    else{
        await updatePhotoTitle(id, updatedTitle)
    }

    if(updatedDes == ''){
        
    }
    else{
        await updatePhotoDes(id, updatedDes)
    }

    if (updatedTitle == '' && updatedDes == ''){ // if no changes were made
        return 'No changes made'
    }
    else{
        return 'Photo updated successfully'
    }
}

/**
 * this function will display the photos in the album with the given name
 * @param {string} name name of the album to search for 
 * @returns the photos in the album with the given name
 */
async function albumPhotoList(name) {
    name = name.toLowerCase()

    let albums = await persistence.readAlbumsFile()
    let photos = await persistence.readPhotosFile()
    
    let albumID 

    finalMessage = '' // empty string to store the final message

    for (a of albums){ // loop through the albums to find the album with the given name
        if (a.name.toLowerCase() === name){
            albumID = a.id 
        }
    }

    for(p of photos){ // loop through the photos to find the photos in the album with the given name
        for(aID of p.albums){ // loop through the album ids in the photo object
            if(aID === albumID){ // if the album id in the photo object matches the album id of the album with the given name
                finalMessage += p.filename + ', ' + p.resolution + ', '
                finalMessage += await displayPhotoTags(p,': ', photos.id) // get the tags of the photo
                finalMessage = finalMessage 
                finalMessage += '\n'
            }
        }
    }
    if(finalMessage === ''){
         // if the album with the given name is not found
        finalMessage = `Sorry can't find album with the name => ${name}`
        return finalMessage
    }
    else{
        return finalMessage
    }
    
}

/**
 * this function will update the tags of the photo with the given id
 * @param {number} id the id of the photo to be updated
 * @param {string} newTag the new tag to be added
 */
async function updatePhototag(id, newTag){
    let photos = await persistence.readPhotosFile()
    for (p of photos){
        if(p.id === id){
            p.tags.push(newTag)
        }
    }

    await persistence.writePhotoDetails(photos)
}

/**
 * // this function will get the photo with the given id
 * @param {number} id   // the id of the photo to search for
 * @returns    the photo with the given id
 */
async function getPhotoByID(id){
    let photo = await persistence.findPhoto(id)
    if(photo === null){
        return `Sorry can't find photo with ID => ${id}`
    }
    else{
        return photo
    }
    
}

/**
 * this function will add a new tag to the photo with the given id
 * @param {*} id the id of the photo to be updated
 * @param {*} newTag the new tag to be added
 * @param {number} userID the id of the user trying to add the tag
 * @returns the status of the operation
 */
async function addTagToPhoto(userID, id, newTag) {
    newTag = newTag.toLowerCase()
    
    let  photo = await persistence.findPhoto(id)
    if(photo.owner !== userID){
        return 'Access denied. You do not own this photo.'
    }

    if (photo === null){
        return `sorry cant find photo with the ID => ${id}`
    }
    else{
        for(t of photo.tags){
            if (t.toLowerCase() ===  newTag){
                return `Tag ${newTag} already exists for photo ID => ${id}`
            }
        }
        await updatePhototag(id, newTag)
        return 'Updated'
    }
}

/**
 * // this function will authenticate the user with the given username and password
 * @param {string} usename // the username of the user 
 * @param {*} password // the password of the user
 * @returns     //  the user object if authentication is successful, false otherwise
 */
async function authenticateUser(username, password) {
    let user = await persistence.findUser(username, password);
    if (user === null) {
        return false
    } 
    else {
        return user || true
    }
}

module.exports = {
    displayPhoto,
    updatePhotos,
    albumPhotoList,
    addTagToPhoto,
    displayPhotoTags,
    displayPhototitle,
    displayPhotodes,
    getPhotoByID,
    authenticateUser
}