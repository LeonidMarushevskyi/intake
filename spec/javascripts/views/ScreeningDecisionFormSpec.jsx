import React from 'react'
import {shallow} from 'enzyme'
import ScreeningDecisionForm from 'views/ScreeningDecisionForm'

describe('ScreeningDecisionForm', () => {
  const renderScreeningDecisionForm = ({
    accessRestriction = {},
    accessRestrictionOptions = [],
    additionalInformation = {},
    decision = {},
    decisionOptions = [],
    decisionDetail = {label: ''},
    decisionDetailOptions = [],
    restrictionRationale = {},
    ...options
  }) => {
    const props = {
      accessRestriction,
      accessRestrictionOptions,
      additionalInformation,
      decision,
      decisionOptions,
      decisionDetail,
      decisionDetailOptions,
      restrictionRationale,
      ...options,
    }
    return shallow(<ScreeningDecisionForm {...props}/>)
  }

  it('renders "Screening Decision" in the card header', () => {
    const component = renderScreeningDecisionForm({})
    expect(component.find('.card-header').text()).toEqual('Decision')
  })

  it('renders text about completing the SDM tool', () => {
    const component = renderScreeningDecisionForm({})
    expect(component.text()).toContain('SDM Hotline Tool')
    expect(component.text()).toContain('Determine Decision and Response Time by using Structured Decision Making.')
  })

  it('renders a link to the SDM tool', () => {
    const sdmPath = 'http://foo.com'
    const component = renderScreeningDecisionForm({sdmPath})
    const sdmLink = component.find('a')
    expect(sdmLink.props().href).toEqual(sdmPath)
    expect(sdmLink.props().target).toEqual('_blank')
    expect(sdmLink.text()).toEqual('Complete SDM')
  })

  it('renders a save button', () => {
    const component = renderScreeningDecisionForm({})
    const saveButton = component.find('button[children="Save"]')
    expect(saveButton.exists()).toEqual(true)
  })

  it('calls onSave when the save button is clicked', () => {
    const onSave = jasmine.createSpy('onSave')
    const component = renderScreeningDecisionForm({onSave})
    const saveButton = component.find('button[children="Save"]')
    saveButton.simulate('click')
    expect(onSave).toHaveBeenCalled()
  })

  it('renders a cancel button', () => {
    const component = renderScreeningDecisionForm({})
    const cancelButton = component.find('button[children="Cancel"]')
    expect(cancelButton.exists()).toEqual(true)
  })

  it('calls onCancel when the save button is clicked', () => {
    const onCancel = jasmine.createSpy('onCancel')
    const component = renderScreeningDecisionForm({onCancel})
    const cancelButton = component.find('button[children="Cancel"]')
    cancelButton.simulate('click')
    expect(onCancel).toHaveBeenCalled()
  })

  describe('decision select field', () => {
    it('renders a select dropdown for the decision', () => {
      const component = renderScreeningDecisionForm({})
      const decisionSelect = component.find('SelectField[label="Screening decision"]')
      expect(decisionSelect.exists()).toEqual(true)
      expect(decisionSelect.props().id).toEqual('screening_decision')
      expect(decisionSelect.props().required).toEqual(true)
    })

    it('calls the onBlur function when decision is blurred', () => {
      const onBlur = jasmine.createSpy('onBlur')
      const component = renderScreeningDecisionForm({onBlur})
      const decisionSelect = component.find('SelectField[label="Screening decision"]')
      decisionSelect.simulate('blur')
      expect(onBlur).toHaveBeenCalledWith('screening_decision')
    })

    it('calls onChange when decision is changed', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderScreeningDecisionForm({onChange})
      const decisionSelect = component.find('SelectField[label="Screening decision"]')
      decisionSelect.simulate('change', {target: {value: 'promote_to_referral'}})
      expect(onChange).toHaveBeenCalledWith('screening_decision', 'promote_to_referral')
    })

    it('renders the passed options for the select', () => {
      const decisionOptions = [
        {value: 'promote_to_referral', label: 'Promote to referral'},
        {value: 'screen_out', label: 'Screen out'},
      ]
      const component = renderScreeningDecisionForm({decisionOptions})
      const decisionSelect = component.find('SelectField[label="Screening decision"]')
      const options = decisionSelect.children()
      expect(options.at(0).props().value).toEqual(undefined) //empty first option
      expect(options.at(1).props().value).toEqual('promote_to_referral')
      expect(options.at(1).text()).toEqual('Promote to referral')
      expect(options.at(2).props().value).toEqual('screen_out')
      expect(options.at(2).text()).toEqual('Screen out')
    })

    it('passes decision errors to the select field', () => {
      const decision = {errors: ['This is wrong!']}
      const component = renderScreeningDecisionForm({decision})
      const decisionSelect = component.find('SelectField[label="Screening decision"]')
      expect(decisionSelect.props().errors).toEqual(['This is wrong!'])
    })

    it('passes decision value to the select field', () => {
      const decision = {value: 'promote_to_referral'}
      const component = renderScreeningDecisionForm({decision})
      const decisionSelect = component.find('SelectField[label="Screening decision"]')
      expect(decisionSelect.props().value).toEqual('promote_to_referral')
    })
  })

  describe('decision detail field', () => {
    it('does not render if screening decision is not set', () => {
      const component = renderScreeningDecisionForm({})
      const decisionDetailInput = component.find('InputField[label="My decision detail"]')
      expect(decisionDetailInput.exists()).toEqual(false)
      const decisionDetailSelect = component.find('SelectField[label="My decision detail"]')
      expect(decisionDetailSelect.exists()).toEqual(false)
    })

    describe('decision detail input field', () => {
      const decision = {value: 'differential_response'}
      const decisionDetailOptions = []
      const decisionDetail = {
        label: 'My decision detail',
        value: 'My decision is very detailed',
        errors: ['Errors are here!'],
        required: false,
      }

      it('renders a text field with the proper label if detailOptions is an empty list', () => {
        const component = renderScreeningDecisionForm({decision, decisionDetail, decisionDetailOptions})
        const decisionDetailInput = component.find('InputField[label="My decision detail"]')
        expect(decisionDetailInput.exists()).toEqual(true)
        const decisionDetailSelect = component.find('SelectField[label="My decision detail"]')
        expect(decisionDetailSelect.exists()).toEqual(false)
      })

      it('passes the decisionDetail value to the input field', () => {
        const component = renderScreeningDecisionForm({decision, decisionDetail, decisionDetailOptions})
        const decisionDetailInput = component.find('InputField[label="My decision detail"]')
        expect(decisionDetailInput.props().value).toEqual('My decision is very detailed')
      })

      it('passes the decisionDetail errors to the input field', () => {
        const component = renderScreeningDecisionForm({decision, decisionDetail, decisionDetailOptions})
        const decisionDetailInput = component.find('InputField[label="My decision detail"]')
        expect(decisionDetailInput.props().errors).toEqual(['Errors are here!'])
      })

      it('passes whether or not decisionDetail is required to the input field', () => {
        const component = renderScreeningDecisionForm({decision, decisionDetail, decisionDetailOptions})
        const decisionDetailInput = component.find('InputField[label="My decision detail"]')
        expect(decisionDetailInput.props().required).toEqual(false)
      })

      it('sets default props for the input field', () => {
        const component = renderScreeningDecisionForm({decision, decisionDetail, decisionDetailOptions})
        const decisionDetailInput = component.find('InputField[label="My decision detail"]')
        expect(decisionDetailInput.props().id).toEqual('decision_detail')
        expect(decisionDetailInput.props().maxLength).toEqual('64')
      })

      it('calls the onBlur function when decisionDetail is blurred', () => {
        const onBlur = jasmine.createSpy('onBlur')
        const component = renderScreeningDecisionForm({decision, decisionDetail, decisionDetailOptions, onBlur})
        const decisionDetailInput = component.find('InputField[label="My decision detail"]')
        decisionDetailInput.simulate('blur')
        expect(onBlur).toHaveBeenCalledWith('screening_decision_detail')
      })

      it('calls onChange when decisionDetail is changed', () => {
        const onChange = jasmine.createSpy('onChange')
        const component = renderScreeningDecisionForm({decision, decisionDetail, decisionDetailOptions, onChange})
        const decisionDetailInput = component.find('InputField[label="My decision detail"]')
        decisionDetailInput.simulate('change', {target: {value: 'My detail'}})
        expect(onChange).toHaveBeenCalledWith('screening_decision_detail', 'My detail')
      })
    })

    describe('decision detail select field', () => {
      const decision = {value: 'promote_to_referral'}
      const decisionDetailOptions = [
        {value: '3_day', label: '3 days'},
        {value: '10_day', label: '10 days'},
      ]
      const decisionDetail = {
        label: 'My decision detail',
        value: '3_day',
        errors: ['Errors are here!'],
        required: false,
      }

      it('renders a select field with the proper label if detailOptions is an array of select options', () => {
        const decisionDetail = {label: 'My decision detail'}
        const component = renderScreeningDecisionForm({decision, decisionDetail, decisionDetailOptions})
        const decisionDetailSelect = component.find('SelectField[label="My decision detail"]')
        expect(decisionDetailSelect.exists()).toEqual(true)
        const decisionDetailInput = component.find('InputField[label="My decision detail"]')
        expect(decisionDetailInput.exists()).toEqual(false)
      })

      it('passes the decisionDetail value to the select field', () => {
        const component = renderScreeningDecisionForm({decision, decisionDetail, decisionDetailOptions})
        const decisionDetailSelect = component.find('SelectField[label="My decision detail"]')
        expect(decisionDetailSelect.props().value).toEqual('3_day')
      })

      it('passes the decisionDetail errors to the select field', () => {
        const component = renderScreeningDecisionForm({decision, decisionDetail, decisionDetailOptions})
        const decisionDetailSelect = component.find('SelectField[label="My decision detail"]')
        expect(decisionDetailSelect.props().errors).toEqual(['Errors are here!'])
      })

      it('passes whether or not decisionDetail is required to the select field', () => {
        const component = renderScreeningDecisionForm({decision, decisionDetail, decisionDetailOptions})
        const decisionDetailSelect = component.find('SelectField[label="My decision detail"]')
        expect(decisionDetailSelect.props().required).toEqual(false)
      })

      it('sets default props for the select field', () => {
        const component = renderScreeningDecisionForm({decision, decisionDetail, decisionDetailOptions})
        const decisionDetailSelect = component.find('SelectField[label="My decision detail"]')
        expect(decisionDetailSelect.props().id).toEqual('decision_detail')
      })

      it('calls the onBlur function when decisionDetail is blurred', () => {
        const onBlur = jasmine.createSpy('onBlur')
        const component = renderScreeningDecisionForm({decision, decisionDetail, decisionDetailOptions, onBlur})
        const decisionDetailSelect = component.find('SelectField[label="My decision detail"]')
        decisionDetailSelect.simulate('blur')
        expect(onBlur).toHaveBeenCalledWith('screening_decision_detail')
      })

      it('calls onChange when decisionDetail is changed', () => {
        const onChange = jasmine.createSpy('onChange')
        const component = renderScreeningDecisionForm({decision, decisionDetail, decisionDetailOptions, onChange})
        const decisionDetailSelect = component.find('SelectField[label="My decision detail"]')
        decisionDetailSelect.simulate('change', {target: {value: '10_day'}})
        expect(onChange).toHaveBeenCalledWith('screening_decision_detail', '10_day')
      })

      it('passes decisionDetailOptions as options to the select field', () => {
        const component = renderScreeningDecisionForm({decision, decisionDetail, decisionDetailOptions})
        const decisionDetailSelect = component.find('SelectField[label="My decision detail"]')
        const options = decisionDetailSelect.children()
        expect(options.at(0).props().value).toEqual(undefined) //empty first option
        expect(options.at(1).props().value).toEqual('3_day')
        expect(options.at(1).text()).toEqual('3 days')
        expect(options.at(2).props().value).toEqual('10_day')
        expect(options.at(2).text()).toEqual('10 days')
      })
    })
  })

  describe('additional information text area', () => {
    it('renders the additional information text area with the proper default props', () => {
      const component = renderScreeningDecisionForm({})
      const additionalInformationLabel = component.find('label[htmlFor="additional_information"]')
      expect(additionalInformationLabel.exists()).toEqual(true)
      const additionalInformationTextArea = component.find('textarea[id="additional_information"]')
      expect(additionalInformationTextArea.exists()).toEqual(true)
    })

    it('passes the current value to the additional information text area', () => {
      const additionalInformation = {value: 'My additional information about this screening!'}
      const component = renderScreeningDecisionForm({additionalInformation})
      const additionalInformationTextArea = component.find('textarea[id="additional_information"]')
      expect(additionalInformationTextArea.props().value).toEqual('My additional information about this screening!')
    })

    it('calls onChange when additional information is updated', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderScreeningDecisionForm({onChange})
      const additionalInformationTextArea = component.find('textarea[id="additional_information"]')
      additionalInformationTextArea.simulate('change', {target: {value: 'My new additional information'}})
      expect(onChange).toHaveBeenCalledWith('additional_information', 'My new additional information')
    })
  })

  describe('access restriction select field', () => {
    it('passes the accessRestriction value to the select field', () => {
      const accessRestriction = {value: 'sealed'}
      const component = renderScreeningDecisionForm({accessRestriction})
      const accessRestrictionSelect = component.find('SelectField[label="Access Restrictions"]')
      expect(accessRestrictionSelect.props().value).toEqual('sealed')
    })

    it('sets default props for the select field', () => {
      const component = renderScreeningDecisionForm({})
      const accessRestrictionSelect = component.find('SelectField[label="Access Restrictions"]')
      expect(accessRestrictionSelect.props().id).toEqual('access_restrictions')
      expect(accessRestrictionSelect.props().label).toEqual('Access Restrictions')
    })

    it('calls the onBlur function when accessRestriction is blurred', () => {
      const onBlur = jasmine.createSpy('onBlur')
      const component = renderScreeningDecisionForm({onBlur})
      const accessRestrictionSelect = component.find('SelectField[label="Access Restrictions"]')
      accessRestrictionSelect.simulate('blur')
      expect(onBlur).toHaveBeenCalledWith('access_restrictions')
    })

    it('calls onChange when accessRestriction is changed', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderScreeningDecisionForm({onChange})
      const accessRestrictionSelect = component.find('SelectField[label="Access Restrictions"]')
      accessRestrictionSelect.simulate('change', {target: {value: 'sealed'}})
      expect(onChange).toHaveBeenCalledWith('access_restrictions', 'sealed')
    })

    it('passes accessRestrictionOptions as options to the select field', () => {
      const accessRestrictionOptions = [
        {value: 'sealed', label: 'Sealed'},
        {value: 'sensitive', label: 'Sensitive'},
      ]
      const component = renderScreeningDecisionForm({accessRestrictionOptions})
      const decisionDetailSelect = component.find('SelectField[label="Access Restrictions"]')
      const options = decisionDetailSelect.children()
      expect(options.at(0).props().value).toEqual('sealed')
      expect(options.at(0).text()).toEqual('Sealed')
      expect(options.at(1).props().value).toEqual('sensitive')
      expect(options.at(1).text()).toEqual('Sensitive')
    })
  })

  describe('restriction rationale text area', () => {
    it('does not render if the accessRestriction value is empty', () => {
      const component = renderScreeningDecisionForm({})
      const restrictionRatinaleLabel = component.find('label[htmlFor="restrictions_rationale"]')
      expect(restrictionRatinaleLabel.exists()).toEqual(false)
      const restrictionRationaleTextArea = component.find('textarea[id="restrictions_rationale"]')
      expect(restrictionRationaleTextArea.exists()).toEqual(false)
    })

    it('renders the restriction rationale text area when access restriction is set', () => {
      const accessRestriction = {value: 'sealed'}
      const component = renderScreeningDecisionForm({accessRestriction})
      const restrictionRatinaleLabel = component.find('label[htmlFor="restrictions_rationale"]')
      expect(restrictionRatinaleLabel.exists()).toEqual(true)
      const restrictionRationaleTextArea = component.find('textarea[id="restrictions_rationale"]')
      expect(restrictionRationaleTextArea.exists()).toEqual(true)
    })

    it('renders the proper default props for restriction rationale', () => {
      const accessRestriction = {value: 'sealed'}
      const component = renderScreeningDecisionForm({accessRestriction})
      const restrictionRationaleTextArea = component.find('textarea[id="restrictions_rationale"]')
      expect(restrictionRationaleTextArea.props().id).toEqual('restrictions_rationale')
      expect(restrictionRationaleTextArea.props().maxLength).toEqual('255')
    })

    it('passes the current value to the restriction rationale text area', () => {
      const accessRestriction = {value: 'sealed'}
      const restrictionRationale = {value: 'My rationale for this restriction!'}
      const component = renderScreeningDecisionForm({accessRestriction, restrictionRationale})
      const restrictionRationaleTextArea = component.find('textarea[id="restrictions_rationale"]')
      expect(restrictionRationaleTextArea.props().value).toEqual('My rationale for this restriction!')
    })

    it('calls onChange when restriction rationale is updated', () => {
      const accessRestriction = {value: 'sealed'}
      const onChange = jasmine.createSpy(accessRestriction, 'onChange')
      const component = renderScreeningDecisionForm({accessRestriction, onChange})
      const restrictionRationaleTextArea = component.find('textarea[id="restrictions_rationale"]')
      restrictionRationaleTextArea.simulate('change', {target: {value: 'My new restriction rationale'}})
      expect(onChange).toHaveBeenCalledWith('restrictions_rationale', 'My new restriction rationale')
    })

    it('calls the onBlur function when restriction rationale is blurred', () => {
      const accessRestriction = {value: 'sealed'}
      const onBlur = jasmine.createSpy('onBlur')
      const component = renderScreeningDecisionForm({accessRestriction, onBlur})
      const restrictionRationaleTextArea = component.find('textarea[id="restrictions_rationale"]')
      restrictionRationaleTextArea.simulate('blur')
      expect(onBlur).toHaveBeenCalledWith('restrictions_rationale')
    })
  })
})
