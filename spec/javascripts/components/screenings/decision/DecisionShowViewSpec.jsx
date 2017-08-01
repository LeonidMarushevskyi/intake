import * as IntakeConfig from 'config'
import Immutable from 'immutable'
import React from 'react'
import DecisionShowView from 'screenings/DecisionShowView'
import {shallow} from 'enzyme'

describe('DecisionShowView', () => {
  let component
  let onEdit
  const errors = Immutable.fromJS({screening_decision: []})

  beforeEach(() => {
    const sdmPath = 'https://ca.sdmdata.org'
    onEdit = jasmine.createSpy()
    spyOn(IntakeConfig, 'sdmPath').and.returnValue(sdmPath)
    component = shallow(
      <DecisionShowView
        screening={Immutable.fromJS({})}
        onEdit={onEdit}
        errors={errors}
      />
    )
  })

  it('renders the card header', () => {
    expect(component.find('.card-header').text()).toContain('Decision')
  })

  it('renders the report narrative label as required', () => {
    expect(component.find('ShowField[label="Screening Decision"]').props().required)
      .toEqual(true)
  })

  it('renders the SDM link', () => {
    const sdm_link = component.find('#complete_sdm')
    expect(component.text()).toContain('SDM Hotline Tool')
    expect(component.text()).toContain('Determine Decision and Response Time by using Structured Decision Making')
    expect(sdm_link.prop('href')).toEqual('https://ca.sdmdata.org')
    expect(sdm_link.prop('target')).toEqual('_blank')
  })

  it('renders the edit link', () => {
    expect(component.find('EditLink').props().ariaLabel).toEqual('Edit decision card')
  })

  describe('clicking the edit link', () => {
    beforeEach(() => {
      component.find('EditLink').simulate('click')
    })
    it('switches to edit mode when edit icon is clicked', () => {
      expect(onEdit).toHaveBeenCalled()
    })
  })

  it('renders errors passed for screening decision', () => {
    expect(component.find('ShowField[label="Screening Decision"]').props().errors).toEqual(Immutable.List())
  })

  it('renders the show fields with text input decision_detail', () => {
    const screening = Immutable.fromJS({
      additional_information: 'the decision is decided',
      screening_decision: 'differential_response',
      screening_decision_detail: 'Some character string',
    })
    const component = shallow(<DecisionShowView screening={screening} onEdit={onEdit} errors={errors}/>)
    expect(component.find('ShowField').length).toEqual(3)
    expect(component.find('ShowField[label="Screening Decision"]').props().children)
      .toEqual('Differential response')
    expect(component.find('ShowField[label="Service name"]').props().labelClassName)
      .not.toContain('required')
    expect(component.find('ShowField[label="Service name"]').html())
      .toContain('Some character string')
    expect(component.find('ShowField[label="Additional information"]').html())
      .toContain('the decision is decided')
  })

  it('renders the show fields with selectable decision_detail', () => {
    const screening = Immutable.fromJS({
      additional_information: 'the decision is decided',
      screening_decision: 'screen_out',
      screening_decision_detail: 'consultation',
    })
    const component = shallow(<DecisionShowView screening={screening} onEdit={onEdit} errors={errors}/>)
    expect(component.find('ShowField').length).toEqual(3)
    expect(component.find('ShowField[label="Screening Decision"]').props().children)
      .toEqual('Screen out')
    expect(component.find('ShowField[label="Category"]').html())
      .toContain('Consultation')
    expect(component.find('ShowField[label="Category"]').props().labelClassName)
      .not.toContain('required')
    expect(component.find('ShowField[label="Additional information"]').html())
      .toContain('the decision is decided')
  })

  it('renders Staff name for decision details when screening decision is information_to_child_welfare_services', () => {
    const screening = Immutable.fromJS({
      screening_decision: 'information_to_child_welfare_services',
    })
    const component = shallow(<DecisionShowView screening={screening} onEdit={onEdit} errors={errors}/>)
    expect(component.find('ShowField[label="Screening Decision"]').props().children)
      .toEqual('Information to child welfare services')
    expect(component.find('ShowField[label="Staff name"]').props().labelClassName)
      .not.toContain('required')
  })

  it('renders Response time for decision details when screening decision is promote_to_referral', () => {
    const screening = Immutable.fromJS({
      screening_decision: 'promote_to_referral',
    })
    const component = shallow(<DecisionShowView screening={screening} onEdit={onEdit} errors={errors}/>)
    expect(component.find('ShowField[label="Screening Decision"]').props().children)
      .toEqual('Promote to referral')
    expect(component.find('ShowField[label="Response time"]').props().required)
      .toEqual(true)
  })

  it('renders show fields correctly when values are not set', () => {
    const screening = Immutable.fromJS({
      screening_decision_detail: null,
      screening_decision: null,
      additional_information: null,
    })
    const component = shallow(<DecisionShowView screening={screening} onEdit={onEdit} errors={errors}/>)
    expect(component.find('ShowField').length).toEqual(3)
    expect(component.find('ShowField[label="Screening Decision"]').html())
      .toContain('<div class="c-gray"></div>')
    expect(component.find('ShowField[label="Category"]').length).toEqual(0)
    expect(component.find('ShowField[label="Additional information"]').html())
      .toContain('<div class="c-gray"></div>')
  })
})
