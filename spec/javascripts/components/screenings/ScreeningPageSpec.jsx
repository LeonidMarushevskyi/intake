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
  actions: {
    checkStaffPermission: () => null,
    fetchScreening: () => null,
    fetchCountyAgencies: () => null,
  },
  counties: [{code: '123', value: 'county'}],
  countyAgencies: {DEPARTMENT_OF_JUSTICE: []},
  params: {id: '1'},
  participants: Immutable.List(),
  screening: Immutable.fromJS(requiredScreeningAttributes),
  involvements: Immutable.fromJS({screenings: []}),
  relationships: Immutable.List(),
  mode: 'edit',
  editable: true,
}

describe('ScreeningPage', () => {
  const basePath = '/intake'
  const sdmPath = 'https://ca.sdmdata.org'

  beforeEach(() => {
    spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(true)
    spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false)
    spyOn(IntakeConfig, 'basePath').and.returnValue(basePath)
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

    it('renders the allegations card and specifies if allegations are required', () => {
      const props = {
        ...requiredProps,
        allegations: Immutable.List(),
        mode: 'edit',
        loaded: true,
      }
      const component = shallow(<ScreeningPage {...props} />)
      const allegationsCard = component.find('AllegationsCardView')
      expect(allegationsCard.length).toEqual(1)
      expect(allegationsCard.props().allegations).toEqual(Immutable.List())
      expect(allegationsCard.props().mode).toEqual('edit')
      expect(allegationsCard.props().onCancel).toEqual(component.instance().cancelEdit)
      expect(allegationsCard.props().required).toEqual(false)
    })

    it('renders to Cross Report Card and specifies if cross reporting is required', () => {
      const participants = Immutable.fromJS([
        {id: '1', first_name: 'Sterling', last_name: 'Archer', roles: ['Victim', 'Perpetrator']},
        {id: '2', first_name: 'Malory', last_name: 'Archer', roles: ['Perpetrator']},
      ])
      const fetchScreening = jasmine.createSpy('fetchScreening')
      const fetchCountyAgencies = jasmine.createSpy('fetchCountyAgencies')
      const checkStaffPermission = jasmine.createSpy('checkStaffPermission')
      const props = {
        ...requiredProps,
        actions: {fetchScreening, checkStaffPermission, fetchCountyAgencies},
        participants: participants,
        mode: 'edit',
        screening: Immutable.fromJS({
          allegations: [
            {id: '123', screening_id: '3', victim_id: '1', perpetrator_id: '2', allegation_types: ['Exploitation', 'Severe neglect']},
          ],
          id: '123456',
          participants: participants,
          safety_alerts: [],
          cross_reports: [
            {agency_type: 'District attorney', agency_code: 'SCDAOFFCODE'},
            {agency_type: 'Department of justice'},
          ],
        }),
        loaded: true,
      }
      const component = shallow(<ScreeningPage {...props} />)
      const crossReportsCard = component.find('CrossReportCardView')
      expect(crossReportsCard.length).toEqual(1)
      expect(crossReportsCard.props().areCrossReportsRequired).toEqual(true)
      expect(crossReportsCard.props().crossReports).toEqual(props.screening.get('cross_reports'))
      expect(crossReportsCard.props().mode).toEqual('edit')
      expect(crossReportsCard.props().actions.fetchCountyAgencies).toEqual(fetchCountyAgencies)
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
      expect(safetyCard.props().onCancel).toEqual(component.instance().cancelEdit)
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

  describe('componentWillReceiveProps', () => {
    let component
    let props
    const newScreeningState = Immutable.fromJS({report_narrative: 'my updated narrative'})

    beforeEach(() => {
      const fetchScreening = jasmine.createSpy('fetchScreening')
      const fetchRelationships = jasmine.createSpy('fetchRelationships')
      const fetchHistoryOfInvolvements = jasmine.createSpy('fetchHistoryOfInvolvements')
      const checkStaffPermission = jasmine.createSpy('checkStaffPermission')
      fetchScreening.and.returnValue(Promise.resolve())
      checkStaffPermission.and.returnValue(Promise.resolve())
      props = {
        ...requiredProps,
        actions: {fetchScreening, fetchRelationships, fetchHistoryOfInvolvements, checkStaffPermission},
        params: {id: '222'},
        screening: Immutable.fromJS({
          report_narrative: 'my narrative',
          allegations: [],
        }),
      }
      component = mount(<ScreeningPage {...props} />)
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

  describe('setField', () => {
    it('sets the screeningEdits correctly', () => {
      const props = {
        ...requiredProps,
        screening: Immutable.fromJS({
          ...requiredScreeningAttributes,
        }),
      }
      const instance = shallow(<ScreeningPage {...props}/>).instance()
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
          {agency_type: 'District attorney', agency_code: 'SACDACODE'},
          {agency_type: 'Licensing', agency_code: ''},
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
      instance = shallow(<ScreeningPage {...props}/>).instance()
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
          {agency_type: 'Gibberish', agency_code: 'IRRELEVANTCODE'},
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

  describe('Show mode', () => {
    beforeEach(() => {
      requiredProps.mode = 'show'
    })

    describe('render', () => {
      let component
      let props
      let cardCallbacks

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
        cardCallbacks = {
          onCancel: component.instance().cancelEdit,
          onChange: component.instance().setField,
          onSave: component.instance().cardSave,
        }
      })

      it('renders the home and edit link', () => {
        const homeLink = component.find({to: '/'})
        const editLink = component.find({to: '/screenings/1/edit'})
        expect(homeLink.html()).toContain('Home')
        expect(editLink.html()).toContain('Edit')
      })

      it('renders the screening information show card', () => {
        expect(component.find('ScreeningInformationCardView').props()).toEqual(
          jasmine.objectContaining({...cardCallbacks, mode: 'show'})
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
          jasmine.objectContaining({...cardCallbacks, mode: 'show'})
        )
      })

      it('renders the allegations card', () => {
        const allegationsCard = component.find('AllegationsCardView')
        expect(allegationsCard.props()).toEqual(
          jasmine.objectContaining({...cardCallbacks, mode: 'show', allegations: Immutable.List()})
        )
      })

      it('renders the worker safety card', () => {
        const safetyCard = component.find('WorkerSafetyCardView')
        expect(safetyCard.length).toEqual(1)
        expect(safetyCard.props()).toEqual(
          jasmine.objectContaining({...cardCallbacks, mode: 'show'})
        )
      })

      it('renders the history card', () => {
        expect(component.find('Connect(HistoryOfInvolvement)').exists()).toEqual(true)
      })

      it('renders the cross report show card', () => {
        expect(component.find('CrossReportCardView').props()).toEqual(
          jasmine.objectContaining({...cardCallbacks, mode: 'show'})
        )
      })

      it('renders the decision show card', () => {
        expect(component.find('DecisionCardView').props()).toEqual(
          jasmine.objectContaining({...cardCallbacks, mode: 'show'})
        )
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
        expect(component.find('CrossReportCardView').length).toEqual(1)
      })
      it('renders the narrative card', () => {
        expect(component.find('NarrativeCardView').length).toEqual(1)
      })
      it('renders the incident information card', () => {
        expect(component.find('IncidentInformationCardView').length).toEqual(1)
      })
      it('renders the decision card', () => {
        expect(component.find('DecisionCardView').length).toEqual(1)
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

        it('renders the card header', () => {
          expect(component.find('#search-card .card-header').text()).toContain('Search')
        })

        it('renders the search card', () => {
          const searchCard = component.find('#search-card')
          const label = searchCard.children('.card-body').children('div').children('div').children('label')
          expect(label.text()).toContain('Search for any person')
          expect(label.text()).toContain('(Children, parents, collaterals, reporters, alleged perpetrators...)')
        })

        describe('autocompleter', () => {
          let autocompleter
          beforeEach(() => {
            autocompleter = component.find('Autocompleter')
          })
          it('is rendered', () => {
            expect(autocompleter.length).toBe(1)
          })
          it('is passed an id', () => {
            expect(autocompleter.props().id).toEqual('screening_participants')
          })
          it('is pass the correct isSelectable callback', () => {
            expect(autocompleter.props().isSelectable).toEqual(
              component.instance().canCreateParticipant
            )
          })
          it('is pass the correct onSelect callback', () => {
            expect(autocompleter.props().onSelect).toEqual(
              component.instance().createParticipant
            )
          })
          it('is passed a footer component', () => {
            const footer = autocompleter.props().footer
            expect(footer.type.name).toEqual('CreateUnknownParticipant')
            expect(footer.props.saveCallback).toEqual(component.instance().createParticipant)
          })
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

  describe('canCreateParticipant', () => {
    let instance
    const sensitive = {sensitive: true}
    const insensitive = {sensitive: false}

    describe('with permission', () => {
      beforeEach(() => {
        instance = shallow(<ScreeningPage {...requiredProps} hasAddSensitivePerson={true} />).instance()
      })

      it('returns true for sensitive participant', () => {
        expect(instance.canCreateParticipant(sensitive)).toBe(true)
      })

      it('returns true for insensitive participant', () => {
        expect(instance.canCreateParticipant(insensitive)).toBe(true)
      })
    })

    describe('without permission', () => {
      beforeEach(() => {
        instance = shallow(<ScreeningPage {...requiredProps} hasAddSensitivePerson={false} />).instance()
      })

      it('returns true for sensitive participant', () => {
        expect(instance.canCreateParticipant(sensitive)).toBe(false)
      })

      it('returns true for insensitive participant', () => {
        expect(instance.canCreateParticipant(insensitive)).toBe(true)
      })
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
            {agency_code: 'ANAMECODE', agency_type: 'Licensing'},
            {agency_code: '', agency_type: 'District attorney'},
          ],
          address: {city: 'Davis', county: 'Yolo'},
          report_narrative: 'I have things to say',
        }),
        participants,
      }
      instance = shallow(<ScreeningPage {...props} />).instance()
      const allegationEdit = Immutable.fromJS({123: {456: ['General neglect']}})
      instance.setField(['allegations'], allegationEdit)
      instance.setField(['report_narrative'], 'This is my new narrative')
      instance.setField(['name'], 'A name')
      instance.setField(['reference'], 'ABC123')
      instance.setField(['cross_reports'], [{agency_code: 'NEWNAMECODE', agency_type: 'District attorney'}])
      instance.setField(['address', 'city'], 'Sacramento')
    })

    it('overrides cross_reports instead of merging', () => {
      instance.cardSave(['cross_reports'])
      expect(saveScreening).toHaveBeenCalledWith({
        ...requiredScreeningAttributes,
        name: 'The old name',
        reference: 'old reference',
        cross_reports: [
          {agency_code: 'NEWNAMECODE', agency_type: 'District attorney'},
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
          {agency_code: 'ANAMECODE', agency_type: 'Licensing'},
          {agency_code: '', agency_type: 'District attorney'},
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
          {agency_code: 'ANAMECODE', agency_type: 'Licensing'},
          {agency_code: '', agency_type: 'District attorney'},
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
          {agency_code: 'ANAMECODE', agency_type: 'Licensing'},
          {agency_code: '', agency_type: 'District attorney'},
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
          {agency_code: 'ANAMECODE', agency_type: 'Licensing'},
          {agency_code: '', agency_type: 'District attorney'},
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
})
