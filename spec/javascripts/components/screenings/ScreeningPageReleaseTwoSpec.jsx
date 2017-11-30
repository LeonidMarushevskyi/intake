import {List, fromJS} from 'immutable'
import React from 'react'
import {ScreeningPage} from 'screenings/ScreeningPage'
import {shallow} from 'enzyme'
import * as IntakeConfig from 'common/config'

describe('ScreeningPage when release two is active', () => {
  beforeEach(() => {
    spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(false)
    spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(true)
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

  describe('Edit mode', () => {
    let component
    beforeEach(() => {
      component = renderScreeningPage({loaded: true, mode: 'edit'})
    })

    it('does not display a submit button', () => {
      expect(component.find('ScreeningSubmitButton').exists()).toEqual(false)
    })

    it('renders the person search form', () => {
      expect(component.find('Connect(PersonSearchForm)').exists()).toBe(true)
    })

    it('renders the snapshot copy', () => {
      expect(component.text()).toContain('The Child Welfare History Snapshot allows you to search CWS/CMS for people and their past history with CWS.')
    })

    it('does not render home and edit links', () => {
      expect(component.find({children: 'Home'}).exists()).toBe(false)
      expect(component.find({children: 'Edit'}).exists()).toBe(false)
    })

    it('does not render the screening information in edit mode', () => {
      expect(component.find('ScreeningInformationCardView').length).toEqual(0)
    })

    it('renders the start over button', () => {
      const link = component.find('Link')
      expect(link.props().children).toBe('Start Over')
      expect(link.props().to).toBe('/')
    })

    it('renders the participants card for each participant', () => {
      const participants = fromJS([{id: 'id-1'}, {id: 'id-2'}])
      const component = renderScreeningPage({participants, loaded: true, mode: 'edit'})
      expect(component.find('PersonCardView').length).toEqual(2)
    })

    it('renders the history card', () => {
      expect(component.find('Connect(HistoryOfInvolvement)').exists()).toEqual(true)
    })

    it('does not render the allegations card', () => {
      expect(component.find('AllegationsCardView').length).toEqual(0)
    })

    it('does not render the relations card', () => {
      expect(component.find('RelationshipsCard').length).toEqual(0)
    })

    it('does not render the worker safety card', () => {
      expect(component.find('WorkerSafetyCardView').length).toEqual(0)
    })

    it('does not render the screening heading', () => {
      expect(component.find('h1').length).toEqual(0)
    })
  })
})
