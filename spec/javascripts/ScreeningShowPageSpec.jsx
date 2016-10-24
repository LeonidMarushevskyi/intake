import ScreeningShowPage from 'ScreeningShowPage'
import React from 'react'
import {mount} from 'enzyme'
import * as Utils from 'utils/http'
import Immutable from 'immutable'

describe('ScreeningShowPage', () => {
  beforeEach(() => {
    const xhrSpyObject = jasmine.createSpyObj('xhrSpyObj', ['done'])
    spyOn(Utils, 'request').and.returnValue(xhrSpyObject)
  })

  describe('render', () => {
    describe('participants cards', () => {
      it('renders a card for each participant', () => {
        const props = {params: {}}
        const wrapper = mount(<ScreeningShowPage {...props} />)
        wrapper.setState({
          screening: Immutable.fromJS({
            participants: [{
              id: 1, first_name: 'Rodney', last_name: 'Mullens',
            }, {
              id: 5, first_name: 'Tony', last_name: 'Hawk',
            }],
          }),
        })
        expect(wrapper.find('#participants-card-1 .card-header').text()).toContain('Rodney Mullens')
        expect(wrapper.find('#participants-card-5 .card-header').text()).toContain('Tony Hawk')
      })
    })

    describe('narrative card', () => {
      it('renders the card header', () => {
        const props = {params: {id: 1}}
        const wrapper = mount(<ScreeningShowPage {...props} />)
        expect(wrapper.find('#narrative-card .card-header').text()).toContain('Narrative')
      })

      it('renders the narrative label', () => {
        const props = {params: {}}
        const wrapper = mount(<ScreeningShowPage {...props} />)
        expect(wrapper.find('#narrative-card label').length).toEqual(1)
        expect(wrapper.find('#narrative-card label').text()).toEqual('Report Narrative')
      })

      it('renders the narratve value', () => {
        const props = {params: {}}
        const wrapper = mount(<ScreeningShowPage {...props} />)
        wrapper.setState({
          screening: Immutable.fromJS({
            report_narrative: 'some narrative',
            participants: [],
          }),
        })
        expect(wrapper.text()).toContain('some narrative')
      })
    })
  })

  describe('fetch', () => {
    it('GETs the screening data from the server', () => {
      const props = {params: {id: 1}}
      const wrapper = mount(<ScreeningShowPage {...props} />)
      wrapper.instance().fetch()

      expect(Utils.request).toHaveBeenCalled()
      expect(Utils.request.calls.argsFor(0)[0]).toEqual('GET')
      expect(Utils.request.calls.argsFor(0)[1]).toEqual('/screenings/1.json')
    })
  })
})
