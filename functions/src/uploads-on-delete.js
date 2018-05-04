/* 
  CHALLENGE Cloud Functions
  - 
*/
module.exports = function UploadsOnDelete({ admin, environment }) {
  return event => {
    console.log('JSON.stringify(event)', JSON.stringify(event));
    return null;
  };
};

