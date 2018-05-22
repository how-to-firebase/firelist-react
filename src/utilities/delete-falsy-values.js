/* globals firebase */
const DELETE = firebase.firestore && firebase.firestore.FieldValue.delete();

/* 
  CHALLENGE Firestore
  - See https://firebase.google.com/docs/firestore/manage-data/delete-data
  - Write a function to delete empty values in an updates object
  - Use the isFalsy function to identify the falsy values
  - Use Firestore's field-deletion value to empty out the value in the update
*/

export default updates => {
  const result = {};

  for (let key in updates) {
    const value = updates[key];
    result[key] = (isFalsy(value) && DELETE) || value;
  }

  return result;
};

function isFalsy(value) {
  return !value;
}
