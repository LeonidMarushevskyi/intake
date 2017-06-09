import Immutable from 'immutable'
import React from 'react'
import {ScreeningPage} from 'components/screenings/ScreeningPage'
import {mount, shallow} from 'enzyme'
import * as config from 'config'

export const requiredScreeningAttributes = {
  allegations: [],
  id: '123456',
  safety_alerts: [],
  cross_reports: [],
}

export const requiredProps = {
  actions: {fetchScreening: () => null},
  params: {id: '1'},
  participants: Immutable.List(),
  screening: Immutable.fromJS(requiredScreeningAttributes),
  involvements: Immutable.fromJS({screenings: []}),
  relationships: Immutable.List(),
  mode: 'edit',
}

describe('render', () => {
  it('renders the history card', () => {
    const involvements = Immutable.fromJS([{id: 1}, {id: 3}])
    const participants = Immutable.fromJS([{id: 1, roles: []}])
    const props = {
      ...requiredProps,
      involvements,
      participants,
    }
    const component = shallow(<ScreeningPage {...props} />)
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
    const component = shallow(<ScreeningPage {...props} />)
    component.setState({loaded: true})
    const allegationsCard = component.find('AllegationsCardView')
    expect(allegationsCard.length).toEqual(1)
    expect(allegationsCard.props().allegations).toEqual(Immutable.List())
    expect(allegationsCard.props().mode).toEqual('edit')
    expect(allegationsCard.props().onCancel).toEqual(component.instance().cancelEdit)
  })

  it('renders to Cross Report Card and pass it allegations', () => {
    const props = {
      ...requiredProps,
      mode: 'edit',
      screening: Immutable.fromJS({
        allegations: [],
        id: '123456',
        safety_alerts: [],
        cross_reports: [
          {agency_type: 'District attorney', agency_name: 'SCDA Office'},
          {agency_type: 'Department of justice'},
        ],
      }),
    }
    const component = shallow(<ScreeningPage {...props} />)
    component.setState({loaded: true})
    const crossReportsCard = component.find('CrossReportCardView')
    expect(crossReportsCard.length).toEqual(1)
    expect(crossReportsCard.props().allegations).toEqual(Immutable.fromJS([]))
    expect(crossReportsCard.props().crossReports).toEqual(props.screening.get('cross_reports'))
    expect(crossReportsCard.props().mode).toEqual('edit')
  })

  it('renders the relations card', () => {
    const props = {
      ...requiredProps,
      mode: 'edit',
      participants: Immutable.fromJS([]),
      relationships: Immutable.fromJS([{id: '123'}]),
    }
    const component = shallow(<ScreeningPage {...props} />)
    expect(component.find('RelationshipsCard').length).toEqual(1)
    expect(component.find('RelationshipsCard').props().participants).toEqual(Immutable.fromJS([]))
    expect(component.find('RelationshipsCard').props().relationships).toEqual(props.relationships)
    expect(component.find('RelationshipsCard').props().screeningId).toEqual(props.params.id)
    expect(component.find('RelationshipsCard').props().actions).toEqual(props.actions)
  })

  it('renders the worker safety card', () => {
    const props = {
      ...requiredProps,
      mode: 'edit',
    }
    const component = shallow(<ScreeningPage {...props} />)
    component.setState({loaded: true})
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
    }
    const component = shallow(<ScreeningPage {...props} mode='show'/>)
    expect(component.find('h1').text()).toEqual('Screening #The Rocky Horror Picture Show')
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
    mount(<ScreeningPage {...props} />)
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
      }

      component = shallow(<ScreeningPage {...props} />)
      component.setState({loaded: true})
    })

    it('renders the home and edit link', () => {
      const homeLink = component.find({to: '/'})
      const editLink = component.find({to: '/screenings/1/edit'})
      expect(homeLink.html()).toContain('Home')
      expect(editLink.html()).toContain('Edit')
    })

    it('renders the screening information show card', () => {
      expect(component.find('ScreeningInformationCardView').props().mode).toEqual('show')
    })

    it('renders the incident information show card', () => {
      expect(component.find('IncidentInformationCardView').props().mode).toEqual('show')
    })

    it('renders the decision show card', () => {
      expect(component.find('DecisionCardView').props().mode).toEqual('show')
    })

    it('renders the cross report show card', () => {
      expect(component.find('CrossReportCardView').props().mode).toEqual('show')
    })

    it('renders the history card', () => {
      expect(component.find('HistoryCard').length).toEqual(1)
      expect(component.find('HistoryCard').props().actions).toEqual(props.actions)
      expect(component.find('HistoryCard').props().involvements).toEqual(props.involvements)
      expect(component.find('HistoryCard').props().participants).toEqual(props.participants)
      expect(component.find('HistoryCard').props().screeningId).toEqual(props.params.id)
    })

    it('renders the allegations card', () => {
      const allegationsCard = component.find('AllegationsCardView')
      expect(allegationsCard.length).toEqual(1)
      expect(allegationsCard.props().allegations).toEqual(Immutable.List())
      expect(allegationsCard.props().mode).toEqual('show')
      expect(allegationsCard.props().onCancel).toEqual(component.instance().cancelEdit)
    })

    it('renders the relationships card', () => {
      const relationshipsCard = component.find('RelationshipsCard')
      expect(relationshipsCard.length).toEqual(1)
      expect(relationshipsCard.props().participants).toEqual(props.participants)
      expect(relationshipsCard.props().relationships).toEqual(props.relationships)
      expect(relationshipsCard.props().screeningId).toEqual(props.params.id)
      expect(relationshipsCard.props().actions).toEqual(props.actions)
    })

    it('renders the worker safety card', () => {
      const safetyCard = component.find('WorkerSafetyCardView')
      expect(safetyCard.length).toEqual(1)
      expect(safetyCard.props().mode).toEqual('show')
      expect(safetyCard.props().onCancel).toEqual(component.instance().cancelEdit)
    })

    it('renders the participants card for each participant', () => {
      expect(component.find('ParticipantCardView').length).toEqual(2)
      expect(component.find('ParticipantCardView').nodes.map((ele) => ele.props.mode)).toEqual(
        ['show', 'show']
      )
    })

    it('renders the narrative card after screening is loaded', () => {
      expect(component.find('NarrativeCardView').props().narrative).toEqual(
        'this is a narrative report'
      )
      expect(component.find('NarrativeCardView').props().mode).toEqual('show')
    })
  })
})

describe('loading flag', () => {
  const props = {
    ...requiredProps,
    screening: Immutable.fromJS({
      ...requiredScreeningAttributes,
      report_narrative: 'this is a narrative report',
    }),
    mode: 'edit',
  }

  let component

  beforeEach(() => {
    component = shallow(<ScreeningPage {...props} />)
  })

  describe('is true', () => {
    beforeEach(() => {
      component.setState({loaded: true})
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
      }
      const component = shallow(<ScreeningPage {...props} />)
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
        component = shallow(<ScreeningPage {...props} />)
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
  })
})

it('renders the submit button', () => {
  const component = shallow(<ScreeningPage {...requiredProps} />)
  expect(component.find('button[children="Submit"]').length).toEqual(1)
})

describe('when referral_submit is active', () => {
  beforeEach(() => {
    spyOn(config, 'isFeatureActive')
    config.isFeatureActive.and.returnValue(true)
  })

  it('clicking the submit button submits the screening', () => {
    const submitScreening = jasmine.createSpy('submitScreening')
    const props = {
      ...requiredProps,
      params: {id: '99'},
      actions: {submitScreening},
    }
    const component = shallow(<ScreeningPage {...props} />)
    component.find('button[children="Submit"]').simulate('click')
    expect(config.isFeatureActive).toHaveBeenCalledWith('referral_submit')
    expect(submitScreening).toHaveBeenCalledWith('99')
  })
})

describe('when referral_submit is not active', () => {
  beforeEach(() => {
    spyOn(config, 'isFeatureActive')
    config.isFeatureActive.and.returnValue(false)
  })

  it('clicking the submit button does not submits the screening', () => {
    const submitScreening = jasmine.createSpy('submitScreening')
    const props = {
      ...requiredProps,
      params: {id: '99'},
      actions: {submitScreening},
    }
    const component = shallow(<ScreeningPage {...props} />)
    component.find('button[children="Submit"]').simulate('click')
    expect(config.isFeatureActive).toHaveBeenCalledWith('referral_submit')
    expect(submitScreening).not.toHaveBeenCalled()
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
    instance = shallow(<ScreeningPage {...props} />).instance()
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

