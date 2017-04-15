import Immutable from 'immutable'
import React from 'react'
import {ScreeningShowPage} from 'components/screenings/ScreeningShowPage'
import {shallow, mount} from 'enzyme'

describe('ScreeningShowPage', () => {
  const requiredScreeningAttributes = {
    allegations: [],
    id: '123456',
  }
  const requiredProps = {
    actions: {fetchScreening: () => null},
    params: {id: '1'},
    participants: Immutable.List(),
    screening: Immutable.fromJS({
      ...requiredScreeningAttributes,
    }),
    involvements: Immutable.List(),
  }

  describe('render', () => {
    it('renders the screening reference', () => {
      const props = {
        ...requiredProps,
        screening: Immutable.fromJS({
          ...requiredScreeningAttributes,
          reference: 'The Rocky Horror Picture Show',
        }),
      }
      const component = shallow(<ScreeningShowPage {...props} />)
      expect(component.find('h1').text()).toEqual('Screening #The Rocky Horror Picture Show')
    })

    it('renders the home and edit link', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      const homeLink = component.find({to: '/'})
      const editLink = component.find({to: '/screenings/1/edit'})
      expect(homeLink.html()).toContain('Home')
      expect(editLink.html()).toContain('Edit')
    })

    it('renders the screening information show card after screening is loaded', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      component.setState({loaded: true})
      expect(component.find('ScreeningInformationCardView').props().mode).toEqual('show')
    })

    it('does not render the screening information show card before screening is loaded', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      expect(component.find('ScreeningInformationCardView').length).toEqual(0)
    })

    it('renders the incident information show card after screening is loaded', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      component.setState({loaded: true})
      expect(component.find('IncidentInformationCardView').props().mode).toEqual('show')
    })

    it('does not render the incident information show card before screening is loaded', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      expect(component.find('IncidentInformationCardView').length).toEqual(0)
    })

    it('renders the decision show card after screening is loaded', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      component.setState({loaded: true})
      expect(component.find('DecisionCardView').props().mode).toEqual('show')
    })

    it('does not render the decision show card before screening is loaded', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      expect(component.find('DecisionCardView').length).toEqual(0)
    })

    it('renders the cross report show card after screening is loaded', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      component.setState({loaded: true})
      expect(component.find('CrossReportCardView').props().mode).toEqual('show')
    })

    it('does not renders the cross report show card before screening is loaded', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      expect(component.find('CrossReportCardView').length).toEqual(0)
    })

    it('renders the history card', () => {
      const involvements = Immutable.fromJS([{id: 1}, {id: 3}])
      const participants = Immutable.fromJS([{id: 1}])
      const props = {
        ...requiredProps,
        involvements,
        participants,
      }
      const component = shallow(<ScreeningShowPage {...props} />)
      expect(component.find('HistoryCard').length).toEqual(1)
      expect(component.find('HistoryCard').props().actions).toEqual(props.actions)
      expect(component.find('HistoryCard').props().involvements).toEqual(involvements)
      expect(component.find('HistoryCard').props().participants).toEqual(participants)
      expect(component.find('HistoryCard').props().screeningId).toEqual(props.params.id)
    })

    it('renders the allegations card', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps}/>)
      component.setState({loaded: true})
      const allegationsCard = component.find('AllegationsCardView')
      expect(allegationsCard.length).toEqual(1)
      expect(allegationsCard.props().allegations).toEqual(Immutable.List())
      expect(allegationsCard.props().mode).toEqual('show')
      expect(allegationsCard.props().onCancel).toEqual(component.instance().cancelEdit)
    })

    it('renders the worker safety card', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      expect(component.find('WorkerSafetyShowView').length).toEqual(1)
    })

    describe('participants card', () => {
      it('renders the participants card for each participant', () => {
        const participants = Immutable.fromJS([
          {id: '1', first_name: 'Melissa', last_name: 'Powers'},
          {id: '2', first_name: 'Marshall', last_name: 'Powers'},
        ])
        const props = {
          ...requiredProps,
          actions: {fetchScreening: () => null},
          params: {id: '1'},
          participants,
          screening: Immutable.fromJS({...requiredScreeningAttributes}),
        }
        const component = shallow(<ScreeningShowPage {...props} />)
        expect(component.find('ParticipantCardView').length).toEqual(2)
        expect(component.find('ParticipantCardView').nodes.map((ele) => ele.props.mode)).toEqual(
          ['show', 'show']
        )
      })
    })

    it('renders the narrative card after screening is loaded', () => {
      const props = {
        ...requiredProps,
        screening: Immutable.fromJS({
          ...requiredScreeningAttributes,
          report_narrative: 'this is a narrative report',
        }),
      }
      const component = shallow(<ScreeningShowPage {...props} />)
      component.setState({loaded: true})
      expect(component.find('NarrativeCardView').props().narrative).toEqual(
        'this is a narrative report'
      )
      expect(component.find('NarrativeCardView').props().mode).toEqual('show')
    })

    it('does not render the narrative card before screening is loaded', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      expect(component.find('NarrativeCardView').length).toEqual(0)
    })
  })

  describe('componentDidMount', () => {
    const fetchScreening = jasmine.createSpy('fetchScreening')
    const fetchHistoryOfInvolvements = () => Promise.resolve()
    const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
    beforeEach(() => {
      const props = {
        ...requiredProps,
        actions: {fetchScreening, fetchHistoryOfInvolvements},
        params: {id: '222'},
      }
      fetchScreening.and.returnValue(promiseSpyObj)
      mount(<ScreeningShowPage {...props} />)
    })

    it('GETs the screening from the server', () => {
      expect(fetchScreening).toHaveBeenCalledWith('222')
    })
  })

  describe('componentWillReceiveProps', () => {
    it('updates the component when screening is loaded', () => {
      const props = {
        ...requiredProps,
      }
      const component = shallow(<ScreeningShowPage {...props}/>)
      const screening = Immutable.fromJS({id: '1', reference: 'My New Reference'})
      component.setProps({screening})
      expect(component.find('h1').text()).toContain('My New Reference')
    })
  })

  describe('cardSave', () => {
    let component
    let saveScreening
    const lisa = {id: '123', first_name: 'Lisa', roles: ['Victim']}
    const marge = {id: '456', first_name: 'Marge', roles: ['Perpetrator']}
    const homer = {id: '789', first_name: 'Homer', roles: ['Perpetrator']}
    const participants = Immutable.fromJS([lisa, marge, homer])

    beforeEach(() => {
      saveScreening = jasmine.createSpy('saveScreening')
      const props = {
        ...requiredProps,
        participants,
        actions: {saveScreening},
      }
      component = shallow(<ScreeningShowPage {...props} />)
      const allegationEdit = Immutable.fromJS({123: {456: ['General neglect']}})
      component.instance().setField(['allegations'], allegationEdit)
      component.instance().setField(['report_narrative'], 'This is my new narrative')
    })

    it('calls screening save', () => {
      component.instance().cardSave(['report_narrative'])
      expect(saveScreening).toHaveBeenCalledWith({
        ...requiredScreeningAttributes,
        report_narrative: 'This is my new narrative',
      })
    })

    it('builds allegations that have allegation types when allegations is part of the fieldList', () => {
      component.instance().cardSave(['allegations'])
      expect(saveScreening).toHaveBeenCalledWith({
        ...requiredScreeningAttributes,
        allegations: [{
          id: null,
          screening_id: '123456',
          victim: lisa,
          victim_id: lisa.id,
          perpetrator: marge,
          perpetrator_id: marge.id,
          allegation_types: ['General neglect'],
        }],
      })
    })
  })

  describe('participants-related functions', () => {
    const promiseObj = jasmine.createSpyObj('promise', ['then'])
    promiseObj.then.and.callFake((thenFunction) => thenFunction())

    const saveParticipant = jasmine.createSpy('saveParticipant').and.returnValue(promiseObj)
    const deleteParticipant = jasmine.createSpy('deleteParticipant')
    const fetchScreening = jasmine.createSpy('fetchScreening')

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

    const participantId1 = '123'
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

    const participantId2 = '456'
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
      actions: {saveParticipant, deleteParticipant, fetchScreening},
      params: {id: '3'},
      participants: Immutable.List([participant1, participant2]),
    }

    let component

    beforeEach(() => {
      component = shallow(<ScreeningShowPage {...props} />)
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

        component.instance().cancelParticipantEdit(participantId2)

        expect(component.instance().state.participantsEdits.get(participantId1)).toEqual(updatedParticipant1)
        expect(component.instance().state.participantsEdits.get(participantId2)).toEqual(undefined)
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
        expect(fetchScreening).toHaveBeenCalledWith(participant1.get('screening_id'))
      })
    })

    describe('participants', () => {
      it('uses the data stored at the server when there are no current edits', () => {
        const participants = Immutable.List([participant1, participant2])
        expect(component.instance().participants()).toEqual(participants)
      })

      it('uses edits made by the user when they are available', () => {
        const editedParticipant = participant1.setIn(['first_name'], 'Homer')
        component.instance().setParticipantField(participantId1, editedParticipant)
        const participants = Immutable.List([editedParticipant, participant2])
        expect(Immutable.is(component.instance().participants(), participants)).toEqual(true)
      })

      it('does not break when there are edits to one item in the list, but not others', () => {
        const editedParticipant = participant2.setIn(['first_name'], 'Lisa')
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

    const props = {
      ...requiredProps,
      actions: {
        fetchScreening: () => Promise.resolve(),
        fetchHistoryOfInvolvements: () => Promise.resolve(),
      },
      participants: Immutable.fromJS([victim, perpetrator]),
      screening: Immutable.fromJS({
        id: '3',
        cross_reports: [],
        participants: [victim, perpetrator],
        allegations: [{
          id: '1',
          perpetrator_id: perpetrator.id,
          screening_id: '3',
          victim_id: victim.id,
          allegation_types: ['General neglect'],
        }],
      }),
    }

    it('renders persisted allegations', () => {
      const component = mount(<ScreeningShowPage {...props} />)
      component.setState({loaded: true})
      const allegationsCard = component.find('AllegationsShowView')
      expect(allegationsCard.text()).toContain('Homer Simpson')
      expect(allegationsCard.text()).toContain('Bart Simpson')
      expect(allegationsCard.text()).toContain('General neglect')
    })

    it('builds and saves allegations after clicking save', () => {
      const saveScreening = jasmine.createSpy('saveScreening')
      const props = {
        ...requiredProps,
        actions: {
          fetchScreening: () => Promise.resolve(),
          fetchHistoryOfInvolvements: () => Promise.resolve(),
          saveScreening,
        },
        participants: Immutable.fromJS([victim, perpetrator]),
        screening: Immutable.fromJS({
          id: '3',
          allegations: [],
          cross_reports: [],
        }),
      }
      const component = mount(<ScreeningShowPage {...props} />)
      component.setState({loaded: true})

      // go to edit view
      const allegationsCard = component.find('AllegationsCardView')
      const editLink = allegationsCard.find('EditLink')
      expect(editLink.length).toEqual(1)
      editLink.simulate('click')

      const allegationsEditView = component.find('AllegationsEditView')
      expect(allegationsEditView.length).toEqual(1)

      // React-Select doesn't fire an onChange when you simulate change on the component directly
      // When in mount mode, simulate change on the input and then simulate tabbing out of the field
      const allegationTypesSelector = allegationsEditView.find('Select').find('input')
      allegationTypesSelector.simulate('change', {target: {value: 'General neglect'}})
      allegationTypesSelector.simulate('keyDown', {keyCode: 9, key: 'Tab'})

      // click save
      const saveButton = allegationsEditView.find('button[children="Save"]')
      expect(saveButton.length).toEqual(1)
      saveButton.simulate('click')

      expect(saveScreening).toHaveBeenCalledWith({
        id: '3',
        allegations: [{
          id: null,
          perpetrator,
          perpetrator_id: perpetrator.id,
          screening_id: '3',
          victim,
          victim_id: victim.id,
          allegation_types: ['General neglect'],
        }],
        cross_reports: [],
      })
    })

    it('generates new allegations for the participants when there are no persisted allegations', () => {
      const participants = Immutable.fromJS([victim, perpetrator])
      const screening = Immutable.fromJS({id: '3', allegations: []})
      const props = {
        ...requiredProps,
        screening,
        participants,
      }
      const component = shallow(<ScreeningShowPage {...props} />)
      component.setState({loaded: true})
      const expectedAllegations = [{
        id: null,
        screening_id: '3',
        perpetrator,
        perpetrator_id: perpetrator.id,
        victim,
        victim_id: victim.id,
        allegation_types: [],
      }]
      const allegationsCard = component.find('AllegationsCardView')
      expect(allegationsCard.props().allegations.toJS()).toEqual(expectedAllegations)
      expect(Immutable.is(allegationsCard.props().allegations, Immutable.fromJS(expectedAllegations))).toEqual(true)
    })

    it('replaces generated allegations with persisted allegations', () => {
      const participants = Immutable.fromJS([victim, perpetrator])
      const persisted_allegations = [
        {id: '9', victim_id: '1', perpetrator_id: '2', screening_id: '3'},
      ]
      const screening = Immutable.fromJS({id: '3', allegations: persisted_allegations})
      const props = {
        ...requiredProps,
        screening,
        participants,
      }
      const component = shallow(<ScreeningShowPage {...props} />)
      component.setState({loaded: true})
      const expectedAllegations = [{
        id: '9',
        screening_id: '3',
        perpetrator,
        perpetrator_id: perpetrator.id,
        victim,
        victim_id: victim.id,
        allegation_types: [],
      }]
      const allegationsCard = component.find('AllegationsCardView')
      expect(allegationsCard.props().allegations.toJS()).toEqual(expectedAllegations)
      expect(Immutable.is(allegationsCard.props().allegations, Immutable.fromJS(expectedAllegations))).toEqual(true)
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
      const props = {
        ...requiredProps,
        screening,
        participants,
      }
      const component = shallow(<ScreeningShowPage {...props} />)
      component.setState({loaded: true})
      const expectedAllegations = [{
        id: '9',
        screening_id: '3',
        perpetrator,
        perpetrator_id: perpetrator.id,
        victim,
        victim_id: victim.id,
        allegation_types: [],
      }, {
        id: null,
        screening_id: '3',
        perpetrator: anotherPerpetrator,
        perpetrator_id: anotherPerpetrator.id,
        victim,
        victim_id: victim.id,
        allegation_types: [],
      }]
      const allegationsCard = component.find('AllegationsCardView')
      expect(allegationsCard.props().allegations.toJS()).toEqual(expectedAllegations)
      expect(Immutable.is(allegationsCard.props().allegations, Immutable.fromJS(expectedAllegations))).toEqual(true)
    })

    it('uses persisted allegation types when there are no edits', () => {
      const participants = Immutable.fromJS([victim, perpetrator])
      const persisted_allegations = [
        {id: '9', victim_id: '1', perpetrator_id: '2', screening_id: '3', allegation_types: ['General neglect']},
      ]
      const screening = Immutable.fromJS({id: '3', allegations: persisted_allegations})
      const props = {
        ...requiredProps,
        screening,
        participants,
      }
      const component = shallow(<ScreeningShowPage {...props} />)
      component.setState({loaded: true})
      const expectedAllegations = [{
        id: '9',
        screening_id: '3',
        perpetrator,
        perpetrator_id: perpetrator.id,
        victim,
        victim_id: victim.id,
        allegation_types: ['General neglect'],
      }]
      const allegationsCard = component.find('AllegationsCardView')
      expect(allegationsCard.props().allegations.toJS()).toEqual(expectedAllegations)
      expect(Immutable.is(allegationsCard.props().allegations, Immutable.fromJS(expectedAllegations))).toEqual(true)
    })

    it('replaces allegation types with edited allegation types', () => {
      const participants = Immutable.fromJS([victim, perpetrator])
      const persisted_allegations = [
        {id: '9', victim_id: '1', perpetrator_id: '2', screening_id: '3', allegation_types: ['General neglect']},
      ]
      const screening = Immutable.fromJS({id: '3', allegations: persisted_allegations})
      const props = {
        ...requiredProps,
        screening,
        participants,
      }
      const component = shallow(<ScreeningShowPage {...props} />)

      component.setState({loaded: true})
      const screeningEdits = Immutable.fromJS({allegations: {1: {2: ['New allegation type']}}})
      component.setState({screeningEdits})

      const expectedAllegations = [{
        id: '9',
        screening_id: '3',
        perpetrator,
        perpetrator_id: perpetrator.id,
        victim,
        victim_id: victim.id,
        allegation_types: ['New allegation type'],
      }]
      const allegationsCard = component.find('AllegationsCardView')
      expect(allegationsCard.props().allegations.toJS()).toEqual(expectedAllegations)
      expect(Immutable.is(allegationsCard.props().allegations, Immutable.fromJS(expectedAllegations))).toEqual(true)
    })
  })
})
