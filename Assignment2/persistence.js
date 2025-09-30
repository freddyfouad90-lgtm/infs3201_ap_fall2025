//Freddy Ayman Fouad, ID: 60306484

const fs = require('fs/promises')

/**
 * //This Function will read the data in the photos file and return an array of objects
 * @returns {Array} Array of photo objects
 */
async function readPhotosFile(){
    let data =  await fs.readFile('photos.json','utf-8')
    return JSON.parse(data)
}

/**
 * This Function will read the data in the albums file and return an array of objects
 * @returns {Array} Array of album objects
 */
async function readAlbumsFile() {
    let data = await fs.readFile('albums.json','utf-8')
    return JSON.parse(data)
}

/**
 * this function will write the data to the photos file
 * @param {*} data 
 */
async function writePhotoDetails(data) {
    const newData = JSON.stringify(data, null, 2); 
    await fs.writeFile('photos.json', newData);
}

/**
 * this function will find the photo with the given id
 * @param {*} id 
 * @returns details of the photo with the given id
 */
async function findPhoto(id) {
    let photos = await readPhotosFile()
    
    for(p of photos){
        if(p.id === id){
            return p
        }
    }

    return null
}

module.exports ={
    readPhotosFile,
    readAlbumsFile, 
    writePhotoDetails,
    findPhoto
}