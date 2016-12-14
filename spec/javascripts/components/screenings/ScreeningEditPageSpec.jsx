import * as screeningActions from 'actions/screeningActions'
import * as participantActions from 'actions/participantActions'
import Immutable from 'immutable'
import React from 'react'
import {ScreeningEditPage} from 'components/screenings/ScreeningEditPage'
import {mount, shallow} from 'enzyme'

describe('ScreeningEditPage', () => {
  let component
  const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])

  describe('render', () => {
    it('renders the screening reference', () => {
      const props = {
        actions: {},
        params: {id: 1},
        screening: Immutable.fromJS({
          reference: 'The Rocky Horror Picture Show',
        }),
      }
      component = shallow(<ScreeningEditPage {...props} />)
      expect(component.find('h1').text()).toEqual('Edit Screening #The Rocky Horror Picture Show')
    })

    it('renders the screening information edit view', () => {
      const screening = Immutable.fromJS({
        name: 'The Rocky Horror Picture Show',
        started_at: '2016-08-13T10:00:00.000Z',
        ended_at: '2016-08-22T11:00:00.000Z',
        communication_method: 'mail',
      })
      const props = {
        actions: {},
        params: {id: 1},
        screening,
      }
      component = shallow(<ScreeningEditPage {...props} />)
      expect(component.find('InformationEditView').length).toEqual(1)
      expect(component.find('InformationEditView').props().screening).toEqual(screening)
      expect(component.find('InformationEditView').props().onChange).toEqual(component.instance().setField)
    })

    describe('participants card', () => {
      beforeEach(() => {
        const participants = [
          {id: 1, first_name: 'Melissa', last_name: 'Powers'},
          {id: 2, first_name: 'Marshall', last_name: 'Powers'},
        ]
        const screening = Immutable.fromJS({participants: participants})
        const props = {
          actions: {},
          params: {id: 1},
          screening,
        }
        component = shallow(<ScreeningEditPage {...props} />)
      })

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
        expect(component.find('ParticipantCardView').length).toEqual(2)
        expect(component.find('ParticipantCardView').nodes.map((ele) => ele.props.mode)).toEqual(
          ['edit', 'edit']
        )
      })
    })

    describe('narrative card', () => {
      beforeEach(() => {
        const screening = Immutable.fromJS({report_narrative: 'this is a narrative report'})
        const props = {
          actions: {},
          params: {id: 1},
          screening,
        }
        component = shallow(<ScreeningEditPage {...props} />)
      })

      describe('before the component has been loaded', () => {
        beforeEach(() => component.setState({loaded: false}))

        it('does not render the narrative card', () => {
          expect(component.find('NarrativeCardView').length).toEqual(0)
        })
      })

      describe('after the component has been loaded', () => {
        beforeEach(() => component.setState({loaded: true}))

        it('renders the narrative card', () => {
          expect(component.find('NarrativeCardView').length).toEqual(1)
          expect(component.find('NarrativeCardView').props().narrative).toEqual(
            'this is a narrative report'
          )
          expect(component.find('NarrativeCardView').props().mode).toEqual('edit')
        })
      })
    })

    it('renders the referral edit view', () => {
      const screening = Immutable.fromJS({name: 'my screening'})
      const props = {
        actions: {},
        params: {id: 1},
        screening,
      }
      component = shallow(<ScreeningEditPage {...props} />)
      expect(component.find('ReferralInformationEditView').length).toEqual(1)
      expect(component.find('ReferralInformationEditView').props().screening).toEqual(screening)
      expect(component.find('ReferralInformationEditView').props().onChange).toEqual(component.instance().setField)
    })
  })

  describe('componentDidMount', () => {
    const fetchScreening = jasmine.createSpy('fetchScreening')
    beforeEach(() => {
      const props = {
        params: {id: 222},
        actions: {fetchScreening},
        screening: Immutable.Map(),
      }
      fetchScreening.and.returnValue(Promise.resolve())
      mount(<ScreeningEditPage {...props} />)
    })

    it('GETs the screening from the server', () => {
      expect(fetchScreening).toHaveBeenCalledWith(222)
    })
  })

  describe('createParticipant', () => {
    const personId = 3
    const person = {id: personId}
    const fetchScreening = jasmine.createSpy('fetchScreening')
    fetchScreening.and.returnValue(Promise.resolve())
    const props = {
      actions: {fetchScreening},
      params: {id: 1},
      screening: Immutable.Map(),
    }
    const participant = {id: null, screening_id: props.params.id, person_id: personId}

    beforeEach(() => {
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
      const fetchScreening = jasmine.createSpy('fetchScreening')
      fetchScreening.and.returnValue(Promise.resolve())
      const props = {
        actions: {fetchScreening},
        params: {id: 1},
        screening: Immutable.Map(),
      }
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

  describe('saveAll', () => {
    let component
    let saveButton
    const saveScreening = jasmine.createSpy('saveScreening')
    beforeEach(() => {
      const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
      saveScreening.and.returnValue(promiseSpyObj)
      promiseSpyObj.then.and.returnValue(promiseSpyObj)
      // the above line is needed for the return from narrative card save
      const fetchScreening = jasmine.createSpy('fetchScreening')
      fetchScreening.and.returnValue(Promise.resolve())

      const props = {
        params: {id: 1},
        screening: Immutable.Map({name: 'my screening', report_narrative: null}),
        actions: {fetchScreening, saveScreening},
      }
      component = mount(<ScreeningEditPage {...props} />)
      component.setState({loaded: true})
      saveButton = component.find('button.btn.btn-primary').last()
    })

    it('calls save action with current screening', () => {
      saveButton.simulate('click')
      expect(saveScreening).toHaveBeenCalledWith(
        {name: 'my screening', report_narrative: null}
      )
    })

    describe('with narrative changes', () => {
      beforeEach(() => {
        const narrative = component.find('#report_narrative')
        narrative.simulate('change', {target: {value: 'Changed narrative'}})
      })

      it('calls save action with updated narrative', () => {
        saveButton.simulate('click')
        expect(saveScreening).toHaveBeenCalledWith(
          {name: 'my screening', report_narrative: 'Changed narrative'}
        )
      })
    })
  })

  describe('cardSave', () => {
    let component
    const saveScreening = jasmine.createSpy('saveScreening')
    beforeEach(() => {
      const props = {
        params: {id: 1},
        screening: Immutable.Map(),
        actions: {saveScreening},
      }
      component = shallow(<ScreeningEditPage {...props} />)
    })

    it('calls screening save', () => {
      component.instance().cardSave(['report_narrative'], 'This is my new narrative')
      expect(saveScreening).toHaveBeenCalledWith({report_narrative: 'This is my new narrative'})
    })
  })
})
