import * as IntakeConfig from 'common/config'
import {List, Map} from 'immutable'
import React from 'react'
import {ScreeningPage} from 'screenings/ScreeningPage'
import {mount, shallow} from 'enzyme'

describe('ScreeningPage', () => {
  const sdmPath = 'https://ca.sdmdata.org'

  beforeEach(() => {
    spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(true)
    spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false)
    spyOn(IntakeConfig, 'sdmPath').and.returnValue(sdmPath)
  })

  function renderScreeningPage({
    actions = {},
    editable = true,
    loaded,
    mode,
    params = {},
    participants = List(),
    reference,
    referralId,
  }) {
    const props = {
      actions,
      editable,
      loaded,
      mode,
      params,
      participants,
      reference,
      referralId,
    }
    return shallow(<ScreeningPage {...props} />)
  }
  function mountScreeningPage({
    actions: {
      setPageMode = () => null,
      fetchScreening = () => null,
      fetchRelationships = () => null,
      fetchHistoryOfInvolvements = () => null,
      checkStaffPermission = () => null,
    },
    participants = {},
    screening = {},
    params = {},
    editable,
  }) {
    const props = {
      actions: {
        setPageMode,
        fetchScreening,
        fetchRelationships,
        fetchHistoryOfInvolvements,
        checkStaffPermission,
      },
      params,
      participants,
      screening,
      editable,
    }
    return mount(<ScreeningPage {...props}/>)
  }

  describe('componentDidMount', () => {
    it("sets the page mode to 'edit' when url mode is 'edit' and editable is true", () => {
      const setPageMode = jasmine.createSpy('setPageMode')
      mountScreeningPage({
        editable: true,
        actions: {setPageMode},
        params: {mode: 'edit'},
      })
      expect(setPageMode).toHaveBeenCalledWith('edit')
    })

    it("sets the page mode to 'show' when url mode is 'show' and editable is true", () => {
      const setPageMode = jasmine.createSpy('setPageMode')
      mountScreeningPage({
        editable: true,
        actions: {setPageMode},
        params: {mode: 'show'},
      })
      expect(setPageMode).toHaveBeenCalledWith('show')
    })

    it("sets the page mode to 'show' when url mode is 'edit' and editable is false", () => {
      const setPageMode = jasmine.createSpy('setPageMode')
      mountScreeningPage({
        editable: false,
        actions: {setPageMode},
        params: {mode: 'edit'},
      })
      expect(setPageMode).toHaveBeenCalledWith('show')
    })

    describe('when the screening page URL ID is present', () => {
      const id = '222'
      let fetchScreening
      let fetchRelationships
      let fetchHistoryOfInvolvements
      beforeEach(() => {
        fetchScreening = jasmine.createSpy('fetchScreening')
        fetchRelationships = jasmine.createSpy('fetchRelationships')
        fetchHistoryOfInvolvements = jasmine.createSpy('fetchHistoryOfInvolvements')
        mountScreeningPage({
          actions: {fetchScreening, fetchRelationships, fetchHistoryOfInvolvements},
          params: {id},
        })
      })

      it('fetches screening from the url ID', () => {
        expect(fetchScreening).toHaveBeenCalledWith(id)
      })

      it('fetches relationships for the screening from the url ID', () => {
        expect(fetchRelationships).toHaveBeenCalledWith(id)
      })

      it('fetches HOI for the screening from the url ID', () => {
        expect(fetchHistoryOfInvolvements).toHaveBeenCalledWith(id)
      })
    })

    it('fetches the current users staff permissions', () => {
      const checkStaffPermission = jasmine.createSpy('checkStaffPermission')
      mountScreeningPage({actions: {checkStaffPermission}})
      expect(checkStaffPermission).toHaveBeenCalledWith('add_sensitive_people')
    })
  })

  describe('render', () => {
    describe('in edit mode', () => {
      let component
      beforeEach(() => {
        component = renderScreeningPage({loaded: true, mode: 'edit'})
      })

      it('does not render home and edit links', () => {
        expect(component.find({to: '/'}).exists()).toEqual(false)
        expect(component.find({to: '/screenings/1/edit'}).exists()).toEqual(false)
      })

      it('renders the history card', () => {
        const card = component.find('Connect(HistoryOfInvolvement)')
        expect(card.exists()).toEqual(true)
      })

      it('renders the allegations card', () => {
        const card = component.find('AllegationsCardView')
        expect(card.exists()).toEqual(true)
        expect(card.props().mode).toEqual('edit')
      })

      it('renders to Cross Report Card', () => {
        const card = component.find('CrossReportCardView')
        expect(card.exists()).toEqual(true)
        expect(card.props().mode).toEqual('edit')
      })

      it('renders the relations card', () => {
        const card = component.find('Connect(RelationshipsCard)')
        expect(card.exists()).toEqual(true)
      })

      it('renders the worker safety card', () => {
        const card = component.find('WorkerSafetyCardView')
        expect(card.exists()).toEqual(true)
        expect(card.props().mode).toEqual('edit')
      })

      it('renders the screening reference in show', () => {
        const heading = renderScreeningPage({
          mode: 'show',
          reference: 'The Rocky Horror Picture Show',
          loaded: true,
        }).find('h1')
        expect(heading.text()).toEqual('Screening #The Rocky Horror Picture Show')
      })

      it('renders the screening reference in edit', () => {
        const heading = renderScreeningPage({
          mode: 'edit',
          reference: 'The Rocky Horror Picture Show',
          loaded: true,
        }).find('h1')
        expect(heading.text()).toEqual('Edit Screening #The Rocky Horror Picture Show')
      })

      it('renders the referral id, if present', () => {
        const heading = renderScreeningPage({
          mode: 'show',
          reference: 'ABCDEF',
          referralId: '123456',
          loaded: true,
        }).find('h1')
        expect(heading.text()).toEqual('Screening #ABCDEF - Referral #123456')
      })

      it('renders the search card', () => {
        expect(component.find('Connect(PersonSearchForm)').exists()).toEqual(true)
      })

      it('renders the submit button with a modal', () => {
        expect(component.find('ScreeningSubmitButton').exists()).toEqual(false)
        expect(component.find('ScreeningSubmitButtonWithModal').exists()).toEqual(true)
      })
    })

    describe('in show mode', () => {
      let component
      beforeEach(() => {
        component = renderScreeningPage({
          loaded: true,
          mode: 'show',
          participants: List([Map(), Map()]),
          params: {id: '1'},
        })
      })

      it('renders the home and edit link', () => {
        const homeLink = component.find({children: 'Home', to: '/'})
        const editLink = component.find({children: 'Edit', to: '/screenings/1/edit'})
        expect(homeLink.exists()).toBe(true)
        expect(editLink.exists()).toBe(true)
      })

      it('renders the screening information card', () => {
        const card = component.find('ScreeningInformationCardView')
        expect(card.exists()).toEqual(true)
        expect(card.props().mode).toEqual('show')
      })

      it('renders the participants card for each participant', () => {
        const cards = component.find('ParticipantCardView')
        expect(cards.length).toEqual(2)
        expect(cards.nodes.map((ele) => ele.props.mode)).toEqual(
          ['show', 'show']
        )
      })

      it('renders the narrative card', () => {
        const card = component.find('NarrativeCardView')
        expect(card.exists()).toEqual(true)
        expect(card.props().mode).toEqual('show')
      })

      it('renders the incident information show card', () => {
        const card = component.find('IncidentInformationCardView')
        expect(card.exists()).toEqual(true)
        expect(card.props().mode).toEqual('show')
      })

      it('renders the worker safety card', () => {
        const card = component.find('WorkerSafetyCardView')
        expect(card.exists()).toEqual(true)
        expect(card.props().mode).toEqual('show')
      })

      it('renders the history card', () => {
        const card = component.find('Connect(HistoryOfInvolvement)')
        expect(card.exists()).toEqual(true)
      })

      it('renders the cross report show card', () => {
        const card = component.find('CrossReportCardView')
        expect(card.exists()).toEqual(true)
        expect(card.props().mode).toEqual('show')
      })

      it('renders the decision show card', () => {
        const card = component.find('DecisionCardView')
        expect(card.exists()).toEqual(true)
        expect(card.props().mode).toEqual('show')
      })

      it('does not render the person search card', () => {
        expect(component.find('Connect(PersonSearchForm)').exists()).toEqual(false)
      })

      it('renders the submit button with a modal', () => {
        expect(component.find('ScreeningSubmitButton').exists()).toEqual(false)
        expect(component.find('ScreeningSubmitButtonWithModal').exists()).toEqual(true)
      })
    })
  })

  describe('when screening is not loaded', () => {
    it('renders an empty div', () => {
      expect(renderScreeningPage({loaded: false}).html()).toEqual('<div></div>')
    })
  })
})
