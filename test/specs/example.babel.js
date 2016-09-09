import assert from 'assert';
import 'babel-polyfill';

describe('page title', () => {
  it('has the correct page title', () => {
    const title = browser.url("/").getTitle();
    assert.equal( title, "FooBar" );
  });
});
