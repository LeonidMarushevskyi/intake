import React from 'react'
import ScreeningsFilter from 'components/screenings/ScreeningsFilter'
import ScreeningsIndexPage from 'components/screenings/ScreeningsIndexPage'
import ScreeningsTable from 'components/screenings/ScreeningsTable'
import {mount} from 'enzyme'
import * as Utils from 'utils/http'

describe('ScreeningsIndexPage', () => {
  beforeEach(() => {
    const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
    spyOn(Utils, 'request').and.returnValue(promiseSpyObj)
    promiseSpyObj.then.and.callFake((then) => then([]))
  })

  describe('render', () => {
    it('renders ScreeningsFilter', () => {
      const component = mount(<ScreeningsIndexPage location={{}} />)
      expect(component.find(ScreeningsFilter).length).toEqual(1)
    })

    it('renders ScreeningsTable', () => {
      const component = mount(<ScreeningsIndexPage location={{}} />)
      expect(component.find(ScreeningsTable).length).toEqual(1)
    })
  })

  describe('updateIndex', () => {
    it('makes an ajax call to the pathname', () => {
      const location = {pathname: 'my-api', search: '?my-search'}
      mount(<ScreeningsIndexPage location={location} />)
      expect(Utils.request).toHaveBeenCalledWith('GET', 'my-api.json?my-search')
    })
  })
})
