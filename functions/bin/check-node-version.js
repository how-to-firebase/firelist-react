const nodeVersion = process.version.match(/v(\d)/)[1];

if (nodeVersion != '6') {
  console.log('process.version', process.version);
  console.log('nodeVersion', nodeVersion);
  
  throw new Error(
    `Node version needs to be 6.x. Current version is ${process.version}`
  );
}
