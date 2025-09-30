const prompt = require('prompt-sync')();
const business = require('./business.js')

/**
 * the main function will display the menu and prompt the user to enter an option
 * based on the option entered, it will call the appropriate function
 * it will keep displaying the menu until the user enters 5 to quit
 */
async function main() {
    while (true){
        console.log('')
        console.log('1. Find Photo')
        console.log('2. update Photo Details')
        console.log('3. Album Photo list')
        console.log('4. Tag Photo')
        console.log('5. Quit')
        console.log('')

        let option = Number(prompt('Your selection: '))

        if(option === 1 ){ // to find and display photo details
            let id =  Number(prompt('Photo ID? '))
            console.log(await business.displayPhoto(id))
        }
        else if(option === 2){// to update photo details
            let id = Number(prompt("Enter photo ID to update: "))
            console.log('Press enter reuse existing value.')
            let updatedTitle = prompt(`Enter value for title [${await business.displayPhototitle(id)}]: `)
            let updatedDes = prompt(`Enter value for description [${await business.displayPhotodes(id)}]: `)
            console.log(await business.updatePhotos(id,updatedTitle,updatedDes))
        }
        else if(option === 3){// to display photos in an album
            let name = prompt('Album name? ')
            let message = await business.albumPhotoList(name)
            console.log(message)
        }
        else if(option === 4){// to add a new tag to a photo
            let id = Number(prompt('Photo ID? '))
            let newTag = prompt('New tag ('+ await business.displayPhotoTags(await business.findPhoto(id), ', ') + ')? ')// display existing tags
            let message = await business.addTagToPhoto(id, newTag)
            console.log(message)
        }
        else if(option === 5){
            break // exit the loop
        }
        else{
            console.log('******** ERROR!!! Pick a number between 1 and 5')
        }

    }
}
 main()