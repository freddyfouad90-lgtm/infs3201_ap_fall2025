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
 * @param {} photo-- the object of the photo 
 * @param {string} sep -- the separator between the tags
 * @returns --  the tags of the photo
 */
async function displayPhotoTags(photo,sep) {
    if(photo === null){
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
async function displayPhoto(id) {
    let photo = await persistence.findPhoto(id)
    if(photo === null){
        return `Sorry can't find photo with ID => ${id}`
    }
    else{
        return  `FileName: ,${photo.filename}\nTile: , ${photo.title}\nDate: , ${new Date(photo.date).toDateString()}\nAlbums: ,${await displayPhotoAlbum(photo)}\nTags: , ${await displayPhotoTags(photo,', ')}\n` 
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
            console.log('Title updated successfully')
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
            console.log('Description updated successfully')
        }
    }

    await persistence.writePhotoDetails(photos)
}

/**
 * this function will update the photo with the given id
 * it will prompt the user to enter the new title and description
 * if the user presses enter without entering any value, the existing value will be reused
 * @param {number} id
 */
async function updatePhotos(id,updatedTitle,updatedDes) {
    
    let photo = await persistence.findPhoto(id)

    if(photo === null){ // if the photo with the given id is not found
        console.log(`Sorry can't find photo with ID => ${id}`)
        return
    }

    // console.log('Press enter reuse existing value.')
    // let updatedTitle = prompt(`Enter value for title [${photo.title}]: `)
    
    if(updatedTitle == ''){
        
    }
    else{
        await updatePhotoTitle(id, updatedTitle)
    }

    // let updatedDes = prompt(`Enter value for description [${photo.description}]: `)
    if(updatedDes == ''){
        
    }
    else{
        await updatePhotoDes(id, updatedDes)
    }

    if (updatedTitle == '' && updatedDes == ''){ // if no changes were made
        console.log('No changes made')
    }
    else{
        console.log('Photo updated successfully')
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
                finalMessage += await displayPhotoTags(p,': ') // get the tags of the photo
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
 * this function will add a new tag to the photo with the given id
 * @param {*} id the id of the photo to be updated
 * @param {*} newTag the new tag to be added
 * @returns the status of the operation
 */
async function addTagToPhoto(id, newTag) {
    newTag = newTag.toLowerCase()
    
    let  photo = await persistence.findPhoto(id)

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

module.exports = {
    displayPhoto,
    updatePhotos,
    albumPhotoList,
    addTagToPhoto,
    displayPhototitle,
    displayPhotodes,
}