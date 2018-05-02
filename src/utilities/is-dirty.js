export default (objA, objB) => {
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  return (
    objA == objB ||
    keysA.length != keysB.length ||
    !!keysA.find(key => objA[key] != objB[key])
  );
};
