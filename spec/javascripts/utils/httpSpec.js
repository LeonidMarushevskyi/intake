import * as Http from 'utils/http'
import * as Config from 'common/config'
import {store} from 'store/configureStore'
import {httpError, httpSuccess} from 'actions/httpActions'

describe('request', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
    const fakeConfig = {base_path: ''}
    spyOn(Config, 'config').and.callFake(() => fakeConfig)
  })

  afterEach(() => jasmine.Ajax.uninstall())

  describe('success handling', () => {
    beforeEach(() => {
      spyOn(store, 'dispatch')
    })

    it('dispatches the http success action', () => {
      Http.request('GET', '/').catch(() => null)
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        responseText: JSON.stringify({why: 'Did stick to the plan'}),
      })
      expect(store.dispatch).toHaveBeenCalledWith(
        httpSuccess({why: 'Did stick to the plan'})
      )
    })
  })
  describe('error handling', () => {
    beforeEach(() => {
      spyOn(store, 'dispatch')
    })

    it('dispatches the http error action', () => {
      Http.request('GET', '/').catch(() => null)
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 500,
        responseText: JSON.stringify({why: 'Did not stick to the plan'}),
      })
      expect(store.dispatch).toHaveBeenCalledWith(
        httpError({why: 'Did not stick to the plan'})
      )
    })
  })
})
