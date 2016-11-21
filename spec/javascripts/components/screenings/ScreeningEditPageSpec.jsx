import * as Utils from 'utils/http'
import * as screeningActions from 'actions/screening'
import * as participantActions from 'actions/participant'
import Immutable from 'immutable'
import React from 'react'
import ScreeningEditPage from 'components/screenings/ScreeningEditPage'
import {browserHistory} from 'react-router'
import {mount, shallow} from 'enzyme'

describe('ScreeningEditPage', () => {
  let wrapper
  let promiseSpyObj

  describe('render', () => {
    beforeEach(() => {
      promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
      spyOn(screeningActions, 'fetch').and.returnValue(promiseSpyObj)
      const props = {params: {id: 1}}
      wrapper = mount(<ScreeningEditPage {...props} />)
    })

    it('renders the screening reference', () => {
      wrapper.setState({
        screening: Immutable.fromJS({
          reference: 'The Rocky Horror Picture Show',
          participants: []
        })
      })
      expect(wrapper.find('h1').text()).toEqual('Edit Screening #The Rocky Horror Picture Show')
    })

    it('renders the screening information edit view', () => {
      const screening =  Immutable.fromJS({
        name: 'The Rocky Horror Picture Show',
        started_at: '2016-08-13T10:00:00.000Z',
        ended_at: '2016-08-22T11:00:00.000Z',
        communication_method: 'mail',
        participants: [],
      })
      wrapper.setState({screening: screening})
      expect(wrapper.find('InformationEditView').length).toEqual(1)
      expect(wrapper.find('InformationEditView').props().screening).toEqual(screening)
      expect(wrapper.find('InformationEditView').props().onChange).toEqual(wrapper.instance().setField)
    })

    describe('participants card', () => {
      it('renders the card header', () => {
        expect(wrapper.find('#participants-card .card-header').text()).toContain('Participants')
      })

      it('renders the participant label', () => {
        expect(wrapper.find('#participants-card label').text()).toEqual('Participants')
      })

      it('renders the autocompleter', () => {
        expect(wrapper.find('Autocompleter').props().id).toEqual('screening_participants')
        expect(wrapper.find('Autocompleter').props().onSelect).toEqual(
          wrapper.instance().createParticipant
        )
      })

      it('renders the participants card for each participant', () => {
        const participants = [
          {id: 1, first_name: 'Melissa', last_name: 'Powers'},
          {id: 2, first_name: 'Marshall', last_name: 'Powers'},
        ]
        const screening = Immutable.fromJS({participants: participants})
        wrapper.setState({screening: screening})
        expect(wrapper.find('ParticipantCardView').length).toEqual(2)
        expect(wrapper.find('ParticipantCardView').nodes.map((ele) => ele.props.mode)).toEqual(
          ['edit', 'edit']
        )
      })
    })

    it('renders the narrative edit view', () => {
      const screening =  Immutable.fromJS({
        report_narrative: 'some narrative',
        participants: [],
      })
      wrapper.setState({screening: screening})
      expect(wrapper.find('NarrativeEditView').length).toEqual(1)
      expect(wrapper.find('NarrativeEditView').props().screening).toEqual(screening)
      expect(wrapper.find('NarrativeEditView').props().onChange).toEqual(wrapper.instance().setField)
    })

    it('renders the referral edit view', () => {
      const screening = Immutable.fromJS({
        incident_date: '2006-01-21',
        incident_county: 'alpine',
        address: {
          street_address: '1500 7th St',
          city: 'Sacramento',
          state: 'CA',
          zip: 95814,
        },
        location_type: 'Juvenile Detention',
        response_time: 'within_twenty_four_hours',
        screening_decision: 'accept_for_investigation',
        participants: [],
      })
      wrapper.setState({screening: screening})
      expect(wrapper.find('ReferralInformationEditView').length).toEqual(1)
      expect(wrapper.find('ReferralInformationEditView').props().screening).toEqual(screening)
      expect(wrapper.find('ReferralInformationEditView').props().onChange).toEqual(wrapper.instance().setField)
    })
  })

  describe('fetch', () => {
    it('GETs the screening data from the server', () => {
      const props = {params: {id: 1}}
      promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
      spyOn(screeningActions, 'fetch').and.returnValue(promiseSpyObj)
      const wrapper = mount(<ScreeningEditPage {...props} />)
      wrapper.instance().fetch()
      expect(screeningActions.fetch).toHaveBeenCalledWith(1)
    })
  })

  describe('createParticipant', () => {
    const screeningId = 1
    const personId = 3
    const person = {id: personId, first_name: 'Bart'}
    const participant = {id: null, person_id: personId, screening_id: screeningId, first_name: 'Bart'}
    const screening = Immutable.fromJS({participants: []})

    beforeEach(() => {
      const jsonResponse = {id: 99, first_name: 'Bart'}
      promiseSpyObj.then.and.callFake((then) => then(jsonResponse))
      spyOn(participantActions, 'create').and.returnValue(promiseSpyObj)

      const props = {params: {id: screeningId}}
      wrapper = shallow(<ScreeningEditPage {...props} />)
      wrapper.setState({screening: screening})
    })

    it('POSTs the participant data to the server', () => {
      wrapper.instance().createParticipant(person)
      expect(participantActions.create).toHaveBeenCalledWith(1, participant)
    })

    it('adds the newly created participant', () => {
      wrapper.instance().createParticipant(person)
      expect(wrapper.instance().state.screening.toJS().participants).toEqual([{id: 99, first_name: 'Bart'}])
    })
  })

  describe('addParticipant', () => {
    it('adds the participant to an empty list of participants', () => {
      const props = {params: {id: 1}}
      const wrapper = mount(<ScreeningEditPage {...props} />).instance()
      wrapper.addParticipant({id: 1})
      const participants = wrapper.state.screening.get('participants')
      expect(participants.size).toEqual(1)
      expect(participants.get(0)).toEqual(Immutable.Map({id: 1}))
    })

    it('adds the participant to a non empty list of participants', () => {
      const props = {params: {id: 1}}
      const wrapper = mount(<ScreeningEditPage {...props} />).instance()
      wrapper.addParticipant({id: 1})
      wrapper.addParticipant({id: 2})
      const participants = wrapper.state.screening.get('participants')
      expect(participants.size).toEqual(2)
      expect(participants.get(0)).toEqual(Immutable.Map({id: 1}))
      expect(participants.get(1)).toEqual(Immutable.Map({id: 2}))
    })
  })

  describe('update', () => {
    let instance
    const screening = {participants: [{id: 99,first_name: 'Bart'}]}
    beforeEach(() => {
      promiseSpyObj.then.and.callFake((then) => then(screening))
      spyOn(screeningActions, 'save').and.returnValue(promiseSpyObj)
      spyOn(browserHistory, 'push')
      instance = wrapper.instance()
    })

    it('PUTs the screening data to the server and updates the state', () => {
      instance.update()
      expect(screeningActions.save).toHaveBeenCalledWith(1, screening)
      expect(instance.state.screening.toJS().participants).toEqual([{id: 99, first_name: 'Bart'}])
    })

    it('redirects to the screening show page', () => {
      instance.update()
      expect(browserHistory.push).toHaveBeenCalled()
    })
  })
})
