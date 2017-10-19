import * as IntakeConfig from 'common/config'
import Immutable from 'immutable'
import React from 'react'
import DecisionShowView from 'screenings/DecisionShowView'
import {shallow} from 'enzyme'

describe('DecisionShowView', () => {
  let component
  let onEdit
  const errors = {screening_decision: []}

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

  it('renders errors passed for screening decision', () => {
    expect(component.find('ShowField[label="Screening Decision"]').props().errors).toEqual([])
  })

  it('renders the show fields with text input decision_detail', () => {
    const screening = Immutable.fromJS({
      additional_information: 'the decision is decided',
      screening_decision: 'differential_response',
      screening_decision_detail: 'Some character string',
    })
    const component = shallow(<DecisionShowView screening={screening} onEdit={onEdit} errors={errors}/>)
    expect(component.find('ShowField').length).toEqual(4)
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
    expect(component.find('ShowField').length).toEqual(4)
    expect(component.find('ShowField[label="Screening Decision"]').props().children)
      .toEqual('Screen out')
    expect(component.find('ShowField[label="Category"]').html())
      .toContain('Consultation')
    expect(component.find('ShowField[label="Category"]').props().labelClassName)
      .not.toContain('required')
    expect(component.find('ShowField[label="Additional information"]').html())
      .toContain('the decision is decided')
    expect(component.find('ShowField[label="Access Restrictions"]').exists()).toEqual(true)
  })

  describe('when restrictions field is set', () => {
    let component
    beforeEach(() => {
      const screening = Immutable.fromJS({
        access_restrictions: 'sensitive',
        restrictions_rationale: 'This is sensitive',
      })
      component = shallow(<DecisionShowView screening={screening} onEdit={onEdit} errors={errors}/>)
    })

    it('renders Access Restrictions', () => {
      expect(component.find('ShowField[label="Access Restrictions"]').props().children)
        .toEqual('Sensitive')
    })

    it('renders Restrictions Rationale', () => {
      expect(component.find('ShowField[label="Restrictions Rationale"]').html())
        .toContain('This is sensitive')
    })

    it('marks Restrictions Rationale as required', () => {
      expect(component.find('ShowField[label="Restrictions Rationale"]').props().required)
        .toEqual(true)
    })
  })

  it('does not render Restrictions Rationale field in case of no access restrictions', () => {
    expect(component.find('ShowField[label="Restrictions Rationale"]').exists()).toEqual(false)
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
      access_restrictions: null,
    })
    const component = shallow(<DecisionShowView screening={screening} onEdit={onEdit} errors={errors}/>)
    expect(component.find('ShowField').length).toEqual(4)
    expect(component.find('ShowField[label="Screening Decision"]').html())
      .toContain('<span></span>')
    expect(component.find('ShowField[label="Category"]').exists()).toEqual(false)
    expect(component.find('ShowField[label="Additional information"]').html())
      .toContain('<span></span>')
    expect(component.find('ShowField[label="Access Restrictions"]').exists()).toEqual(true)
  })
})
