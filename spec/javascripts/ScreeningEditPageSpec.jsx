import * as Utils from 'utils/http'
import Immutable from 'immutable'
import ScreeningEditPage from 'ScreeningEditPage'
import React from 'react'
import {mount} from 'enzyme'

describe('ScreeningEditPage', () => {
  let xhrSpyObject
  beforeEach(() => {
    xhrSpyObject = jasmine.createSpyObj('xhrSpyObj', ['done'])
    spyOn(Utils, 'request').and.returnValue(xhrSpyObject)
  })

  describe('render', () => {
    it('renders the narrative card header', () => {
      const props = { params: { id: 1 } }
      const wrapper = mount(<ScreeningEditPage {...props} />)
      expect(wrapper.find('#narrative-card .card-header').text()).toEqual('Narrative')
    })

    it('renders the report narrative textarea', () => {
      const props = { params: { id: 1 } }
      const wrapper = mount(<ScreeningEditPage {...props} />)
      wrapper.setState({
        screening: Immutable.fromJS({
          report_narrative: 'some narrative',
        }),
      })

      expect(wrapper.find('textarea').text()).toEqual('some narrative')
    })

    describe('fetch', () => {
      it('GETs the screening data from the server', () => {
        const props = { params: { id: 1 } }
        const wrapper = mount(<ScreeningEditPage {...props} />)
        wrapper.instance().fetch()
        expect(Utils.request).toHaveBeenCalled()
        expect(Utils.request.calls.argsFor(0)[0]).toEqual('GET')
        expect(Utils.request.calls.argsFor(0)[1]).toEqual('/screenings/1.json')
      })
    })
  })
})
