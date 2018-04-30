export default function mapDocs(docs) {
  return docs.map(doc => ({
    __id: doc.id,
    ...doc.data(),
  }));
}
