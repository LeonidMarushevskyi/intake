import ScreeningShowPage from 'components/screenings/ScreeningShowPage'
import React from 'react'
import {mount} from 'enzyme'
import * as Utils from 'utils/http'
import Immutable from 'immutable'

describe('ScreeningShowPage', () => {
  let wrapper
  beforeEach(() => {
    const xhrSpyObject = jasmine.createSpyObj('xhrSpyObj', ['done'])
    spyOn(Utils, 'request').and.returnValue(xhrSpyObject)

    const props = {params: {id: 1}}
    wrapper = mount(<ScreeningShowPage {...props} />)
  })

  describe('render', () => {
    it('renders the screening reference', () => {
      wrapper.setState({
        screening: Immutable.fromJS({
          reference: 'The Rocky Horror Picture Show',
          participants: []
        })
      })
      expect(wrapper.find('h1').text()).toEqual('Screening #The Rocky Horror Picture Show')
    })

    it('renders the home and edit link', () => {
      const links = wrapper.find('a')
      expect(links.length).toEqual(2)
      expect(links.map((element) => element.text())).toEqual(['Home', 'Edit'])
    })

    it('render cards', () => {
      const screening = Immutable.fromJS({participants: []})
      wrapper.setState({screening: screening})
      expect(wrapper.find('InformationShowView').length).toEqual(1)
      expect(wrapper.find('NarrativeShowView').length).toEqual(1)
      expect(wrapper.find('ReferralInformationShowView').length).toEqual(1)
    })

    describe('participants card', () => {
      it('renders the participants card for each participant', () => {
        const participants = [
          {id: 1, first_name: 'Rodney', last_name: 'Mullens'},
          {id: 5, first_name: 'Tony', last_name: 'Hawk'},
        ]
        const screening = Immutable.fromJS({participants: participants})
        wrapper.setState({screening: screening})
        expect(wrapper.find('ParticipantCardView').length).toEqual(2)
        expect(wrapper.find('ParticipantCardView').nodes.map((ele) => ele.props.mode)).toEqual(
          ['show', 'show']
        )
      })
    })
  })

  describe('fetch', () => {
    it('GETs the screening data from the server', () => {
      wrapper.instance().fetch()

      expect(Utils.request).toHaveBeenCalled()
      expect(Utils.request.calls.argsFor(0)[0]).toEqual('GET')
      expect(Utils.request.calls.argsFor(0)[1]).toEqual('/screenings/1.json')
    })
  })
})
