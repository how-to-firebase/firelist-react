/* globals firebase */
import { Observable } from 'rxjs';

const storage = firebase.storage();

export default (file, path) => {
  console.log('file', file);
  /* 
    CHALLENGE Storage
    - See https://firebase.google.com/docs/storage/web/upload-files#upload_files
    - Create a reference to path plus file.name
    - Hint: Use a single string like `${path}/${file.name}` or use storage's .child() function
  */

  return Observable.create(observer => {
    /* 
      CHALLENGE Storage
      - See https://firebase.google.com/docs/storage/web/upload-files#manage_uploads
      - Use ref.put to send the file to the server. Don't forget to save the upload task.
      - Listen to the state_changed event on the upload task
      - Register three listeners to the state_changed event (progress, error, complete)
      - Use getSnapshotProgress(snapshot) to calculate progress percentage in the progress callback
      - Call observer.next(progress) with the resulting progress
      - Call observer.error(error) with the error from the error callback
      - Call observer.complete() in the complete callback
    */
    
  });
};

function getSnapshotProgress(snapshot) {
  return snapshot.bytesTransferred / snapshot.totalBytes;
}
