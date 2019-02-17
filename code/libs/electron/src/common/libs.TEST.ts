import { expect } from 'chai';
import { is } from '.';

describe('libs', () => {
  it('is', () => {
    expect(is.dev).to.eql(true);
    expect(is.prod).to.eql(false);
  });
});
