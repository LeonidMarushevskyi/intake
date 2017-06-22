import Immutable from 'immutable'
import ScreeningInformationEditView from 'components/screenings/ScreeningInformationEditView'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('ScreeningInformationEditView', () => {
  let component

  const requiredProps = {
    errors: Immutable.Map(),
    onBlur: jasmine.createSpy(),
    onChange: jasmine.createSpy(),
    onCancel: jasmine.createSpy(),
    onSave: jasmine.createSpy(),
    onEdit: jasmine.createSpy(),
    screening: Immutable.fromJS({
      name: 'The Rocky Horror Picture Show',
      assignee: 'Michael Bluth',
      started_at: '2016-08-13T10:00:00.000Z',
      ended_at: '2016-08-22T11:00:00.000Z',
      communication_method: 'mail',
      participants: [],
    }),
  }

  describe('render', () => {
    beforeEach(() => {
      component = shallow(<ScreeningInformationEditView {...requiredProps} />)
    })

    it('renders the card header', () => {
      expect(component.find('#screening-information-card .card-header').text()).toEqual('Screening Information')
    })

    it('renders the input fields', () => {
      expect(component.find('InputField[label="Title/Name of Screening"]').props().value)
        .toEqual('The Rocky Horror Picture Show')
      expect(component.find('InputField[label="Assigned Social Worker"]').props().value)
        .toEqual('Michael Bluth')
      expect(component.find('DateField[label="Screening Start Date/Time"]').props().value)
        .toEqual('2016-08-13T10:00:00.000Z')
      expect(component.find('DateField[label="Screening End Date/Time"]').props().value)
        .toEqual('2016-08-22T11:00:00.000Z')
      expect(component.find('SelectField[label="Communication Method"]').props().value)
        .toEqual('mail')
    })

    it('renders the required input fields as required', () => {
      expect(component.find('InputField[label="Assigned Social Worker"]').props().required)
        .toEqual(true)
      expect(component.find('DateField[label="Screening Start Date/Time"]').props().required)
        .toEqual(true)
      expect(component.find('SelectField[label="Communication Method"]').props().required)
        .toEqual(true)
    })

    it('renders the save and cancel button', () => {
      expect(component.find('.btn.btn-primary').text()).toEqual('Save')
      expect(component.find('.btn.btn-default').text()).toEqual('Cancel')
    })
  })

  describe('onChange', () => {
    it('fires the call the onChange function when a field changes', () => {
      component = mount(<ScreeningInformationEditView {...requiredProps} />)
      const comMethodSelect = component.find('#screening-information-card select')
      comMethodSelect.simulate('change', {target: {value: 'fax'}})
      expect(requiredProps.onChange).toHaveBeenCalledWith(['communication_method'], 'fax')
    })
  })

  describe('onSave', () => {
    it('fires the onSave function when save clicks', () => {
      component = mount(<ScreeningInformationEditView {...requiredProps} />)
      component.find('.btn.btn-primary').simulate('click')
      expect(requiredProps.onSave).toHaveBeenCalled()
    })
  })

  describe('onBlur', () => {
    const blurSpy = jasmine.createSpy('onBlur')
    const props = {
      ...requiredProps,
      onBlur: blurSpy,
    }

    it('calls onBlur with assignee field gets out of focus', () => {
      component = mount(<ScreeningInformationEditView {...props} />)
      const assigneeField = component.find('#assignee')
      assigneeField.simulate('focus')
      assigneeField.simulate('blur')
      expect(blurSpy).toHaveBeenCalledWith('assignee', 'Michael Bluth')
    })

    it('calls onBlur when communication method field gets out of focus', () => {
      component = mount(<ScreeningInformationEditView {...props} />)
      const communicationField = component.find({id: 'communication_method'})
      expect(communicationField.props().onBlur).not.toEqual(undefined)
      communicationField.simulate('focus')
      communicationField.simulate('blur')
      expect(blurSpy).toHaveBeenCalledWith('communication_method', 'mail')
    })
  })

  describe('errors', () => {
    const props = {
      ...requiredProps,
      errors: Immutable.fromJS(
        {
          assignee: ['First error', 'Second error'],
          communication_method: ['Stick to the plan!', 'An error occured while displaying the previous error'],
        }),
    }

    it('passes the appropriate errors to the assignee input', () => {
      component = shallow(<ScreeningInformationEditView {...props} />)
      expect(component.find('InputField[id="assignee"]').props().errors.toJS()).toEqual(['First error', 'Second error'])
      expect(component.find('SelectField[id="communication_method"]').props().errors.toJS())
        .toEqual(['Stick to the plan!', 'An error occured while displaying the previous error'])
    })
  })
})
