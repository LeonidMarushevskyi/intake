import ScreeningShowPage from 'ScreeningShowPage'
import React from 'react'
import {mount} from 'enzyme';
import * as Utils from 'utils/http'
import Immutable from 'immutable'

describe('ScreeningShowPage', () => {
  beforeEach(() => {
    const xhrSpyObject = jasmine.createSpyObj('xhrSpyObj', ['done'])
    spyOn(Utils, 'request').and.returnValue(xhrSpyObject)
  })

  describe('render', () => {
      it('renders the card header', () => {
        const props = { params: { id: 1 } }
        const wrapper = mount(<ScreeningShowPage {...props} />)
        expect(wrapper.find('.card-header').text()).toContain('Narrative')
      })

      it('renders the screening narrative label fields', () => {
        const props = { params: {} }
        const wrapper = mount(<ScreeningShowPage {...props} />)
        expect(wrapper.find('label').length).toEqual(1)
        expect(wrapper.find('label').text()).toEqual('Report Narrative')
      })

      it('renders the screening value fields', () => {
        const props = { params: {} }
        const wrapper = mount(<ScreeningShowPage {...props} />)
        wrapper.setState({
          screening: Immutable.fromJS({
            report_narrative: 'some narrative',
          }),
        })
        expect(wrapper.text()).toContain('some narrative')
    })
  })

  describe('fetch', () => {
    it('GETs the screening data from the server', () => {
      const props = { params: { id: 1 } }
      const wrapper = mount(<ScreeningShowPage {...props} />)
      wrapper.instance().fetch()

      expect(Utils.request).toHaveBeenCalled()
      expect(Utils.request.calls.argsFor(0)[0]).toEqual('GET')
      expect(Utils.request.calls.argsFor(0)[1]).toEqual('/screenings/1.json')
    })
  })
})

