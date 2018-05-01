export default function formatDoc(doc) {
  return {
    __id: doc.id,
    ...doc.data(),
  };
}
