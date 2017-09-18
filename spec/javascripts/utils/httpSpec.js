import * as Http from 'utils/http'
import * as Config from 'common/config'
import {store} from 'store/configureStore'

describe('request', () => {
  const fakeConfig = {base_path: ''}
  const mocks = {
    error: {
      status: 500,
      responseText: JSON.stringify({why: 'Did not stick to the plan'}),
    },
  }

  beforeEach(() => {
    jasmine.Ajax.install()
    spyOn(Config, 'config').and.callFake(() => fakeConfig)
  })

  afterEach(() => jasmine.Ajax.uninstall())

  describe('error handling', () => {
    let storeSpy
    let request

    beforeEach(() => {
      storeSpy = spyOn(store, 'dispatch').and.callThrough()
    })

    it('dispatches the http error action', () => {
      Http.request('GET', '/')
      request = jasmine.Ajax.requests.mostRecent()
      request.respondWith(mocks.error)
      expect(storeSpy).toHaveBeenCalledWith({
        type: 'HTTP_FAILURE',
        responseJSON: {why: 'Did not stick to the plan'},
      })
    })
  })
})
