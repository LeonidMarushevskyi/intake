import * as IntakeConfig from 'common/config'
import Immutable from 'immutable'
import React from 'react'
import DecisionEditView from 'screenings/DecisionEditView'
import {shallow, mount} from 'enzyme'
import SCREENING_DECISION_OPTIONS from 'enums/ScreeningDecisionOptions'

describe('conditional decision options', () => {
  let component
  const errors = Immutable.fromJS({screening_decision: [], screening_decision_detail: []})

  beforeEach(() => {
    const sdmPath = 'https://ca.sdmdata.org'
    const props = {
      onChange: jasmine.createSpy(),
      onCancel: jasmine.createSpy(),
      onSave: jasmine.createSpy(),
      onBlur: jasmine.createSpy(),
      screening: Immutable.fromJS({
        screening_decision: 'promote_to_referral',
        screening_decision_detail: 'immediate',
        access_restrictions: 'sensitive',
        restrictions_rationale: 'Child at risk',
      }),
      errors: errors,
    }
    spyOn(IntakeConfig, 'sdmPath').and.returnValue(sdmPath)
    component = mount(<DecisionEditView {...props} />)
  })

  it('renders input for Differential response', () => {
    component.setProps({screening: Immutable.fromJS({
      screening_decision: 'differential_response',
      screening_decision_detail: 'Service name text',
    })})
    expect(component.find('#decisionDetail').props().value).toEqual('Service name text')
    expect(component.find('#decisionDetail').props().maxLength).toEqual('64')
    expect(component.find('label[htmlFor="decisionDetail"]').text()).toEqual('Service name')
  })

  it('renders input for Information to child welfare services', () => {
    component.setProps({screening: Immutable.fromJS({
      screening_decision: 'information_to_child_welfare_services',
      screening_decision_detail: 'Staff name text',
    })})
    expect(component.find('#decisionDetail').props().value).toEqual('Staff name text')
    expect(component.find('#decisionDetail').props().maxLength).toEqual('64')
    expect(component.find('label[htmlFor="decisionDetail"]').text()).toEqual('Staff name')
  })

  it('renders options for Promote to referral', () => {
    const options = component.find('#decisionDetail').find('option')
    const optionList = Object.keys(SCREENING_DECISION_OPTIONS.promote_to_referral.values).map((key) => (
      SCREENING_DECISION_OPTIONS.promote_to_referral.values[key]
    ))
    options.map((option) => {
      if (option.props().value) {
        expect(optionList).toContain(option.props().children)
      }
    })
    expect(options.length).toEqual(optionList.length + 1)
    expect(component.find('#decisionDetail').props().required).toEqual(true)
    expect(component.find('label[htmlFor="decisionDetail"]').text()).toEqual('Response time')
  })

  it('renders options for Screen out', () => {
    component.setProps({screening: Immutable.fromJS({
      screening_decision: 'screen_out',
      screening_decision_detail: 'Consultation',
    })})
    const optionList = Object.keys(SCREENING_DECISION_OPTIONS.screen_out.values).map((key) => (
      SCREENING_DECISION_OPTIONS.screen_out.values[key]
    ))
    const options = component.find('#decisionDetail').find('option')
    options.map((option) => {
      if (option.props().value) {
        expect(optionList).toContain(option.props().children)
      }
    })
    expect(options.length).toEqual(optionList.length + 1)
    expect(component.find('#decisionDetail').props().required).toBeFalsy()
    expect(component.find('label[htmlFor="decisionDetail"]').text()).toEqual('Category')
  })

  it('renders non-required Staff name field for Information to child welfare services', () => {
    component.setProps({screening: Immutable.fromJS({
      screening_decision: 'information_to_child_welfare_services',
    })})
    expect(component.find('#decisionDetail').props().required).toBeFalsy()
    expect(component.find('label[htmlFor="decisionDetail"]').text()).toEqual('Staff name')
  })

  it('renders non-required Service name field for Differential response', () => {
    component.setProps({screening: Immutable.fromJS({
      screening_decision: 'differential_response',
    })})
    expect(component.find('#decisionDetail').props().required).toBeFalsy()
    expect(component.find('label[htmlFor="decisionDetail"]').text()).toEqual('Service name')
  })

  it('renders access restrictions field', () => {
    expect(component.find('#access_restrictions').props().value).toEqual('sensitive')
  })

  it('renders restrictions rationale field for access restrictions', () => {
    expect(component.find('label[htmlFor="decisionDetail"]').props().className).toBe('required')
    expect(component.find('#restrictions_rationale').props().value).toEqual('Child at risk')
  })

  it('does not render restrictions rationale field if no access restrictions are selected', () => {
    component.setProps({screening: Immutable.fromJS({access_restrictions: ''})})
    expect(component.find('#restrictions_rationale').exists()).toEqual(false)
  })
})

describe('DecisionEditView', () => {
  let component
  let props
  const errors = {screening_decision: [], screening_decision_detail: []}

  beforeEach(() => {
    const sdmPath = 'https://ca.sdmdata.org'
    props = {
      onChange: jasmine.createSpy(),
      onCancel: jasmine.createSpy(),
      onSave: jasmine.createSpy(),
      onBlur: jasmine.createSpy(),
      screening: Immutable.fromJS({
        screening_decision: 'differential_response',
        additional_information: 'more info',
        screening_decision_detail: 'Name of the service',
      }),
      errors: errors,
    }
    spyOn(IntakeConfig, 'sdmPath').and.returnValue(sdmPath)
    component = shallow(<DecisionEditView {...props} />)
  })

  it('renders errors for screening_decision', () => {
    expect(component.find('#screening_decision').props().errors).toEqual([])
  })

  it('renders errors for screening_decision_detail', () => {
    expect(component.find('#decisionDetail').props().errors).toEqual([])
  })

  it('calls onBlur with the proper field name for screening decision', () => {
    component.find('#screening_decision').simulate('blur')
    expect(props.onBlur).toHaveBeenCalledWith('screening_decision')
  })

  it('calls onBlur with the proper field name for screening decision detail', () => {
    component.find('#decisionDetail').simulate('blur')
    expect(props.onBlur).toHaveBeenCalledWith('screening_decision_detail')
  })

  it('renders the report narrative label as required', () => {
    expect(component.find('SelectField[label="Screening Decision"]').props().required)
      .toEqual(true)
  })

  it('renders the input fields', () => {
    expect(component.find('SelectField[label="Screening Decision"]').props().value)
      .toEqual('differential_response')
    expect(component.find('InputField[label="Service name"]').props().value)
      .toEqual('Name of the service')
    expect(component.find('SelectField[label="Category"]').exists()).toEqual(false)
    expect(component.find('textarea#additional_information').props().value)
      .toEqual('more info')
    expect(component.find('SelectField[label="Access Restrictions"]').exists()).toEqual(true)
  })

  it('displays a select list when the decision option requires one', () => {
    props = {
      onChange: jasmine.createSpy(),
      onCancel: jasmine.createSpy(),
      onSave: jasmine.createSpy(),
      onBlur: jasmine.createSpy(),
      screening: Immutable.fromJS({
        screening_decision: 'screen_out',
        screening_decision_detail: 'Consultation',
      }),
      errors: errors,
    }
    component = shallow(<DecisionEditView {...props} />)
    const selectField = component.find('SelectField[label="Category"]')
    selectField.simulate('blur')
    expect(props.onBlur).toHaveBeenCalledWith('screening_decision_detail')
    expect(selectField.props().errors).toEqual([])
    expect(selectField.length).toEqual(1)
    expect(component.find('InputField[label="Service name"]').length).toEqual(0)
  })

  it('renders the SDM link', () => {
    const sdm_link = component.find('#complete_sdm')
    expect(component.text()).toContain('SDM Hotline Tool')
    expect(component.text()).toContain('Determine Decision and Response Time by using Structured Decision Making')
    expect(sdm_link.prop('href')).toEqual('https://ca.sdmdata.org')
    expect(sdm_link.prop('target')).toEqual('_blank')
  })

  it('renders the save button', () => {
    expect(component.find('.btn.btn-primary').text()).toEqual('Save')
  })

  it('renders the cancel link', () => {
    expect(component.find('.btn.btn-default').text()).toEqual('Cancel')
  })

  it('fires the onChange call when a field changes', () => {
    component.find('#additional_information').simulate('change', {target: {value: 'the decision is taken'}})
    expect(props.onChange).toHaveBeenCalledWith(['additional_information'], 'the decision is taken')
  })

  it('calls onSave', () => {
    component = shallow(<DecisionEditView {...props} />)
    component.find('.btn.btn-primary').simulate('click')
    expect(props.onSave).toHaveBeenCalled()
  })

  it('calls onCancel', () => {
    component = shallow(<DecisionEditView {...props} />)
    component.find('.btn.btn-default').simulate('click')
    expect(props.onCancel).toHaveBeenCalled()
  })
})
