import React from 'react'
import ReferralsFilter from 'ReferralsFilter'
import ReferralsIndexPage from 'ReferralsIndexPage'
import ReferralsTable from 'ReferralsTable'
import {mount} from 'enzyme';
import * as Utils from 'utils/http'

describe('ReferralsIndexPage', () => {
  beforeEach(() => {
    const xhrSpyObj = jasmine.createSpyObj('xhrSpyObj', ['done'])
    spyOn(Utils, 'request').and.returnValue(xhrSpyObj)
  })

  describe('render', () => {
    it('renders ReferralsFilter', () => {
      const wrapper = mount(<ReferralsIndexPage location={{}} />)
      expect(wrapper.find(ReferralsFilter).length).toEqual(1)
    })

    it('renders ReferralsTable', () => {
      const wrapper = mount(<ReferralsIndexPage location={{}} />)
      expect(wrapper.find(ReferralsTable).length).toEqual(1)
    })
  })

  describe('updateIndex', () => {
    it('makes an ajax call to the pathname', () => {
      const location = { pathname: 'my-api', search: '?my-search' }
      const wrapper = mount(<ReferralsIndexPage location={location} />)
      expect(Utils.request).toHaveBeenCalledWith('GET', 'my-api.json?my-search', null, null)
    })
  })
})
