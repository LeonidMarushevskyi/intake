import Immutable from 'immutable'
import React from 'react'
import {ScreeningEditPage} from 'components/screenings/ScreeningEditPage'
import {browserHistory} from 'react-router'
import {mount, shallow} from 'enzyme'

describe('ScreeningEditPage', () => {
  let component
  describe('render', () => {
    it('renders the screening reference', () => {
      const props = {
        actions: {},
        params: {id: '1'},
        participants: Immutable.List(),
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
        params: {id: '1'},
        participants: Immutable.List(),
        screening,
      }
      component = shallow(<ScreeningEditPage {...props} />)
      expect(component.find('InformationEditView').length).toEqual(1)
      expect(component.find('InformationEditView').props().screening).toEqual(screening)
      expect(component.find('InformationEditView').props().onChange).toEqual(component.instance().setField)
    })

    describe('participants card', () => {
      beforeEach(() => {
        const participants = Immutable.fromJS([
          {id: '1', first_name: 'Melissa', last_name: 'Powers'},
          {id: '2', first_name: 'Marshall', last_name: 'Powers'},
        ])
        const props = {
          actions: {},
          params: {id: '1'},
          participants,
          screening: Immutable.Map(),
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

    describe('narrative card', () => {
      beforeEach(() => {
        const screening = Immutable.fromJS({report_narrative: 'this is a narrative report'})
        const props = {
          actions: {},
          params: {id: '1'},
          participants: Immutable.List(),
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
        params: {id: '1'},
        participants: Immutable.List(),
        screening,
      }
      component = shallow(<ScreeningEditPage {...props} />)
      expect(component.find('IncidentInformationEditView').length).toEqual(1)
      expect(component.find('IncidentInformationEditView').props().screening).toEqual(screening)
      expect(component.find('IncidentInformationEditView').props().onChange).toEqual(component.instance().setField)
    })

    it('renders the history card', () => {
      const props = {
        actions: {},
        params: {id: '1'},
        participants: Immutable.List(),
        screening: Immutable.Map(),
      }
      component = shallow(<ScreeningEditPage {...props} />)
      expect(component.find('HistoryCard').length).toEqual(1)
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
      component.instance().cardSave(['report_narrative'], 'This is my new narrative')
    })

    it('calls screening save', () => {
      expect(saveScreening).toHaveBeenCalledWith({report_narrative: 'This is my new narrative'})
    })
  })

  describe('createParticipant', () => {
    const person = {id: '3'}
    let createParticipant
    let participant

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

  describe('saveAll', () => {
    let component
    let saveButton
    const saveScreening = jasmine.createSpy('saveScreening')
    beforeEach(() => {
      const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
      saveScreening.and.returnValue(promiseSpyObj)
      promiseSpyObj.then.and.returnValue(promiseSpyObj)
      // the above line is needed for the return from narrative card save
      const props = {
        actions: {
          fetchScreening: () => Promise.resolve(),
          saveScreening,
        },
        params: {id: '1'},
        participants: Immutable.List(),
        screening: Immutable.Map({name: 'my screening', report_narrative: null}),
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
})
