import * as screeningActions from 'actions/screeningActions'
import * as participantActions from 'actions/participantActions'
import Immutable from 'immutable'
import React from 'react'
import ScreeningEditPage from 'components/screenings/ScreeningEditPage'
import {browserHistory} from 'react-router'
import {mount, shallow} from 'enzyme'

describe('ScreeningEditPage', () => {
  let wrapper
  const screeningWithRequiredAttributes = {
    participants: [],
    report_narrative: 'A Sample Narrative',
  }
  const props = {params: {id: 1}}
  const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])

  var loadComponent = () => {
    spyOn(screeningActions, 'fetch').and.returnValue(promiseSpyObj)
    promiseSpyObj.then.and.callFake((then) => then(screeningWithRequiredAttributes))
  }

  describe('render', () => {
    beforeEach(() => {
      loadComponent()
      wrapper = mount(<ScreeningEditPage {...props} />)
    })

    it('renders the screening reference', () => {
      wrapper.setState({
        screening: Immutable.fromJS({
          reference: 'The Rocky Horror Picture Show',
          ...screeningWithRequiredAttributes,
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
        ...screeningWithRequiredAttributes,
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
        const screening = Immutable.fromJS({
          ...screeningWithRequiredAttributes,
          participants: participants,
        })
        wrapper.setState({screening: screening})
        expect(wrapper.find('ParticipantCardView').length).toEqual(2)
        expect(wrapper.find('ParticipantCardView').nodes.map((ele) => ele.props.mode)).toEqual(
          ['edit', 'edit']
        )
      })
    })

    describe('narrative card', () => {
      let screening
      beforeEach(() => {
        screening = Immutable.fromJS({
          report_narrative: 'this is a narrative report',
          ...screeningWithRequiredAttributes,
        })
        wrapper.setState({screening: screening})
      })

      it('renders the narrative card', () => {
        expect(wrapper.find('NarrativeCardView').length).toEqual(1)
      })

      it('has screening passed in props', () => {
        expect(wrapper.find('NarrativeCardView').props().narrative).toEqual(
          screening.get('report_narrative')
        )
      })

      it('has mode set to edit', () => {
        expect(wrapper.find('NarrativeCardView').props().mode).toEqual('edit')
      })
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
        ...screeningWithRequiredAttributes,
      })
      wrapper.setState({screening: screening})
      expect(wrapper.find('ReferralInformationEditView').length).toEqual(1)
      expect(wrapper.find('ReferralInformationEditView').props().screening).toEqual(screening)
      expect(wrapper.find('ReferralInformationEditView').props().onChange).toEqual(wrapper.instance().setField)
    })
  })

  describe('fetch', () => {
    let wrapper
    beforeEach(() => {
      loadComponent()
      wrapper = mount(<ScreeningEditPage {...props} />)
    })

    it('GETs the screening data from the server', () => {
      wrapper.instance().fetch()
      expect(screeningActions.fetch).toHaveBeenCalledWith(1)
    })
  })

  describe('createParticipant', () => {
    const personId = 3
    const person = {id: personId}
    const participant = {id: null, screening_id: props.params.id, person_id: personId}

    beforeEach(() => {
      const jsonResponse = {id: 99, first_name: 'Bart'}
      promiseSpyObj.then.and.callFake((then) => then(jsonResponse))
      spyOn(participantActions, 'create').and.returnValue(promiseSpyObj)
      wrapper = shallow(<ScreeningEditPage {...props} />)
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
      const wrapper = mount(<ScreeningEditPage {...props} />).instance()
      wrapper.addParticipant({id: 1})
      const participants = wrapper.state.screening.get('participants')
      expect(participants.size).toEqual(1)
      expect(participants.get(0)).toEqual(Immutable.Map({id: 1}))
    })

    it('adds the participant to a non empty list of participants', () => {
      const wrapper = mount(<ScreeningEditPage {...props} />).instance()
      wrapper.addParticipant({id: 1})
      wrapper.addParticipant({id: 2})
      const participants = wrapper.state.screening.get('participants')
      expect(participants.size).toEqual(2)
      expect(participants.get(0)).toEqual(Immutable.Map({id: 1}))
      expect(participants.get(1)).toEqual(Immutable.Map({id: 2}))
    })
  })

  var createSpyOnSave = () => {
    spyOn(screeningActions, 'save').and.returnValue(promiseSpyObj)
    promiseSpyObj.then.and.callFake((afterThen) => afterThen(screeningWithRequiredAttributes))
    promiseSpyObj.then.and.returnValue(promiseSpyObj)
  }

  describe('saving', () => {
    let wrapper
    let saveButton
    beforeEach(() => {
      createSpyOnSave()
      wrapper = mount(<ScreeningEditPage {...props} />)
      wrapper.setState({
        screening: Immutable.fromJS(screeningWithRequiredAttributes),
        loaded: true,
      })
      const nameOfScreening = wrapper.find('#name')
      nameOfScreening.simulate('change', { target: { value: 'my screening' }})
      saveButton = wrapper.find('button.btn.btn-primary').last()
    })

    it('calls save action with current screening', () => {
      saveButton.simulate('click')
      expect(screeningActions.save).toHaveBeenCalled()
      expect(screeningActions.save.calls.argsFor(0)[0]).toEqual(1)
      expect(screeningActions.save.calls.argsFor(0)[1].name).toEqual(
        'my screening'
      )
    })

    describe('with narrative changes', () => {
      beforeEach(() => {
        const narrative = wrapper.find('#report_narrative')
        narrative.simulate('change', { target: { value: 'Changed narrative' }})
      })

      it('calls save action with updated narrative', () => {
        saveButton.simulate('click')
        expect(screeningActions.save).toHaveBeenCalled()
        expect(screeningActions.save.calls.argsFor(0)[0]).toEqual(1)
        expect(screeningActions.save.calls.argsFor(0)[1].report_narrative).toEqual(
          'Changed narrative'
        )
      })
    })
  })

  describe('cardSave', () => {
    let wrapper
    beforeEach(() => {
      createSpyOnSave()
      wrapper = mount(<ScreeningEditPage {...props} />)
    })

    it('calls screening save', () => {
      wrapper.instance().cardSave(['report_narrative'], 'This is my new narrative')
      expect(screeningActions.save).toHaveBeenCalled()
    })

    it('does not redirect to the screening show page', () => {
      const instance = wrapper.instance()
      spyOn(instance, 'show')
      wrapper.instance().cardSave(['report_narrative'], 'This is my new narrative')
      expect(instance.show).not.toHaveBeenCalled()
    })
  })
})
