/* globals firebase */
const DELETE = firebase.firestore && firebase.firestore.FieldValue.delete();

/* 
  CHALLENGE Firestore
  - See https://firebase.google.com/docs/firestore/manage-data/delete-data
  - Write a function to delete empty values in an updates object
  - Use the isEmpty function to identify the empty values
  - Use Firestore's field-deletion value to empty out the value in the update
*/

export default updates => {
  const result = {};

  for (let key in updates) {
    const value = updates[key];
    result[key] = (isEmpty(value) && DELETE) || value;
  }

  return result;
};

function isEmpty(value) {
  return typeof value != 'boolean' && !value;
}
