export default tagsString => {
  const pipeDelimited = tagsString.replace(/(\s|,)/g, '|').replace(/\|+/g, '|');
  return pipeDelimited.split('|');
};
