import Immutable from 'immutable'
import React from 'react'
import {ScreeningEditPage, mapStateToProps} from 'components/screenings/ScreeningEditPage'
import {mount, shallow} from 'enzyme'

describe('ScreeningEditPage', () => {
  const requiredProps = {
    actions: {},
    params: {id: '1'},
    participants: Immutable.List(),
    screening: Immutable.fromJS({
      allegations: [],
    }),
  }

  describe('render', () => {
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
          {id: '1', first_name: 'Melissa', last_name: 'Powers', roles: []},
          {id: '2', first_name: 'Marshall', last_name: 'Powers', roles: []},
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

    it('does not render the cross report card view', () => {
      const component = shallow(<ScreeningEditPage {...requiredProps} />)
      expect(component.find('CrossReportCardView').length).toEqual(0)
    })

    it('renders the cross report card view', () => {
      const props = {
        ...requiredProps,
        screening: Immutable.fromJS({cross_reports: []}),
      }
      const component = shallow(<ScreeningEditPage {...props} />)
      component.setState({loaded: true})
      expect(component.find('CrossReportCardView').length).toEqual(1)
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
      const props = {
        ...requiredProps,
        allegations: Immutable.List(),
        mode: 'edit',
      }
      const component = shallow(<ScreeningEditPage {...props} />)
      const allegationsCard = component.find('AllegationsCardView')
      expect(allegationsCard.length).toEqual(1)
      expect(allegationsCard.props().allegations).toEqual(Immutable.List())
      expect(allegationsCard.props().mode).toEqual('edit')
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
        ...requiredProps,
        actions: {fetchScreening},
        params: {id: '222'},
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
    let props
    const newScreeningState = Immutable.fromJS({report_narrative: 'my updated narrative'})

    beforeEach(() => {
      const fetchScreening = jasmine.createSpy('fetchScreening')
      fetchScreening.and.returnValue(Promise.resolve())
      props = {
        ...requiredProps,
        actions: {fetchScreening},
        params: {id: '222'},
        screening: Immutable.fromJS({
          report_narrative: 'my narrative',
          allegations: [],
        }),
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
      const screening = props.screening.merge({id: '1'})
      component.setProps({screening})
      const instance = component.instance()
      expect(instance.state.screening).not.toEqual(newScreeningState)
      expect(instance.state.screening).toEqual(screening)
    })
  })

  describe('cardSave', () => {
    const saveScreening = jasmine.createSpy('saveScreening')
    beforeEach(() => {
      const props = {
        ...requiredProps,
        actions: {saveScreening},
      }
      const component = shallow(<ScreeningEditPage {...props} />)
      component.instance().setField(['report_narrative'], 'This is my new narrative')
      component.instance().setField(['address', 'city'], 'Sacramento')
      component.instance().cardSave(['report_narrative'])
    })

    it('calls screening save', () => {
      const existingScreeningAttributes = requiredProps.screening.toJS()
      expect(saveScreening).toHaveBeenCalledWith({
        ...existingScreeningAttributes,
        report_narrative: 'This is my new narrative',
      })
      expect(saveScreening).not.toHaveBeenCalledWith({
        ...existingScreeningAttributes,
        city: 'Sacramento',
      })
    })
  })

  describe('participants-related functions', () => {
    const saveParticipant = jasmine.createSpy('saveParticipant')
    const deleteParticipant = jasmine.createSpy('deleteParticipant')
    const createParticipant = jasmine.createSpy('createParticipant')

    const address1 = Immutable.Map({
      city: 'Sacramento',
      id: '12',
      state: 'California',
      street_address: '123 Camino ave',
      type: 'Home',
      zip: '94533',
    })
    const address2 = Immutable.Map({
      city: 'Sac',
      id: '13',
      state: 'California',
      street_address: '123 Fake ave',
      type: 'Home',
      zip: '94532',
    })

    const participantId1 = '3'
    const participant1 = Immutable.Map({
      id: participantId1,
      first_name: 'Bart',
      last_name: 'Simpson',
      gender: 'male',
      ssn: '987654321',
      date_of_birth: null,
      person_id: '1',
      screening_id: '3',
      addresses: Immutable.List([address1, address2]),
    })

    const participantId2 = '4'
    const participant2 = Immutable.Map({
      id: participantId2,
      first_name: 'Marge',
      last_name: 'Simpson',
      gender: 'female',
      ssn: '123456789',
      date_of_birth: null,
      person_id: '2',
      screening_id: '3',
      addresses: Immutable.List(),
    })

    const props = {
      ...requiredProps,
      actions: {createParticipant, saveParticipant, deleteParticipant},
      params: {id: '3'},
      participants: Immutable.List([participant1, participant2]),
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

        component.instance().setParticipantField(participantId1, updatedParticipant1)
        component.instance().setParticipantField(participantId2, updatedParticipant2)

        expect(component.instance().state.participantsEdits.get(participantId1)).toEqual(updatedParticipant1)
        expect(component.instance().state.participantsEdits.get(participantId2)).toEqual(updatedParticipant2)

        component.instance().cancelParticipantEdit(participantId1)

        expect(component.instance().state.participantsEdits.get(participantId1)).toEqual(undefined)
        expect(component.instance().state.participantsEdits.get(participantId2)).toEqual(updatedParticipant2)
      })
    })

    describe('setParticipantField', () => {
      it('sets edits for only the specified participant', () => {
        const updatedParticipant = participant2.setIn(['last_name'], 'Simpsoooooon')
        component.instance().setParticipantField(participantId2, updatedParticipant)
        expect(component.instance().state.participantsEdits.get(participantId1)).toEqual(undefined)
        expect(component.instance().state.participantsEdits.get(participantId2)).toEqual(updatedParticipant)
      })
    })

    describe('saveParticipant', () => {
      it('uses the appropriate data and makes an API request', () => {
        const updatedParticipant = participant1.setIn(['first_name'], 'shere khan')
        component.instance().saveParticipant(updatedParticipant)
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
        component.instance().setParticipantField(participantId1, editedParticipant)
        const participants = Immutable.List([editedParticipant, participant2])
        expect(Immutable.is(component.instance().participants(), participants)).toEqual(true)
      })

      it('does not break when there are edits to one item in the list, but not others', () => {
        const editedParticipant = participant2.set('first_name', 'Lisa')
        component.instance().setParticipantField(participantId2, editedParticipant)
        const participants = Immutable.List([participant1, editedParticipant])
        expect(Immutable.is(component.instance().participants(), participants)).toEqual(true)
      })

      it('reflects edits made to a participant address', () => {
        const updatedAddress = address1.set('street_address', '555 real st')
        const updatedParticipant = participant1.set('addresses', Immutable.List([updatedAddress, address2]))
        component.instance().setParticipantField(participantId1, updatedParticipant)
        const participants = Immutable.List([updatedParticipant, participant2])
        expect(Immutable.is(component.instance().participants(), participants)).toEqual(true)
      })

      it('reflects when a participant address is deleted', () => {
        const updatedParticipant = participant1.set('addresses', Immutable.List([address2]))
        component.instance().setParticipantField(participantId1, updatedParticipant)
        const participants = Immutable.List([updatedParticipant, participant2])
        expect(Immutable.is(component.instance().participants(), participants)).toEqual(true)
      })
    })
  })

  describe('allegations', () => {
    const victim = {
      id: '1',
      first_name: 'Bart',
      last_name: 'Simpson',
      roles: ['Victim'],
    }
    const perpetrator = {
      id: '2',
      first_name: 'Homer',
      last_name: 'Simpson',
      roles: ['Perpetrator'],
    }
    const saveScreening = jasmine.createSpy('saveScreening')
    const props = {
      ...requiredProps,
      actions: {
        fetchScreening: () => Promise.resolve(),
        saveScreening,
      },
      screening: Immutable.fromJS({
        id: '3',
        participants: [victim, perpetrator],
        allegations: [{
          id: null,
          perpetrator,
          perpetrator_id: perpetrator.id,
          screening_id: '3',
          victim,
          victim_id: victim.id,
        }],
      }),
    }

    it('builds and saves allegations after clicking save', () => {
      const component = mount(<ScreeningEditPage {...props} />)
      const allegationsCard = component.find('AllegationsEditView')
      const saveButton = allegationsCard.find('button[children="Save"]')
      expect(saveButton.length).toEqual(1)
      saveButton.simulate('click')
      expect(saveScreening).toHaveBeenCalledWith({
        id: '3',
        participants: [victim, perpetrator],
        allegations: [{
          id: null,
          perpetrator,
          perpetrator_id: perpetrator.id,
          screening_id: '3',
          victim,
          victim_id: victim.id,
        }],
      })
    })
  })

  describe('.mapStateToProps', () => {
    const victim = {
      id: '1',
      first_name: 'Bart',
      last_name: 'Simpson',
      roles: ['Victim'],
    }
    const perpetrator = {
      id: '2',
      first_name: 'Homer',
      last_name: 'Simpson',
      roles: ['Perpetrator'],
    }

    it('generates new allegations for the participants when there are no persisted allegations', () => {
      const participants = Immutable.fromJS([victim, perpetrator])
      const screening = Immutable.fromJS({id: '3', allegations: []})
      const state = {participants, screening}
      const mappedState = mapStateToProps(state, null)
      const expectedScreening = {
        id: '3',
        allegations: [{
          id: null,
          screening_id: '3',
          perpetrator,
          perpetrator_id: perpetrator.id,
          victim,
          victim_id: victim.id,
        }],
      }
      expect(mappedState.screening.toJS()).toEqual(expectedScreening)
      expect(Immutable.is(mappedState.screening, Immutable.fromJS(expectedScreening))).toEqual(true)
    })

    it('replaces generated allegations with persisted allegations', () => {
      const participants = Immutable.fromJS([victim, perpetrator])
      const persisted_allegations = [
        {id: '9', victim_id: '1', perpetrator_id: '2', screening_id: '3'},
      ]
      const screening = Immutable.fromJS({id: '3', allegations: persisted_allegations})
      const state = {participants, screening}
      const mappedState = mapStateToProps(state, null)
      const expectedScreening = {
        id: '3',
        allegations: [{
          id: '9',
          screening_id: '3',
          perpetrator,
          perpetrator_id: perpetrator.id,
          victim,
          victim_id: victim.id,
        }],
      }
      expect(mappedState.screening.toJS()).toEqual(expectedScreening)
      expect(Immutable.is(mappedState.screening, Immutable.fromJS(expectedScreening))).toEqual(true)
    })

    it('interleaves generated allegations with persisted allegations', () => {
      const anotherPerpetrator = {
        id: '3',
        first_name: 'Marge',
        last_name: 'Simpson',
        roles: ['Perpetrator'],
      }
      const participants = Immutable.fromJS([victim, perpetrator, anotherPerpetrator])
      const persisted_allegations = [
        {id: '9', victim_id: '1', perpetrator_id: '2', screening_id: '3'},
      ]
      const screening = Immutable.fromJS({id: '3', allegations: persisted_allegations})
      const state = {participants, screening}
      const mappedState = mapStateToProps(state, null)
      const expectedScreening = {
        id: '3',
        allegations: [{
          id: '9',
          screening_id: '3',
          perpetrator,
          perpetrator_id: perpetrator.id,
          victim,
          victim_id: victim.id,
        }, {
          id: null,
          screening_id: '3',
          perpetrator: anotherPerpetrator,
          perpetrator_id: anotherPerpetrator.id,
          victim,
          victim_id: victim.id,
        }],
      }
      expect(mappedState.screening.toJS()).toEqual(expectedScreening)
      expect(Immutable.is(mappedState.screening, Immutable.fromJS(expectedScreening))).toEqual(true)
    })
  })
})
