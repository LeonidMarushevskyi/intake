import Immutable from 'immutable'
import React from 'react'
import {ScreeningEditPage} from 'components/screenings/ScreeningEditPage'
import {mount, shallow} from 'enzyme'
import * as config from 'config'

describe('ScreeningEditPage', () => {
  const requiredScreeningAttributes = {
    id: '123456',
    allegations: [],
    safety_alerts: [],
    cross_reports: [],
  }
  const requiredProps = {
    actions: {},
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
      const component = shallow(<ScreeningEditPage {...props} />)
      expect(component.find('h1').text()).toEqual('Edit Screening #The Rocky Horror Picture Show')
    })

    it('renders the screening information edit view', () => {
      const screening = Immutable.fromJS({
        ...requiredScreeningAttributes,
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

    describe('setField', () => {
      it('sets the screeningEdits correctly', () => {
        const props = {
          ...requiredProps,
          screening: Immutable.fromJS({
            ...requiredScreeningAttributes,
          }),
        }
        const instance = shallow(<ScreeningEditPage {...props}/>).instance()
        instance.setField(['field', 'sequence'], 'the value')
        expect(instance.state.screeningEdits.getIn(['field', 'sequence'])).toEqual('the value')
      })
    })

    describe('mergeScreeningWithEdits', () => {
      let instance
      beforeEach(() => {
        const screening = Immutable.fromJS({
          ...requiredScreeningAttributes,
          assignee: 'The assignee',
          name: 'A name',
          report_narrative: 'This is what happened',
          additional_information: 'Some more relevant information',
          cross_reports: [
            {agency_type: 'District attorney', agency_name: 'SAC DA'},
            {agency_type: 'Licensing', agency_name: ''},
          ],
          safety_alerts: [
            'Firearms in Home',
            'Gang Affiliation or Gang Activity',
          ],
          address: {
            street_address: '123 Fake St.',
            city: 'Sacramento',
            state: 'CA',
            zip: '55555',
          },
        })
        const props = {
          ...requiredProps,
          screening,
        }
        instance = shallow(<ScreeningEditPage {...props}/>).instance()
      })
      it('safety_alert edits override the entire screeningEdits.safety_alerts array', () => {
        const changeJS = {
          safety_alerts: [
            'Dangerous Animal on Premises',
          ],
        }
        const updated_screening = instance.mergeScreeningWithEdits(Immutable.fromJS(changeJS))
        expect(updated_screening.toJS().safety_alerts).toEqual(['Dangerous Animal on Premises'])
      })
      it('cross_reports edits override the entire screeningEdits.cross_reports array', () => {
        const changeJS = {
          cross_reports: [
            {agency_type: 'Gibberish', agency_name: 'Irrelevant'},
          ],
        }
        const updated_screening = instance.mergeScreeningWithEdits(Immutable.fromJS(changeJS))
        expect(updated_screening.toJS().cross_reports).toEqual(changeJS.cross_reports)
      })
      it('address field edits merge into previous value', () => {
        const changeJS = {
          address: {
            street_address: '321 Countdown Pl',
            city: 'Davis',
          },
        }
        const updated_screening = instance.mergeScreeningWithEdits(Immutable.fromJS(changeJS))
        expect(updated_screening.toJS().address).toEqual({
          city: 'Davis',
          street_address: '321 Countdown Pl',
          state: 'CA',
          zip: '55555',
        })
      })
      it('merges other fields appropriately', () => {
        const changeJS = {
          assignee: 'A new assignee',
          name: 'changing the name as well',
        }
        const updated_screening = instance.mergeScreeningWithEdits(Immutable.fromJS(changeJS)).toJS()
        expect(updated_screening.assignee).toEqual('A new assignee')
        expect(updated_screening.name).toEqual('changing the name as well')
        expect(updated_screening.report_narrative).toEqual('This is what happened')
        expect(updated_screening.additional_information).toEqual('Some more relevant information')
      })
      it('merge empty and non-empty fields appropriately to existing values', () => {
        const changeJS = {
          assignee: null,
          name: 'changing the name as well',
        }
        const updated_screening = instance.mergeScreeningWithEdits(Immutable.fromJS(changeJS)).toJS()
        expect(updated_screening.assignee).toEqual(null)
        expect(updated_screening.name).toEqual('changing the name as well')
        expect(updated_screening.report_narrative).toEqual('This is what happened')
      })
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
        screening: Immutable.fromJS({
          ...requiredScreeningAttributes,
          report_narrative: 'this is a narrative report',
        }),
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
      const involvements = Immutable.fromJS([{id: 1}, {id: 3}])
      const participants = Immutable.fromJS([{id: 1}])
      const props = {
        ...requiredProps,
        involvements,
        participants,
      }
      const component = shallow(<ScreeningEditPage {...props} />)
      expect(component.find('HistoryCard').length).toEqual(1)
      expect(component.find('HistoryCard').props().actions).toEqual(props.actions)
      expect(component.find('HistoryCard').props().involvements).toEqual(involvements)
      expect(component.find('HistoryCard').props().participants).toEqual(participants)
      expect(component.find('HistoryCard').props().screeningId).toEqual(props.params.id)
    })

    it('renders the allegations card', () => {
      const props = {
        ...requiredProps,
        allegations: Immutable.List(),
        mode: 'edit',
      }
      const component = shallow(<ScreeningEditPage {...props} />)
      component.setState({loaded: true})
      const allegationsCard = component.find('AllegationsCardView')
      expect(allegationsCard.length).toEqual(1)
      expect(allegationsCard.props().allegations).toEqual(Immutable.List())
      expect(allegationsCard.props().mode).toEqual('edit')
      expect(allegationsCard.props().onCancel).toEqual(component.instance().cancelEdit)
    })

    it('renders the worker safety card', () => {
      const props = {
        ...requiredProps,
        mode: 'edit',
      }
      const component = shallow(<ScreeningEditPage {...props} />)
      component.setState({loaded: true})
      const safetyCard = component.find('WorkerSafetyCardView')
      expect(safetyCard.length).toEqual(1)
      expect(safetyCard.props().mode).toEqual('edit')
      expect(safetyCard.props().onCancel).toEqual(component.instance().cancelEdit)
    })

    it('renders the submit button', () => {
      const component = shallow(<ScreeningEditPage {...requiredProps} />)
      expect(component.find('button[children="Submit"]').length).toEqual(1)
    })

    describe('when referral_submit is ON', () => {
      beforeEach(() => {
        spyOn(config, 'config').and.returnValue({
          referral_submit: true,
        })
      })

      it('clicking the submit button submits the screening', () => {
        const submitScreening = jasmine.createSpy('submitScreening')
        const props = {
          ...requiredProps,
          params: {id: '99'},
          actions: {submitScreening},
        }
        const component = shallow(<ScreeningEditPage {...props} />)
        component.find('button[children="Submit"]').simulate('click')
        expect(submitScreening).toHaveBeenCalledWith('99')
      })
    })

    describe('when referral_submit is OFF', () => {
      beforeEach(() => {
        spyOn(config, 'config').and.returnValue({
          referral_submit: false,
        })
      })

      it('clicking the submit button does not submits the screening', () => {
        const submitScreening = jasmine.createSpy('submitScreening')
        const props = {
          ...requiredProps,
          params: {id: '99'},
          actions: {submitScreening},
        }
        const component = shallow(<ScreeningEditPage {...props} />)
        component.find('button[children="Submit"]').simulate('click')
        expect(submitScreening).not.toHaveBeenCalledWith('99')
      })
    })
  })

  describe('componentDidMount', () => {
    const fetchScreening = jasmine.createSpy('fetchScreening')
    const fetchHistoryOfInvolvements = () => Promise.resolve()
    beforeEach(() => {
      const props = {
        ...requiredProps,
        actions: {fetchScreening, fetchHistoryOfInvolvements},
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
      const fetchHistoryOfInvolvements = () => Promise.resolve()
      props = {
        ...requiredProps,
        actions: {fetchScreening, fetchHistoryOfInvolvements},
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
    let saveScreening
    let instance
    const lisa = {id: '123', first_name: 'Lisa', roles: ['Victim']}
    const marge = {id: '456', first_name: 'Marge', roles: ['Perpetrator']}
    const homer = {id: '789', first_name: 'Homer', roles: ['Perpetrator']}
    const participants = Immutable.fromJS([lisa, marge, homer])

    beforeEach(() => {
      saveScreening = jasmine.createSpy('saveScreening')
      const props = {
        ...requiredProps,
        actions: {saveScreening},
        screening: Immutable.fromJS({
          ...requiredScreeningAttributes,
          name: 'The old name',
          reference: 'old reference',
          cross_reports: [
            {agency_name: 'a name', agency_type: 'Licensing'},
            {agency_name: '', agency_type: 'District attorney'},
          ],
          address: {city: 'Davis', county: 'Yolo'},
          report_narrative: 'I have things to say',
        }),
        participants,
      }
      instance = shallow(<ScreeningEditPage {...props} />).instance()
      const allegationEdit = Immutable.fromJS({123: {456: ['General neglect']}})
      instance.setField(['allegations'], allegationEdit)
      instance.setField(['report_narrative'], 'This is my new narrative')
      instance.setField(['name'], 'A name')
      instance.setField(['reference'], 'ABC123')
      instance.setField(['cross_reports'], [{agency_name: 'new name', agency_type: 'District attorney'}])
      instance.setField(['address', 'city'], 'Sacramento')
    })

    it('overrides cross_reports instead of merging', () => {
      instance.cardSave(['cross_reports'])
      expect(saveScreening).toHaveBeenCalledWith({
        ...requiredScreeningAttributes,
        name: 'The old name',
        reference: 'old reference',
        cross_reports: [
          {agency_name: 'new name', agency_type: 'District attorney'},
        ],
        address: {city: 'Davis', county: 'Yolo'},
        report_narrative: 'I have things to say',
      })
    })

    it('saves multiple fields', () => {
      instance.cardSave(['address', 'reference'])
      expect(saveScreening).toHaveBeenCalledWith({
        ...requiredScreeningAttributes,
        name: 'The old name',
        reference: 'ABC123',
        cross_reports: [
          {agency_name: 'a name', agency_type: 'Licensing'},
          {agency_name: '', agency_type: 'District attorney'},
        ],
        address: {city: 'Sacramento', county: 'Yolo'},
        report_narrative: 'I have things to say',
      })
    })

    it('saves with correctly merged children', () => {
      instance.cardSave(['address'])
      expect(saveScreening).toHaveBeenCalledWith({
        ...requiredScreeningAttributes,
        name: 'The old name',
        reference: 'old reference',
        cross_reports: [
          {agency_name: 'a name', agency_type: 'Licensing'},
          {agency_name: '', agency_type: 'District attorney'},
        ],
        address: {city: 'Sacramento', county: 'Yolo'},
        report_narrative: 'I have things to say',
      })
    })

    it('saves with correctly merged first level field', () => {
      instance.cardSave(['report_narrative'])
      expect(saveScreening).toHaveBeenCalledWith({
        ...requiredScreeningAttributes,
        name: 'The old name',
        reference: 'old reference',
        cross_reports: [
          {agency_name: 'a name', agency_type: 'Licensing'},
          {agency_name: '', agency_type: 'District attorney'},
        ],
        address: {city: 'Davis', county: 'Yolo'},
        report_narrative: 'This is my new narrative',
      })
    })

    it('builds allegations that have allegation types when allegations is part of the fieldList', () => {
      instance.cardSave(['allegations'])
      expect(saveScreening).toHaveBeenCalledWith({
        ...requiredScreeningAttributes,
        name: 'The old name',
        reference: 'old reference',
        cross_reports: [
          {agency_name: 'a name', agency_type: 'Licensing'},
          {agency_name: '', agency_type: 'District attorney'},
        ],
        address: {city: 'Davis', county: 'Yolo'},
        report_narrative: 'I have things to say',
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
    const createParticipant = jasmine.createSpy('createParticipant')
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
      actions: {createParticipant, saveParticipant, deleteParticipant, fetchScreening},
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
        expect(fetchScreening).toHaveBeenCalledWith(participant1.get('screening_id'))
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
        screening: Immutable.fromJS(requiredScreeningAttributes),
      }
      const component = mount(<ScreeningEditPage {...props} />)
      component.setState({loaded: true})
      const allegationsCard = component.find('AllegationsEditView')
      expect(allegationsCard.length).toEqual(1)

      // React-Select doesn't fire an onChange when you simulate change on the component directly
      // When in mount mode, simulate change on the input and then simulate tabbing out of the field
      const allegationTypesSelector = allegationsCard.find('Select').find('input')
      allegationTypesSelector.simulate('change', {target: {value: 'General neglect'}})
      allegationTypesSelector.simulate('keyDown', {keyCode: 9, key: 'Tab'})

      const saveButton = allegationsCard.find('button[children="Save"]')
      expect(saveButton.length).toEqual(1)
      saveButton.simulate('click')
      expect(saveScreening).toHaveBeenCalledWith({
        id: '123456',
        allegations: [{
          id: null,
          perpetrator,
          perpetrator_id: perpetrator.id,
          screening_id: '123456',
          victim,
          victim_id: victim.id,
          allegation_types: ['General neglect'],
        }],
        cross_reports: [],
        safety_alerts: [],
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
      const component = shallow(<ScreeningEditPage {...props} />)
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
      const component = shallow(<ScreeningEditPage {...props} />)
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
      const component = shallow(<ScreeningEditPage {...props} />)
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
      const component = shallow(<ScreeningEditPage {...props} />)
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
      const component = shallow(<ScreeningEditPage {...props} />)

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
