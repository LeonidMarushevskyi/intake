import * as Utils from 'utils/http'
import Immutable from 'immutable'
import ScreeningEditPage from 'components/screenings/ScreeningEditPage'
import React from 'react'
import {mount} from 'enzyme'

describe('ScreeningEditPage', () => {
  let xhrSpyObject
  beforeEach(() => {
    xhrSpyObject = jasmine.createSpyObj('xhrSpyObj', ['done'])
    spyOn(Utils, 'request').and.returnValue(xhrSpyObject)
  })

  describe('render', () => {
    let wrapper
    beforeEach(() => {
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
      const wrapper = mount(<ScreeningEditPage {...props} />)
      wrapper.instance().fetch()
      expect(Utils.request).toHaveBeenCalled()
      expect(Utils.request.calls.argsFor(1)[0]).toEqual('GET')
      expect(Utils.request.calls.argsFor(1)[1]).toEqual('/screenings/1.json')
    })
  })

  describe('createParticipant', () => {
    let wrapper
    const personId = 99
    const screeningId = 1
    const person = {id: personId}
    const participant = {id: null, person_id: personId, screening_id: screeningId}

    beforeEach(() => {
      let alreadyCalled = false
      const xhrResponse = {responseJSON: {participants: []}}

      xhrSpyObject.done.and.callFake((afterDone) => {
        if(alreadyCalled) { return afterDone(participant) }
        alreadyCalled = true
        return afterDone(xhrResponse)
      })
      const props = {params: {id: screeningId}}
      wrapper = mount(<ScreeningEditPage {...props} />).instance()
      spyOn(wrapper, 'addParticipant')
    })

    it('POSTs the participant data to the server', () => {
      wrapper.createParticipant(person)
      expect(Utils.request).toHaveBeenCalled()
      expect(Utils.request.calls.argsFor(1)[0]).toEqual('POST')
      expect(Utils.request.calls.argsFor(1)[1]).toEqual('/screenings/1/participants.json')
      expect(Utils.request.calls.argsFor(1)[2]).toEqual({participant: participant})
    })

    it('adds the newly created participant', () => {
      wrapper.createParticipant(person)
      expect(wrapper.addParticipant).toHaveBeenCalled()
    })
  })

  describe('addParticipant', () => {
    it('adds the participant to an empty list of participants', () => {
      const props = {params: {id: 1}}
      const wrapper = mount(<ScreeningEditPage {...props} />).instance()
      wrapper.addParticipant({id: 1})
      const participant_ids = wrapper.state.screening.get('participant_ids')
      expect(Immutable.is(participant_ids, Immutable.List.of(1))).toEqual(true)
      const participants = wrapper.state.screening.get('participants')
      expect(participants.size).toEqual(1)
      expect(participants.get(0)).toEqual(Immutable.Map({id: 1}))
    })

    it('adds the participant to a non empty list of participants', () => {
      const props = {params: {id: 1}}
      const wrapper = mount(<ScreeningEditPage {...props} />).instance()
      wrapper.addParticipant({id: 1})
      wrapper.addParticipant({id: 2})
      const participant_ids = wrapper.state.screening.get('participant_ids')
      expect(Immutable.is(participant_ids, Immutable.List.of(1, 2))).toEqual(true)
      const participants = wrapper.state.screening.get('participants')
      expect(participants.size).toEqual(2)
      expect(participants.get(0)).toEqual(Immutable.Map({id: 1}))
      expect(participants.get(1)).toEqual(Immutable.Map({id: 2}))
    })
  })

  describe('update', () => {
    let wrapper
    beforeEach(() => {
      const xhrResponse = {responseJSON: {'participants': []}}
      xhrSpyObject.done.and.callFake((afterDone) => afterDone(xhrResponse))
      const props = {params: {id: 1}}
      wrapper = mount(<ScreeningEditPage {...props} />)
    })

    it('PUTs the screening data to the server', () => {
      wrapper.instance().update()
      expect(Utils.request).toHaveBeenCalled()
      expect(Utils.request.calls.argsFor(1)[0]).toEqual('PUT')
      expect(Utils.request.calls.argsFor(1)[1]).toEqual('/screenings/1.json')
    })

    it('redirects to the screening show page', () => {
      const instance = wrapper.instance()
      spyOn(instance, 'show')
      instance.update()
      expect(instance.show).toHaveBeenCalled()
    })
  })
})
