import { expect } from 'chai';
import { is } from '.';

describe('libs', () => {
  it('is', () => {
    expect(is.dev()).to.eql(false);
    expect(is.production()).to.eql(true);
    expect(is.main()).to.eql(false);
    expect(is.renderer()).to.eql(false);
  });
});
