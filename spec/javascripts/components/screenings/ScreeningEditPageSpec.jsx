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

  describe('createParticipant', () => {
    const person = {id: '3'}
    let createParticipant
    let participant
    let component

    beforeEach(() => {
      createParticipant = jasmine.createSpy('createParticipant')
      const props = {
        actions: {createParticipant},
        params: {id: '1'},
        participants: Immutable.List(),
        screening: Immutable.Map(),
      }
      participant = {id: null, screening_id: props.params.id, person_id: person.id}
      component = shallow(<ScreeningEditPage {...props} />)
    })

    it('calls the createParticipant action', () => {
      component.instance().createParticipant(person)
      expect(createParticipant).toHaveBeenCalledWith(participant)
    })
  })

  describe('deleteParticipant', () => {
    let deleteParticipant
    let component

    beforeEach(() => {
      deleteParticipant = jasmine.createSpy('deleteParticipant')
      const props = {
        actions: {deleteParticipant},
        params: {id: '1'},
        participants: Immutable.List([
          Immutable.Map({id: '1', screening_id: '1'}),
          Immutable.Map({id: '2', screening_id: '1'}),
        ]),
        screening: Immutable.Map(),
      }
      component = shallow(<ScreeningEditPage {...props} />)
    })

    it('calls the deleteParticipant action', () => {
      component.instance().deleteParticipant('1')
      expect(deleteParticipant).toHaveBeenCalledWith('1')
    })
  })
})
