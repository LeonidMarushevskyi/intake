import Immutable from 'immutable'
import React from 'react'
import {ScreeningPage} from 'screenings/ScreeningPage'
import {shallow} from 'enzyme'
import * as IntakeConfig from 'common/config'

describe('ScreeningPage when release two is active', () => {
  beforeEach(() => {
    spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(false)
    spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(true)
  })

  describe('Edit mode', () => {
    const requiredScreeningAttributes = {
      allegations: [],
      id: '123456',
      safety_alerts: [],
      cross_reports: [],
    }

    const requiredProps = {
      actions: {fetchScreening: () => null},
      staffActions: {checkStaffPermission: () => null},
      params: {id: '1'},
      participants: Immutable.List(),
      screening: Immutable.fromJS(requiredScreeningAttributes),
      involvements: Immutable.fromJS({screenings: []}),
      relationships: Immutable.List(),
      mode: 'edit',
      editable: true,
    }

    it('does not display a submit button', () => {
      const component = shallow(<ScreeningPage {...requiredProps} loaded={true} />)
      expect(component.find('ScreeningSubmitButton').length).toEqual(0)
    })

    it('renders the person search form', () => {
      const component = shallow(<ScreeningPage {...requiredProps} loaded={true} />)
      expect(component.find('Connect(PersonSearchForm)').exists()).toBe(true)
    })

    it('renders the snapshot copy', () => {
      const component = shallow(<ScreeningPage {...requiredProps} loaded={true} />)
      expect(component.text()).toContain('The Child Welfare History Snapshot allows you to search CWS/CMS for people and their past history with CWS.')
    })

    it('does not render home and edit links', () => {
      const component = shallow(<ScreeningPage {...requiredProps} loaded={true} />)
      expect(component.find('IndexLink').length).toEqual(0)
      expect(component.find({to: '/screenings/1/edit'}).length).toEqual(0)
    })

    it('does not render the screening information in edit mode', () => {
      const component = shallow(<ScreeningPage {...requiredProps} loaded={true} />)
      expect(component.find('ScreeningInformationCardView').length).toEqual(0)
    })

    it('does render a start over button', () => {
      const component = shallow(<ScreeningPage {...requiredProps} loaded={true} />)
      const link = component.find('Link')
      expect(link.props().children).toBe('Start Over')
      expect(link.props().to).toBe('/')
    })

    describe('participants card', () => {
      let component
      beforeEach(() => {
        const participants = Immutable.fromJS([
          {id: '1', first_name: 'Melissa', last_name: 'Powers', roles: []},
          {id: '2', first_name: 'Marshall', last_name: 'Powers', roles: []},
        ])
        const props = {...requiredProps, participants, loaded: true, editable: true}
        component = shallow(<ScreeningPage {...props} />)
      })

      it('renders the participants card for each participant in show mode', () => {
        expect(component.find('ParticipantCardView').length).toEqual(2)
        expect(component.find('ParticipantCardView').nodes.every(
          (ele) => ele.props.mode === 'show')
        ).toEqual(true)
      })
    })

    it('renders the history card', () => {
      const involvements = Immutable.fromJS([{id: 1}, {id: 3}])
      const participants = Immutable.fromJS([{id: 1}])
      const props = {
        ...requiredProps,
        involvements,
        participants,
        loaded: true,
        editable: true,
      }
      const component = shallow(<ScreeningPage {...props} />)
      expect(component.find('Connect(HistoryOfInvolvement)').exists()).toEqual(true)
    })

    it('does not render the allegations card', () => {
      const component = shallow(<ScreeningPage {...requiredProps} loaded={true} />)
      expect(component.find('AllegationsCardView').length).toEqual(0)
    })

    it('does not render the relations card', () => {
      const component = shallow(<ScreeningPage {...requiredProps} loaded={true} />)
      expect(component.find('RelationshipsCard').length).toEqual(0)
    })

    it('does not render the worker safety card', () => {
      const component = shallow(<ScreeningPage {...requiredProps} loaded={true} />)
      expect(component.find('WorkerSafetyCardView').length).toEqual(0)
    })

    it('does not render the screening heading', () => {
      const component = shallow(<ScreeningPage {...requiredProps} loaded={true} />)
      expect(component.find('h1').length).toEqual(0)
    })
  })
})
