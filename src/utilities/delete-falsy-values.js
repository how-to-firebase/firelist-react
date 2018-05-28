/* globals firebase */
const DELETE = firebase.firestore.FieldValue.delete();

/* 
  CHALLENGE Firestore 21
  - The following function is already completed and this challenge exists for review purposes only
  - Feel free to delete the function and rewrite it yourself...
    ...but it's some tricky JavaScript and not a lot of Firestore-specific code
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
