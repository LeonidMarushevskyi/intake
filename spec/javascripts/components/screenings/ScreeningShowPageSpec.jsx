import Immutable from 'immutable'
import React from 'react'
import {ScreeningShowPage} from 'components/screenings/ScreeningShowPage'
import {shallow, mount} from 'enzyme'

describe('ScreeningShowPage', () => {
  describe('render', () => {
    const requiredProps = {
      actions: {fetchScreening: () => null},
      params: {id: '1'},
      participants: Immutable.List(),
      screening: Immutable.Map(),
    }

    it('renders the screening reference', () => {
      const props = {
        ...requiredProps,
        screening: Immutable.fromJS({reference: 'The Rocky Horror Picture Show'}),
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

    it('renders the cross report show card', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      expect(component.find('CrossReportShowView').length).toEqual(1)
    })

    it('renders the history card', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      expect(component.find('HistoryCard').length).toEqual(1)
    })

    it('renders the allegations card', () => {
      const component = shallow(<ScreeningShowPage {...requiredProps} />)
      expect(component.find('AllegationsShowView').length).toEqual(1)
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
          actions: {fetchScreening: () => null},
          params: {id: '1'},
          participants,
          screening: Immutable.Map(),
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
        screening: Immutable.fromJS({report_narrative: 'this is a narrative report'}),
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
    const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
    beforeEach(() => {
      const props = {
        actions: {fetchScreening},
        params: {id: '222'},
        participants: Immutable.List(),
        screening: Immutable.Map(),
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
        actions: {},
        params: {},
        participants: Immutable.List(),
        screening: Immutable.Map(),
      }
      const component = shallow(<ScreeningShowPage {...props}/>)
      const screening = Immutable.fromJS({id: '1', reference: 'My New Reference'})
      component.setProps({screening})
      expect(component.find('h1').text()).toContain('My New Reference')
    })
  })

  describe('cardSave', () => {
    let component
    const saveScreening = jasmine.createSpy('saveScreening')
    beforeEach(() => {
      const props = {
        actions: {saveScreening},
        params: {id: '1'},
        participants: Immutable.List(),
        screening: Immutable.Map(),
      }
      component = shallow(<ScreeningShowPage {...props} />)
      component.instance().setField(['report_narrative'], 'This is my new narrative')
    })

    it('calls screening save', () => {
      component.instance().cardSave(['report_narrative'])
      expect(saveScreening).toHaveBeenCalledWith({report_narrative: 'This is my new narrative'})
    })
  })

  describe('participants-related functions', () => {
    const saveParticipant = jasmine.createSpy('saveParticipant')
    const deleteParticipant = jasmine.createSpy('deleteParticipant')

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
      addresses: Immutable.List([address1, address2]),
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
      addresses: Immutable.List(),
    })

    const props = {
      actions: {saveParticipant, deleteParticipant},
      params: {id: '3'},
      participants: Immutable.List([participant1, participant2]),
      screening: Immutable.Map(),
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

        component.instance().setParticipantField(id1, updatedParticipant1)
        component.instance().setParticipantField(id2, updatedParticipant2)

        expect(component.instance().state.participantsEdits.get(id1)).toEqual(updatedParticipant1)
        expect(component.instance().state.participantsEdits.get(id2)).toEqual(updatedParticipant2)

        component.instance().cancelParticipantEdit(id2)

        expect(component.instance().state.participantsEdits.get(id1)).toEqual(updatedParticipant1)
        expect(component.instance().state.participantsEdits.get(id2)).toEqual(undefined)
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
        const editedParticipant = participant1.setIn(['first_name'], 'Homer')
        component.instance().setParticipantField(id1, editedParticipant)
        const participants = Immutable.List([editedParticipant, participant2])
        expect(Immutable.is(component.instance().participants(), participants)).toEqual(true)
      })

      it('does not break when there are edits to one item in the list, but not others', () => {
        const editedParticipant = participant2.setIn(['first_name'], 'Lisa')
        component.instance().setParticipantField(id2, editedParticipant)
        const participants = Immutable.List([participant1, editedParticipant])
        expect(Immutable.is(component.instance().participants(), participants)).toEqual(true)
      })

      it('reflects edits made to a participant address', () => {
        const updatedAddress = address1.set('street_address', '555 real st')
        const updatedParticipant = participant1.set('addresses', Immutable.List([updatedAddress, address2]))
        component.instance().setParticipantField(id1, updatedParticipant)
        const participants = Immutable.List([updatedParticipant, participant2])
        expect(Immutable.is(component.instance().participants(), participants)).toEqual(true)
      })

      it('reflects when a participant address is deleted', () => {
        const updatedParticipant = participant1.set('addresses', Immutable.List([address2]))
        component.instance().setParticipantField(id1, updatedParticipant)
        const participants = Immutable.List([updatedParticipant, participant2])
        expect(Immutable.is(component.instance().participants(), participants)).toEqual(true)
      })
    })
  })
})
