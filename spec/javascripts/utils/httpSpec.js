import * as Http from 'utils/http'
import * as Config from 'common/config'
import {store} from 'store/configureStore'

describe('request', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
    const fakeConfig = {base_path: ''}
    spyOn(Config, 'config').and.callFake(() => fakeConfig)
  })

  afterEach(() => jasmine.Ajax.uninstall())

  describe('error handling', () => {
    beforeEach(() => {
      spyOn(store, 'dispatch')//.and.callThrough()
    })

    it('dispatches the http error action', () => {
      Http.request('GET', '/').catch(() => null)
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 500,
        responseText: JSON.stringify({why: 'Did not stick to the plan'}),
      })
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'HTTP_FAILURE',
        responseJSON: {why: 'Did not stick to the plan'},
      })
    })
  })
})
