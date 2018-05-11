module.exports = function calculateDownloadUrl({ name, bucket, metadata }) {
  const encodedName = encodeURIComponent(name);
  let result = null;

  if (metadata && metadata.firebaseStorageDownloadTokens) {
    const { firebaseStorageDownloadTokens: token } = metadata;

    result = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedName}?alt=media&token=${token}`;
  }

  return result;
};
