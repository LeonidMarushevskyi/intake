import Immutable from 'immutable'
import ScreeningInformationEditView from 'screenings/ScreeningInformationEditView'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('ScreeningInformationEditView', () => {
  let component

  const requiredProps = {
    errors: {},
    screening: Immutable.fromJS({
      name: 'The Rocky Horror Picture Show',
      assignee: 'Michael Bluth',
      started_at: '2016-08-13T10:00:00.000Z',
      ended_at: '2016-08-22T11:00:00.000Z',
      communication_method: 'mail',
      participants: [],
    }),
  }

  beforeEach(() => {
    requiredProps.validateField = jasmine.createSpy('validateField')
    requiredProps.validateOnChange = jasmine.createSpy('validateOnChange')
    requiredProps.onChange = jasmine.createSpy('onChange')
    requiredProps.onCancel = jasmine.createSpy('onCancel')
    requiredProps.onSave = jasmine.createSpy('onSave')
    requiredProps.onEdit = jasmine.createSpy('onEdit')
    component = mount(<ScreeningInformationEditView {...requiredProps} />)
  })

  describe('render', () => {
    beforeEach(() => {
      component = shallow(<ScreeningInformationEditView {...requiredProps} />)
    })

    it('renders the name of screening field', () => {
      const titleField = component.find('InputField[label="Title/Name of Screening"]')
      expect(titleField.props().value).toEqual('The Rocky Horror Picture Show')
      expect(titleField.props().maxLength).toEqual('64')
      // Allows alpha, space, hyphen, and apostrophe
      expect(titleField.props().allowCharacters).toEqual(/[a-zA-Z\s'’-]/)
    })

    it('renders the assigned social worker field', () => {
      const assigneeField = component.find('InputField[label="Assigned Social Worker"]')
      expect(assigneeField.props().value).toEqual('Michael Bluth')
      expect(assigneeField.props().maxLength).toEqual('64')
      // Allows alpha and space
      expect(assigneeField.props().allowCharacters).toEqual(/[a-zA-Z\s]/)
    })

    it('renders the screening start time field', () => {
      expect(component.find('DateField[label="Screening Start Date/Time"]').props().value)
        .toEqual('2016-08-13T10:00:00.000Z')
    })

    it('renders the screening end time field', () => {
      expect(component.find('DateField[label="Screening End Date/Time"]').props().value)
        .toEqual('2016-08-22T11:00:00.000Z')
    })

    it('renders the communication method', () => {
      expect(component.find('SelectField[label="Communication Method"]').props().value)
        .toEqual('mail')
    })

    it('does not disable assigned social worker if no assignee_staff_id', () => {
      expect(component.find('InputField[label="Assigned Social Worker"]').props().disabled)
        .toBeFalsy()
    })

    it('disables assigned social worker if has assignee_staff_id', () => {
      component = shallow(<ScreeningInformationEditView {...requiredProps} screening={Immutable.fromJS({assignee: 'Michael Bluth', assignee_staff_id: '123'})} />)
      expect(component.find('InputField[label="Assigned Social Worker"]').props().disabled)
        .toEqual(true)
    })

    it('renders the required input fields as required', () => {
      expect(component.find('InputField[label="Assigned Social Worker"]').props().required)
        .toEqual(true)
      expect(component.find('DateField[label="Screening Start Date/Time"]').props().required)
        .toEqual(true)
      expect(component.find('SelectField[label="Communication Method"]').props().required)
        .toEqual(true)
    })

    it('Has the proper options for comunication method', () => {
      const commMethodOptions = [
        {position: 1, selectValue: 'email', displayText: 'Email'},
        {position: 2, selectValue: 'fax', displayText: 'Fax'},
        {position: 3, selectValue: 'in_person', displayText: 'In Person'},
        {position: 4, selectValue: 'mail', displayText: 'Mail'},
        {position: 5, selectValue: 'phone', displayText: 'Phone'},
      ]
      const commMethod = component.find('SelectField[label="Communication Method"]')
      commMethodOptions.forEach((option) => {
        const relevantOption = commMethod.children().at(option.position)
        expect(relevantOption.props().value).toEqual(option.selectValue)
        expect(relevantOption.text()).toEqual(option.displayText)
      })
    })

    it('renders the save and cancel button', () => {
      expect(component.find('.btn.btn-primary').text()).toEqual('Save')
      expect(component.find('.btn.btn-default').text()).toEqual('Cancel')
    })
  })

  describe('validateOnChange', () => {
    it('fires the call the validateOnChange function when a field changes', () => {
      const comMethodSelect = component.find('select')
      comMethodSelect.simulate('change', {target: {value: 'fax'}})
      expect(requiredProps.validateOnChange).toHaveBeenCalledWith('communication_method', 'fax')
    })
  })

  describe('onChange', () => {
    it('fires the call the onChange function when a field changes', () => {
      const nameInput = component.find('input#name')
      nameInput.simulate('change', {target: {value: 'do not validate me'}})
      expect(requiredProps.onChange).toHaveBeenCalledWith(['name'], 'do not validate me')
    })
  })

  describe('onSave', () => {
    it('fires the onSave function when save clicks', () => {
      component.find('.btn.btn-primary').simulate('click')
      expect(requiredProps.onSave).toHaveBeenCalled()
    })
  })

  describe('when a required field loses focus', () => {
    let validateFieldSpy

    beforeEach(() => {
      validateFieldSpy = jasmine.createSpy('validateField')
      const props = {
        ...requiredProps,
        validateField: validateFieldSpy,
        errors: {
          assignee: ['First error', 'Second error'],
          communication_method: ['Stick to the plan!', 'An error occured while displaying the previous error'],
          started_at: ['My error', 'My other error'],
          ended_at: ['More errors'],
          name: [],
        },
      }
      component = shallow(<ScreeningInformationEditView {...props} />)
    })

    it('calls validateField for the social worker with the field name and value', () => {
      const socialWorker = requiredProps.screening.get('assignee')
      const assigneeField = component.find('InputField[label="Assigned Social Worker"]')
      assigneeField.props().onBlur({target: {value: socialWorker}})
      expect(validateFieldSpy).toHaveBeenCalledWith('assignee', socialWorker)
    })

    it('calls validateField for the start date with the field name and value', () => {
      const dateValue = requiredProps.screening.get('started_at')
      const startDate = component.find('DateField[label="Screening Start Date/Time"]')
      startDate.props().onBlur(dateValue)
      expect(validateFieldSpy).toHaveBeenCalledWith('started_at', dateValue)
    })

    it('calls validateField for the communication method with the field name and value', () => {
      const commMethodValue = requiredProps.screening.get('communication_method')
      const commMethodField = component.find('SelectField[label="Communication Method"]')
      commMethodField.props().onBlur({target: {value: commMethodValue}})
      expect(validateFieldSpy).toHaveBeenCalledWith('communication_method', commMethodValue)
    })

    it('calls validateField for the end date with the field name and value', () => {
      const dateValue = requiredProps.screening.get('ended_at')
      const endDate = component.find('DateField[label="Screening End Date/Time"]')
      endDate.props().onBlur(dateValue)
      expect(validateFieldSpy).toHaveBeenCalledWith('ended_at', dateValue)
    })
  })

  describe('when a required field gets changed', () => {
    let validateOnChangeSpy

    beforeEach(() => {
      validateOnChangeSpy = jasmine.createSpy('validateOnChange')
      const props = {
        ...requiredProps,
        validateOnChange: validateOnChangeSpy,
        errors: {
          assignee: ['First error', 'Second error'],
          communication_method: ['Stick to the plan!', 'An error occured while displaying the previous error'],
          started_at: ['My error', 'My other error'],
          ended_at: ['More errors'],
          name: [],
        },
      }
      component = shallow(<ScreeningInformationEditView {...props} />)
    })

    it('calls validateField for the social worker with the field name and value', () => {
      const socialWorker = requiredProps.screening.get('assignee')
      const assigneeField = component.find('InputField[label="Assigned Social Worker"]')
      assigneeField.props().onChange({target: {value: socialWorker}})
      expect(validateOnChangeSpy).toHaveBeenCalledWith('assignee', socialWorker)
    })

    it('calls validateField for the start date with the field name and value', () => {
      const dateValue = requiredProps.screening.get('started_at')
      const startDate = component.find('DateField[label="Screening Start Date/Time"]')
      startDate.props().onChange(dateValue)
      expect(validateOnChangeSpy).toHaveBeenCalledWith('started_at', dateValue)
    })

    it('calls validateField for the communication method with the field name and value', () => {
      const commMethodValue = requiredProps.screening.get('communication_method')
      const commMethodField = component.find('SelectField[label="Communication Method"]')
      commMethodField.props().onChange({target: {value: commMethodValue}})
      expect(validateOnChangeSpy).toHaveBeenCalledWith('communication_method', commMethodValue)
    })

    it('calls validateField for the end date with the field name and value', () => {
      const dateValue = requiredProps.screening.get('ended_at')
      const endDate = component.find('DateField[label="Screening End Date/Time"]')
      endDate.props().onChange(dateValue)
      expect(validateOnChangeSpy).toHaveBeenCalledWith('ended_at', dateValue)
    })
  })

  describe('errors', () => {
    it('passes the appropriate errors to the fields', () => {
      const props = {
        ...requiredProps,
        errors: {
          assignee: ['First error', 'Second error'],
          communication_method: ['Stick to the plan!', 'An error occured while displaying the previous error'],
          started_at: ['My error', 'My other error'],
          ended_at: ['More errors'],
          name: [],
        },
      }
      component = shallow(<ScreeningInformationEditView {...props} />)
      expect(component.find('InputField[id="assignee"]').props().errors)
        .toEqual(['First error', 'Second error'])
      expect(component.find('SelectField[id="communication_method"]').props().errors)
        .toEqual(['Stick to the plan!', 'An error occured while displaying the previous error'])
      expect(component.find('DateField[label="Screening Start Date/Time"]').props().errors)
        .toEqual(['My error', 'My other error'])
      expect(component.find('DateField[label="Screening End Date/Time"]').props().errors)
        .toEqual(['More errors'])
    })
  })
})
