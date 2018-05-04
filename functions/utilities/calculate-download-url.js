module.exports = function calculateDownloadUrl({ name, bucket, metadata }) {
  const encodedName = encodeURIComponent(name);
  const { firebaseStorageDownloadTokens: token } = metadata;
  
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedName}?alt=media&token=${token}`;
};
