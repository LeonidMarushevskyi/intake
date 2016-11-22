import * as screeningActions from 'actions/screeningActions'
import * as participantActions from 'actions/participantActions'
import Immutable from 'immutable'
import React from 'react'
import ScreeningEditPage from 'components/screenings/ScreeningEditPage'
import {browserHistory} from 'react-router'
import {mount, shallow} from 'enzyme'

describe('ScreeningEditPage', () => {
  let component
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
      component = mount(<ScreeningEditPage {...props} />)
    })

    it('renders the screening reference', () => {
      component.setState({
        screening: Immutable.fromJS({
          reference: 'The Rocky Horror Picture Show',
          ...screeningWithRequiredAttributes,
        })
      })
      expect(component.find('h1').text()).toEqual('Edit Screening #The Rocky Horror Picture Show')
    })

    it('renders the screening information edit view', () => {
      const screening =  Immutable.fromJS({
        name: 'The Rocky Horror Picture Show',
        started_at: '2016-08-13T10:00:00.000Z',
        ended_at: '2016-08-22T11:00:00.000Z',
        communication_method: 'mail',
        ...screeningWithRequiredAttributes,
      })
      component.setState({screening: screening})
      expect(component.find('InformationEditView').length).toEqual(1)
      expect(component.find('InformationEditView').props().screening).toEqual(screening)
      expect(component.find('InformationEditView').props().onChange).toEqual(component.instance().setField)
    })

    describe('participants card', () => {
      it('renders the card header', () => {
        expect(component.find('#participants-card .card-header').text()).toContain('Participants')
      })

      it('renders the participant label', () => {
        expect(component.find('#participants-card label').text()).toEqual('Participants')
      })

      it('renders the autocompleter', () => {
        expect(component.find('Autocompleter').props().id).toEqual('screening_participants')
        expect(component.find('Autocompleter').props().onSelect).toEqual(
          component.instance().createParticipant
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
        component.setState({screening: screening})
        expect(component.find('ParticipantCardView').length).toEqual(2)
        expect(component.find('ParticipantCardView').nodes.map((ele) => ele.props.mode)).toEqual(
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
        component.setState({screening: screening})
      })

      it('renders the narrative card', () => {
        expect(component.find('NarrativeCardView').length).toEqual(1)
      })

      it('has screening passed in props', () => {
        expect(component.find('NarrativeCardView').props().narrative).toEqual(
          screening.get('report_narrative')
        )
      })

      it('has mode set to edit', () => {
        expect(component.find('NarrativeCardView').props().mode).toEqual('edit')
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
      component.setState({screening: screening})
      expect(component.find('ReferralInformationEditView').length).toEqual(1)
      expect(component.find('ReferralInformationEditView').props().screening).toEqual(screening)
      expect(component.find('ReferralInformationEditView').props().onChange).toEqual(component.instance().setField)
    })
  })

  describe('fetch', () => {
    let component
    beforeEach(() => {
      loadComponent()
      component = mount(<ScreeningEditPage {...props} />)
    })

    it('GETs the screening data from the server', () => {
      component.instance().fetch()
      expect(screeningActions.fetch).toHaveBeenCalledWith(1)
    })
  })

  describe('createParticipant', () => {
    const personId = 3
    const person = {id: personId}
    const participant = {id: null, screening_id: props.params.id, person_id: personId}

    beforeEach(() => {
      loadComponent()
      const jsonResponse = {id: 99, first_name: 'Bart'}
      promiseSpyObj.then.and.callFake((then) => then(jsonResponse))
      spyOn(participantActions, 'create').and.returnValue(promiseSpyObj)
      component = shallow(<ScreeningEditPage {...props} />)
    })

    it('POSTs the participant data to the server', () => {
      component.instance().createParticipant(person)
      expect(participantActions.create).toHaveBeenCalledWith(1, participant)
    })

    it('adds the newly created participant', () => {
      component.instance().createParticipant(person)
      expect(component.instance().state.screening.toJS().participants).toEqual([{id: 99, first_name: 'Bart'}])
    })
  })

  describe('addParticipant', () => {
    let component
    beforeEach(() => {
      loadComponent()
      component = mount(<ScreeningEditPage {...props} />).instance()
    })

    it('adds the participant to an empty list of participants', () => {
      component.addParticipant({id: 1})
      const participants = component.state.screening.get('participants')
      expect(participants.size).toEqual(1)
      expect(participants.get(0)).toEqual(Immutable.Map({id: 1}))
    })

    it('adds the participant to a non empty list of participants', () => {
      component.addParticipant({id: 1})
      component.addParticipant({id: 2})
      const participants = component.state.screening.get('participants')
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
    let component
    let saveButton
    beforeEach(() => {
      loadComponent()
      createSpyOnSave()
      component = mount(<ScreeningEditPage {...props} />)
      component.setState({
        screening: Immutable.fromJS(screeningWithRequiredAttributes),
        loaded: true,
      })
      const nameOfScreening = component.find('#name')
      nameOfScreening.simulate('change', { target: { value: 'my screening' }})
      saveButton = component.find('button.btn.btn-primary').last()
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
        const narrative = component.find('#report_narrative')
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
    let component
    beforeEach(() => {
      loadComponent()
      createSpyOnSave()
      component = mount(<ScreeningEditPage {...props} />)
    })

    it('calls screening save', () => {
      component.instance().cardSave(['report_narrative'], 'This is my new narrative')
      expect(screeningActions.save).toHaveBeenCalled()
    })

    it('does not redirect to the screening show page', () => {
      const instance = component.instance()
      spyOn(instance, 'show')
      component.instance().cardSave(['report_narrative'], 'This is my new narrative')
      expect(instance.show).not.toHaveBeenCalled()
    })
  })
})
