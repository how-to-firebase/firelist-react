const tddExample = require('./tdd-example');

describe('TddExample', () => {
  it('should return true', () => {
    const result = tddExample(true);

    expect(result).toEqual(true);
  });
  
  it('should return false', () => {
    const result = tddExample(false);

    expect(result).toEqual(false);
  });
});