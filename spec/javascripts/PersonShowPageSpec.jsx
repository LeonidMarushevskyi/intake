import PersonShowPage from 'PersonShowPage'
import React from 'react'
import {shallow, mount} from 'enzyme';
import * as Utils from 'utils/http'

describe('PersonShowPage', () => {
  beforeEach(() => {
    const xhrSpyObject = jasmine.createSpyObj('xhrSpyObj', ['done'])
    spyOn(Utils, 'request').and.returnValue(xhrSpyObject)
  })

  describe('render', () => {
    it('renders the person label fields', () => {
      const props = { params: {} }
      const wrapper = mount(<PersonShowPage {...props} />)
      expect(wrapper.find('label').length).toEqual(9)
    })
  })

  describe('fetch', () => {
    it('GETs the person data to the server', () => {
      const props = { params: { id: 1 } }
      const wrapper = mount(<PersonShowPage {...props} />)
      wrapper.instance().fetch()
      expect(Utils.request).toHaveBeenCalled()
      expect(Utils.request.calls.argsFor(0)[0]).toEqual('GET')
      expect(Utils.request.calls.argsFor(0)[1]).toEqual('/people/1.json')
    })
  })
})

