import * as IntakeConfig from 'common/config'
import Immutable from 'immutable'
import React from 'react'
import {ScreeningPage} from 'screenings/ScreeningPage'
import {mount, shallow} from 'enzyme'

export const requiredScreeningAttributes = {
  allegations: [],
  id: '123456',
  safety_alerts: [],
  cross_reports: [],
}

export const requiredProps = {
  actions: {},
  params: {id: '1'},
  participants: Immutable.List(),
  screening: Immutable.fromJS(requiredScreeningAttributes),
  mode: 'edit',
  editable: true,
}

describe('ScreeningPage', () => {
  const sdmPath = 'https://ca.sdmdata.org'

  beforeEach(() => {
    spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(true)
    spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false)
    spyOn(IntakeConfig, 'sdmPath').and.returnValue(sdmPath)
  })

  describe('renderMode', () => {
    it('uses the mode from props if editable is true', () => {
      const props = {
        ...requiredProps,
        mode: 'show',
        editable: true,
      }

      const component = shallow(<ScreeningPage {...props}/>)
      expect(component.instance().renderMode()).toEqual('show')
    })

    it('forces the page to show mode if editable is false', () => {
      const screening = {
        ...requiredScreeningAttributes,
        referral_id: 'ABC123',
      }
      const props = {
        ...requiredProps,
        screening: Immutable.fromJS(screening),
        params: {id: '1', mode: 'edit'},
        mode: 'edit',
        editable: false,
      }

      const component = shallow(<ScreeningPage {...props}/>)
      expect(component.instance().renderMode()).toEqual('show')
    })

    it('renders cards using the mode returned from the method', () => {
      const screening = {
        ...requiredScreeningAttributes,
        referral_id: 'ABC123',
      }
      const props = {
        ...requiredProps,
        screening: Immutable.fromJS(screening),
        params: {id: '1', mode: 'edit'},
        mode: 'edit',
        loaded: true,
        editable: false,
      }

      const component = shallow(<ScreeningPage {...props}/>)
      const safetyAlerts = component.find('WorkerSafetyCardView')
      expect(safetyAlerts.props().mode).toEqual('show')
    })
  })

  describe('render', () => {
    it('renders the history card', () => {
      const involvements = Immutable.fromJS([{id: 1}, {id: 3}])
      const participants = Immutable.fromJS([{id: 1, roles: []}])
      const props = {
        ...requiredProps,
        involvements,
        participants,
        loaded: true,
      }
      const component = shallow(<ScreeningPage {...props} />)
      expect(component.find('Connect(HistoryOfInvolvement)').exists()).toEqual(true)
    })

    it('renders the allegations card', () => {
      const props = {
        ...requiredProps,
        mode: 'edit',
        loaded: true,
      }
      const component = shallow(<ScreeningPage {...props} />)
      const allegationsCard = component.find('AllegationsCardView')
      expect(allegationsCard.exists()).toEqual(true)
      expect(allegationsCard.props().mode).toEqual('edit')
    })

    it('renders to Cross Report Card', () => {
      const props = {
        ...requiredProps,
        mode: 'edit',
        loaded: true,
      }
      const component = shallow(<ScreeningPage {...props} />)
      const crossReportsCard = component.find('CrossReportCardView')
      expect(crossReportsCard.exists()).toEqual(true)
      expect(crossReportsCard.props().mode).toEqual('edit')
    })

    it('renders the relations card', () => {
      const props = {
        ...requiredProps,
        mode: 'edit',
        loaded: true,
      }
      const component = shallow(<ScreeningPage {...props} />)
      expect(component.find('Connect(RelationshipsCard)').length).toEqual(1)
    })

    it('renders the worker safety card', () => {
      const props = {
        ...requiredProps,
        mode: 'edit',
        loaded: true,
      }
      const component = shallow(<ScreeningPage {...props} />)
      const safetyCard = component.find('WorkerSafetyCardView')
      expect(safetyCard.length).toEqual(1)
      expect(safetyCard.props().mode).toEqual('edit')
    })

    it('renders the screening reference', () => {
      const props = {
        ...requiredProps,
        screening: Immutable.fromJS({
          ...requiredScreeningAttributes,
          reference: 'The Rocky Horror Picture Show',
        }),
        loaded: true,
      }
      const component = shallow(<ScreeningPage {...props} mode='show'/>)
      expect(component.find('h1').text()).toEqual('Screening #The Rocky Horror Picture Show')
    })

    it('renders the referral id, if present', () => {
      const props = {
        ...requiredProps,
        screening: Immutable.fromJS({
          ...requiredScreeningAttributes,
          reference: 'ABCDEF',
          referral_id: '123456',
        }),
        loaded: true,
      }
      const component = shallow(<ScreeningPage {...props} mode='show'/>)
      expect(component.find('h1').text()).toEqual('Screening #ABCDEF - Referral #123456')
    })
  })

  describe('componentDidMount', () => {
    const fetchScreening = jasmine.createSpy('fetchScreening')
    const fetchRelationships = jasmine.createSpy('fetchRelationships')
    const checkStaffPermission = jasmine.createSpy('checkStaffPermission')
    const fetchHistoryOfInvolvements = jasmine.createSpy('fetchHistoryOfInvolvements')
    const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
    beforeEach(() => {
      const props = {
        ...requiredProps,
        actions: {fetchScreening, fetchRelationships, fetchHistoryOfInvolvements, checkStaffPermission},
        params: {id: '222'},
      }
      fetchScreening.and.returnValue(promiseSpyObj)
      checkStaffPermission.and.returnValue(promiseSpyObj)
      mount(<ScreeningPage {...props} />)
    })

    it('GETs the screening from the server', () => {
      expect(fetchScreening).toHaveBeenCalledWith('222')
    })

    it('GETs the felationships from the server', () => {
      expect(fetchRelationships).toHaveBeenCalledWith('222')
    })

    it('GETs the history of involvement from the server', () => {
      expect(fetchHistoryOfInvolvements).toHaveBeenCalledWith('222')
    })

    it('GETs the staff permission from the server', () => {
      expect(checkStaffPermission).toHaveBeenCalledWith('add_sensitive_people')
    })
  })

  describe('Show mode', () => {
    beforeEach(() => {
      requiredProps.mode = 'show'
    })

    describe('render', () => {
      let component
      let props

      beforeEach(() => {
        props = {
          ...requiredProps,
          involvements: Immutable.fromJS([{id: 1}, {id: 3}]),
          screening: Immutable.fromJS({
            ...requiredScreeningAttributes,
            report_narrative: 'this is a narrative report',
          }),
          participants: Immutable.fromJS([
            {id: '1', first_name: 'Melissa', last_name: 'Powers', roles: []},
            {id: '2', first_name: 'Marshall', last_name: 'Powers', roles: []},
          ]),
          relationships: Immutable.fromJS([
            {id: '1', first_name: 'Melissa', last_name: 'Powers', relationships: []},
            {id: '2', first_name: 'Marshall', last_name: 'Powers', relationships: []},
          ]),
          loaded: true,
        }

        component = shallow(<ScreeningPage {...props} />)
      })

      it('renders the home and edit link', () => {
        const homeLink = component.find({children: 'Home', to: '/'})
        const editLink = component.find({children: 'Edit', to: '/screenings/1/edit'})
        expect(homeLink.exists()).toBe(true)
        expect(editLink.exists()).toBe(true)
      })

      it('renders the screening information show card', () => {
        expect(component.find('ScreeningInformationCardView').props()).toEqual(
          jasmine.objectContaining({mode: 'show'})
        )
      })

      it('renders the participants card for each participant', () => {
        expect(component.find('ParticipantCardView').length).toEqual(2)
        expect(component.find('ParticipantCardView').nodes.map((ele) => ele.props.mode)).toEqual(
          ['show', 'show']
        )
      })

      it('renders the narrative card after screening is loaded', () => {
        expect(component.find('NarrativeCardView').props()).toEqual(
          jasmine.objectContaining({mode: 'show'})
        )
      })

      it('renders the incident information show card', () => {
        expect(component.find('IncidentInformationCardView').props()).toEqual(
          jasmine.objectContaining({mode: 'show'})
        )
      })

      it('renders the worker safety card', () => {
        const safetyCard = component.find('WorkerSafetyCardView')
        expect(safetyCard.props().mode).toEqual('show')
      })

      it('renders the history card', () => {
        expect(component.find('Connect(HistoryOfInvolvement)').exists()).toEqual(true)
      })

      it('renders the cross report show card', () => {
        expect(component.find('CrossReportCardView').props().mode).toEqual('show')
      })

      it('renders the decision show card', () => {
        expect(component.find('DecisionCardView').props().mode).toEqual('show')
      })
    })
  })

  describe('loading flag', () => {
    let component

    describe('is true', () => {
      const props = {
        ...requiredProps,
        screening: Immutable.fromJS({
          ...requiredScreeningAttributes,
          report_narrative: 'this is a narrative report',
        }),
        mode: 'edit',
        loaded: true,
      }

      beforeEach(() => {
        component = shallow(<ScreeningPage {...props} />)
      })

      it('renders the cross report card view', () => {
        expect(component.find('CrossReportCardView').exists()).toEqual(true)
      })
      it('renders the narrative card', () => {
        expect(component.find('NarrativeCardView').exists()).toEqual(true)
      })
      it('renders the incident information card', () => {
        expect(component.find('IncidentInformationCardView').exists()).toEqual(true)
      })
      it('renders the decision card', () => {
        expect(component.find('DecisionCardView').exists()).toEqual(true)
      })
    })

    describe('is false', () => {
      const props = {
        ...requiredProps,
        screening: Immutable.fromJS({
          ...requiredScreeningAttributes,
          report_narrative: 'this is a narrative report',
        }),
        mode: 'edit',
      }

      beforeEach(() => {
        component = shallow(<ScreeningPage {...props} />)
      })
      it('does not render the narrative card', () => {
        expect(component.find('NarrativeCardView').length).toEqual(0)
      })
      it('does not render the decision card', () => {
        expect(component.find('DecisionCardView').length).toEqual(0)
      })
      it('does not render the incident information card', () => {
        expect(component.find('IncidentInformationCardView').length).toEqual(0)
      })
      it('does not render the cross report card view', () => {
        expect(component.find('CrossReportCardView').length).toEqual(0)
      })
    })
  })

  describe('Edit mode', () => {
    beforeEach(() => {
      requiredProps.mode = 'edit'
    })

    describe('render', () => {
      it('does not render home and edit links', () => {
        const component = shallow(<ScreeningPage {...requiredProps} />)
        expect(component.find({to: '/'}).length).toEqual(0)
        expect(component.find({to: '/screenings/1/edit'}).length).toEqual(0)
      })

      it('renders the screening information in edit mode', () => {
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
          loaded: true,
        }
        const component = shallow(<ScreeningPage {...props} />)
        expect(component.find('ScreeningInformationCardView').length).toEqual(1)
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
            loaded: true,
          }
          component = shallow(<ScreeningPage {...props} />)
        })

        it('renders the search card', () => {
          expect(component.find('Connect(PersonSearchForm)').exists()).toEqual(true)
        })

        it('renders the participants card for each participant', () => {
          expect(component.find('ParticipantCardView').length).toEqual(2)
          expect(component.find('ParticipantCardView').nodes.map((ele) => ele.props.mode)).toEqual(
            ['edit', 'edit']
          )
        })
      })
    })
  })

  describe('when submit referral and release two are both inactive', () => {
    it('renders the submit button with a modal', () => {
      const component = shallow(<ScreeningPage {...requiredProps} loaded={true}/>)
      expect(component.find('ScreeningSubmitButton').exists()).toEqual(false)
      expect(component.find('ScreeningSubmitButtonWithModal').exists()).toEqual(true)
    })
  })
})
