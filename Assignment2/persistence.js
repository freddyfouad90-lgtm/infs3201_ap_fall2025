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

/**
 * 
 * @returns an array of user objects
 */
async function readUserFile() {
    let data = await fs.readFile('users.json', 'utf-8');
    return JSON.parse(data);    
}

/**
 * // this function will find the user with the given username and password
 * @param {string} username // the username of the user 
 * @param {string} password // the password of the user
 * @returns //  the user object if found, null otherwise
 */
async function findUser(username, password){
    let users = await readUserFile()
    for (u of users){
        if (u.username === username && u.password === password){
            return u
        }
    }
    return null
}

/**
 * // this function will find the user with the given id
 * @param {Number} id // the id of the user 
 * @returns //  the user object if found, null otherwise
 */
async function findUserByID(id){
    let users = await readUserFile()   
    for (u of users){
        if (u.id === id){
            return u
        }
    }
    return null
}

module.exports ={
    readPhotosFile,
    readAlbumsFile, 
    writePhotoDetails,
    findPhoto,
    readUserFile,
    findUser,
    findUserByID
}