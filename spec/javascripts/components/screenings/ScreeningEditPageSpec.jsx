import Immutable from 'immutable'
import React from 'react'
import {ScreeningEditPage} from 'components/screenings/ScreeningEditPage'
import {browserHistory} from 'react-router'
import {mount, shallow} from 'enzyme'

describe('ScreeningEditPage', () => {
  describe('render', () => {
    const requiredProps = {
      actions: {},
      params: {id: '1'},
      participants: Immutable.List(),
      screening: Immutable.Map(),
    }

    it('renders the screening reference', () => {
      const props = {
        ...requiredProps,
        screening: Immutable.fromJS({
          reference: 'The Rocky Horror Picture Show',
        }),
      }
      const component = shallow(<ScreeningEditPage {...props} />)
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
        ...requiredProps,
        screening,
      }
      const component = shallow(<ScreeningEditPage {...props} />)
      component.setState({loaded: true})
      expect(component.find('ScreeningInformationCardView').length).toEqual(1)
      expect(component.find('ScreeningInformationCardView').props().screening).toEqual(screening)
      expect(component.find('ScreeningInformationCardView').props().onChange).toEqual(component.instance().setField)
    })

    describe('participants card', () => {
      let component
      beforeEach(() => {
        const participants = Immutable.fromJS([
          {id: '1', first_name: 'Melissa', last_name: 'Powers'},
          {id: '2', first_name: 'Marshall', last_name: 'Powers'},
        ])
        const props = {
          ...requiredProps,
          participants,
        }
        component = shallow(<ScreeningEditPage {...props} />)
      })

      it('renders the card header', () => {
        expect(component.find('#search-card .card-header').text()).toContain('Search')
      })

      it('renders the search card', () => {
        expect(component.find('#search-card label').text()).toContain('Search for any person')
        expect(component.html()).toContain('(Children, parents, collaterals, reporters, alleged perpetrators...)')
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

    it('renders the narrative card after screening is loaded', () => {
      const props = {
        ...requiredProps,
        screening: Immutable.fromJS({report_narrative: 'this is a narrative report'}),
      }
      const component = shallow(<ScreeningEditPage {...props} />)
      component.setState({loaded: true})
      expect(component.find('NarrativeCardView').length).toEqual(1)
      expect(component.find('NarrativeCardView').props().narrative).toEqual(
        'this is a narrative report'
      )
      expect(component.find('NarrativeCardView').props().mode).toEqual('edit')
    })

    it('does not render the narrative card before screening is loaded', () => {
      const component = shallow(<ScreeningEditPage {...requiredProps} />)
      expect(component.find('NarrativeCardView').length).toEqual(0)
    })

    it('renders the decision card after screening is loaded', () => {
      const component = shallow(<ScreeningEditPage {...requiredProps} />)
      component.setState({loaded: true})
      expect(component.find('DecisionCardView').length).toEqual(1)
    })

    it('does not render the decision card before screening is loaded', () => {
      const component = shallow(<ScreeningEditPage {...requiredProps} />)
      expect(component.find('DecisionCardView').length).toEqual(0)
    })

    it('renders the cross report edit view', () => {
      const component = shallow(<ScreeningEditPage {...requiredProps} />)
      expect(component.find('CrossReportEditView').length).toEqual(1)
    })

    it('renders the incident information card after the screening is loaded', () => {
      const component = shallow(<ScreeningEditPage {...requiredProps} />)
      component.setState({loaded: true})
      expect(component.find('IncidentInformationCardView').length).toEqual(1)
      expect(component.find('IncidentInformationCardView').props().mode).toEqual('edit')
    })

    it('does not render the incident information card before the screening is loaded', () => {
      const component = shallow(<ScreeningEditPage {...requiredProps} />)
      expect(component.find('IncidentInformationCardView').length).toEqual(0)
    })

    it('renders the history card', () => {
      const component = shallow(<ScreeningEditPage {...requiredProps} />)
      expect(component.find('HistoryCard').length).toEqual(1)
    })

    it('renders the allegations card', () => {
      const component = shallow(<ScreeningEditPage {...requiredProps} />)
      expect(component.find('AllegationsCardView').length).toEqual(1)
    })

    it('renders the worker safety card', () => {
      const component = shallow(<ScreeningEditPage {...requiredProps} />)
      expect(component.find('WorkerSafetyCardView').length).toEqual(1)
    })
  })

  describe('componentDidMount', () => {
    const fetchScreening = jasmine.createSpy('fetchScreening')
    beforeEach(() => {
      const props = {
        actions: {fetchScreening},
        params: {id: '222'},
        participants: Immutable.List(),
        screening: Immutable.Map(),
      }
      fetchScreening.and.returnValue(Promise.resolve())
      mount(<ScreeningEditPage {...props} />)
    })

    it('GETs the screening from the server', () => {
      expect(fetchScreening).toHaveBeenCalledWith('222')
    })
  })

  describe('componentWillReceiveProps', () => {
    let component
    const newScreeningState = Immutable.fromJS({report_narrative: 'my updated narrative'})
    beforeEach(() => {
      const fetchScreening = jasmine.createSpy('fetchScreening')
      fetchScreening.and.returnValue(Promise.resolve())
      const props = {
        actions: {fetchScreening},
        params: {id: '222'},
        participants: Immutable.List(),
        screening: Immutable.fromJS({report_narrative: 'my narrative'}),
      }
      component = mount(<ScreeningEditPage {...props} />)
      component.setState({screening: newScreeningState})
      component.setProps(props)
    })

    it("doesn't update state if screening prop hasn't changed", () => {
      const instance = component.instance()
      expect(instance.state.screening).toEqual(newScreeningState)
    })

    it('updates state when screening prop changes', () => {
      const screening = Immutable.fromJS({id: '1'})
      component.setProps({screening})
      const instance = component.instance()
      expect(instance.state.screening).not.toEqual(newScreeningState)
      expect(instance.state.screening).toEqual(screening)
    })
  })

  describe('update', () => {
    const saveScreening = jasmine.createSpy('saveScreening')
    beforeEach(() => {
      const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
      promiseSpyObj.then.and.callFake((then) => then({}))
      saveScreening.and.returnValue(promiseSpyObj)
      const props = {
        actions: {saveScreening},
        params: {id: '1'},
        participants: Immutable.List(),
        screening: Immutable.Map({name: 'mock screening'}),
      }
      spyOn(browserHistory, 'push')
      const component = shallow(<ScreeningEditPage {...props} />)
      component.instance().update()
    })

    it('calls screening save', () => {
      expect(saveScreening).toHaveBeenCalledWith({name: 'mock screening'})
    })

    it('pushes show page to browser history', () => {
      expect(browserHistory.push).toHaveBeenCalledWith({pathname: '/screenings/1'})
    })
  })

  describe('cardSave', () => {
    const saveScreening = jasmine.createSpy('saveScreening')
    beforeEach(() => {
      const props = {
        actions: {saveScreening},
        params: {id: '1'},
        participants: Immutable.List(),
        screening: Immutable.Map(),
      }
      const component = shallow(<ScreeningEditPage {...props} />)
      component.instance().setField(['report_narrative'], 'This is my new narrative')
      component.instance().setField(['address', 'city'], 'Sacramento')
      component.instance().cardSave(['report_narrative'])
    })

    it('calls screening save', () => {
      expect(saveScreening).toHaveBeenCalledWith({report_narrative: 'This is my new narrative'})
      expect(saveScreening).not.toHaveBeenCalledWith({city: 'Sacramento'})
    })
  })

  describe('participants-related functions', () => {
    const saveParticipant = jasmine.createSpy('saveParticipant')
    const deleteParticipant = jasmine.createSpy('deleteParticipant')
    const createParticipant = jasmine.createSpy('createParticipant')

    const id1 = '3'
    const participant1 = Immutable.Map({
      id: id1,
      first_name: 'Bart',
      last_name: 'Simpson',
      gender: 'male',
      ssn: '987654321',
      date_of_birth: null,
      person_id: '1',
      screening_id: '3',
    })

    const id2 = '4'
    const participant2 = Immutable.Map({
      id: id2,
      first_name: 'Marge',
      last_name: 'Simpson',
      gender: 'female',
      ssn: '123456789',
      date_of_birth: null,
      person_id: '2',
      screening_id: '3',
    })

    const props = {
      actions: {createParticipant, saveParticipant, deleteParticipant},
      params: {id: '3'},
      participants: Immutable.List([participant1, participant2]),
      screening: Immutable.Map(),
    }

    let component

    beforeEach(() => {
      component = shallow(<ScreeningEditPage {...props} />)
    })

    describe('createParticipant', () => {
      const person = {id: '3'}
      const participant = {id: null, screening_id: props.params.id, person_id: person.id}

      it('calls the createParticipant action', () => {
        component.instance().createParticipant(person)
        expect(createParticipant).toHaveBeenCalledWith(participant)
      })
    })

    describe('deleteParticipant', () => {
      it('calls the deleteParticipant action', () => {
        component.instance().deleteParticipant('1')
        expect(deleteParticipant).toHaveBeenCalledWith('1')
      })
    })

    describe('cancelParticipantEdit', () => {
      it('removes all edits for only the specified participant', () => {
        const updatedParticipant1 = participant1.setIn(['first_name'], 'shere khan')
        const updatedParticipant2 = participant1.setIn(['last_name'], 'Simpsoooooon')

        component.instance().setParticipantField(id1, updatedParticipant1)
        component.instance().setParticipantField(id2, updatedParticipant2)

        expect(component.instance().state.participantsEdits.get(id1)).toEqual(updatedParticipant1)
        expect(component.instance().state.participantsEdits.get(id2)).toEqual(updatedParticipant2)

        component.instance().cancelParticipantEdit(id1)

        expect(component.instance().state.participantsEdits.get(id1)).toEqual(undefined)
        expect(component.instance().state.participantsEdits.get(id2)).toEqual(updatedParticipant2)
      })
    })

    describe('setParticipantField', () => {
      it('sets edits for only the specified participant', () => {
        const updatedParticipant = participant2.setIn(['last_name'], 'Simpsoooooon')
        component.instance().setParticipantField(id2, updatedParticipant)
        expect(component.instance().state.participantsEdits.get(id1)).toEqual(undefined)
        expect(component.instance().state.participantsEdits.get(id2)).toEqual(updatedParticipant)
      })
    })

    describe('saveParticipant', () => {
      it('uses the appropriate data and makes an API request', () => {
        const updatedParticipant = participant1.setIn(['first_name'], 'shere khan')
        component.instance().setParticipantField(id1, updatedParticipant)
        component.instance().saveParticipant(id1, participant1)
        expect(saveParticipant).toHaveBeenCalledWith(updatedParticipant.toJS())
      })
    })

    describe('participants', () => {
      it('uses the data stored at the server when there are no current edits', () => {
        const participants = Immutable.List([participant1, participant2])
        expect(component.instance().participants()).toEqual(participants)
      })

      it('uses edits made by the user when they are available', () => {
        const editedParticipant = participant1.set('first_name', 'Homer')
        component.instance().setParticipantField(id1, editedParticipant)
        const participants = Immutable.List([editedParticipant, participant2])
        expect(Immutable.is(component.instance().participants(), participants)).toEqual(true)
      })

      it('does not break when there are edits to one item in the list, but not others', () => {
        const editedParticipant = participant2.set('first_name', 'Lisa')
        component.instance().setParticipantField(id2, editedParticipant)
        const participants = Immutable.List([participant1, editedParticipant])
        expect(Immutable.is(component.instance().participants(), participants)).toEqual(true)
      })
    })
  })
})
