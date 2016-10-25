import React from 'react'
import ScreeningsFilter from 'ScreeningsFilter'
import ScreeningsIndexPage from 'ScreeningsIndexPage'
import ScreeningsTable from 'ScreeningsTable'
import {mount} from 'enzyme'
import * as Utils from 'utils/http'

describe('ScreeningsIndexPage', () => {
  beforeEach(() => {
    const xhrSpyObj = jasmine.createSpyObj('xhrSpyObj', ['done'])
    spyOn(Utils, 'request').and.returnValue(xhrSpyObj)
  })

  describe('render', () => {
    it('renders ScreeningsFilter', () => {
      const wrapper = mount(<ScreeningsIndexPage location={{}} />)
      expect(wrapper.find(ScreeningsFilter).length).toEqual(1)
    })

    it('renders ScreeningsTable', () => {
      const wrapper = mount(<ScreeningsIndexPage location={{}} />)
      expect(wrapper.find(ScreeningsTable).length).toEqual(1)
    })
  })

  describe('updateIndex', () => {
    it('makes an ajax call to the pathname', () => {
      const location = {pathname: 'my-api', search: '?my-search'}
      mount(<ScreeningsIndexPage location={location} />)
      expect(Utils.request).toHaveBeenCalledWith('GET', 'my-api.json?my-search', null, null)
    })
  })
})
