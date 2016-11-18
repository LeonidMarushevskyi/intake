import ScreeningShowPage from 'components/screenings/ScreeningShowPage'
import React from 'react'
import {mount} from 'enzyme'
import * as Utils from 'utils/http'
import Immutable from 'immutable'

describe('ScreeningShowPage', () => {
  let wrapper
  let promiseSpyObj
  beforeEach(() => {
    promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
    spyOn(Utils, 'request').and.returnValue(promiseSpyObj)

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
      const links = wrapper.find('Link')
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
      let instance = wrapper.instance()
      const screening = {id: 1, participants: []}
      promiseSpyObj.then.and.callFake((then) => then(screening))
      instance.fetch()

      expect(Utils.request).toHaveBeenCalledWith('GET', '/screenings/1.json')
      expect(wrapper.find('Link').nodes[1].props.to).toEqual(`/screenings/${screening.id}/edit`)
    })
  })
})
