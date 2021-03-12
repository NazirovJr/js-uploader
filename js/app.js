import {upload} from "./upload";
import firebase from "firebase/app";
import "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBwQa9juKm9d7p8qgRpOpg4atsX9DrrB-4",
    authDomain: "js-uploader.firebaseapp.com",
    projectId: "js-uploader",
    storageBucket: "js-uploader.appspot.com",
    messagingSenderId: "211535997426",
    appId: "1:211535997426:web:446cf36f8c5951ebb9a36b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage()

upload("#file",  {
    multi:true,
    accept:['.png','.jpg','.jpeg','.gif'],
    onUpload(files, blocks,) {
        debugger
        files.forEach((file,index) => {
            const ref = storage.ref(`images/${file.name}`)
            const task = ref.put(file)

            task.on('state_change', snapshot => {
                debugger
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
                const block = blocks[index].querySelector('.preview-info-progress')
                block.textContent = percentage
                block.style.width = percentage
            }, error => {
                console.log(error)
            },() => {
                task.snapshot.ref.getDownloadURL().then(res => {
                    console.log(res)
                })
            })

        })
    }
})