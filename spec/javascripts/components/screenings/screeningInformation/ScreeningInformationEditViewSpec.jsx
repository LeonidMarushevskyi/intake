import Immutable from 'immutable'
import ScreeningInformationEditView from 'components/screenings/ScreeningInformationEditView'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('ScreeningInformationEditView', () => {
  let component

  const requiredProps = {
    errors: Immutable.Map(),
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

  beforeEach(() => {
    requiredProps.validateOneField = jasmine.createSpy()
    requiredProps.validateOnChange = jasmine.createSpy('validateOnChange')
  })

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

  describe('validateOnChange', () => {
    it('fires the call the validateOnChange function when a field changes', () => {
      const comMethodSelect = component.find('#screening-information-card select')
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
      component = mount(<ScreeningInformationEditView {...requiredProps} />)
      component.find('.btn.btn-primary').simulate('click')
      expect(requiredProps.onSave).toHaveBeenCalled()
    })
  })

  describe('validate when errors are present', () => {
    let validateOnChangeSpy
    let validateOneFieldSpy

    beforeEach(() => {
      validateOnChangeSpy = jasmine.createSpy('validateOnChange')
      validateOneFieldSpy = jasmine.createSpy('validateOneField')
      const props = {
        ...requiredProps,
        validateOnChange: validateOnChangeSpy,
        validateOneField: validateOneFieldSpy,
        errors: Immutable.fromJS({
          assignee: ['First error', 'Second error'],
          communication_method: ['Stick to the plan!', 'An error occured while displaying the previous error'],
          started_at: ['My error', 'My other error'],
          ended_at: ['More errors'],
          name: [],
        }),
      }

      component = shallow(<ScreeningInformationEditView {...props} />)
    })

    describe('when a required field loses focus', () => {
      it('calls validateOneField for the social worker with the field name and value', () => {
        const socialWorker = requiredProps.screening.get('assignee')
        const assigneeField = component.find('InputField[label="Assigned Social Worker"]')
        assigneeField.props().onBlur({target: {value: socialWorker}})
        expect(validateOneFieldSpy).toHaveBeenCalledWith('assignee', socialWorker)
      })

      it('calls validateOneField for the start date with the field name and value', () => {
        const dateValue = requiredProps.screening.get('started_at')
        const startDate = component.find('DateField[label="Screening Start Date/Time"]')
        startDate.props().onBlur(dateValue)
        expect(validateOneFieldSpy).toHaveBeenCalledWith('started_at', dateValue)
      })

      it('calls validateOneField for the communication method with the field name and value', () => {
        const commMethodValue = requiredProps.screening.get('communication_method')
        const commMethodField = component.find('SelectField[label="Communication Method"]')
        commMethodField.props().onBlur({target: {value: commMethodValue}})
        expect(validateOneFieldSpy).toHaveBeenCalledWith('communication_method', commMethodValue)
      })

      it('calls validateOneField for the end date with the field name and value', () => {
        const dateValue = requiredProps.screening.get('ended_at')
        const endDate = component.find('DateField[label="Screening End Date/Time"]')
        endDate.props().onBlur(dateValue)
        expect(validateOneFieldSpy).toHaveBeenCalledWith('ended_at', dateValue)
      })
    })

    describe('when a field gets changed', () => {
      it('calls validateOneField for the social worker with the field name and value', () => {
        const socialWorker = requiredProps.screening.get('assignee')
        const assigneeField = component.find('InputField[label="Assigned Social Worker"]')
        assigneeField.props().onChange({target: {value: socialWorker}})
        expect(validateOnChangeSpy).toHaveBeenCalledWith('assignee', socialWorker)
      })

      it('calls validateOneField for the start date with the field name and value', () => {
        const dateValue = requiredProps.screening.get('started_at')
        const startDate = component.find('DateField[label="Screening Start Date/Time"]')
        startDate.props().onChange(dateValue)
        expect(validateOnChangeSpy).toHaveBeenCalledWith('started_at', dateValue)
      })

      it('calls validateOneField for the communication method with the field name and value', () => {
        const commMethodValue = requiredProps.screening.get('communication_method')
        const commMethodField = component.find('SelectField[label="Communication Method"]')
        commMethodField.props().onChange({target: {value: commMethodValue}})
        expect(validateOnChangeSpy).toHaveBeenCalledWith('communication_method', commMethodValue)
      })

      it('calls validateOneField for the end date with the field name and value', () => {
        const dateValue = requiredProps.screening.get('ended_at')
        const endDate = component.find('DateField[label="Screening End Date/Time"]')
        endDate.props().onChange(dateValue)
        expect(validateOnChangeSpy).toHaveBeenCalledWith('ended_at', dateValue)
      })
    })
  })

  describe('validate when no errors are present', () => {
    let validateOneFieldSpy
    let validateOnChangeSpy

    beforeEach(() => {
      validateOneFieldSpy = jasmine.createSpy('validateOneField')
      validateOnChangeSpy = jasmine.createSpy('validateOnChange')
      const props = {
        ...requiredProps,
        validateOneField: validateOneFieldSpy,
        validateOnChange: validateOnChangeSpy,
        errors: Immutable.fromJS({
          assignee: [],
          communication_method: [],
          started_at: [],
          ended_at: [],
          name: [],
        }),
      }

      component = shallow(<ScreeningInformationEditView {...props} />)
    })

    describe('when a required field loses focus', () => {
      it('calls validateOneField for the social worker with the field name and value', () => {
        const socialWorker = requiredProps.screening.get('assignee')
        const assigneeField = component.find('InputField[label="Assigned Social Worker"]')
        assigneeField.props().onBlur({target: {value: socialWorker}})
        expect(validateOneFieldSpy).toHaveBeenCalledWith('assignee', socialWorker)
      })
    })
  })

  describe('errors', () => {
    const props = {
      ...requiredProps,
      errors: Immutable.fromJS({
        assignee: ['First error', 'Second error'],
        communication_method: ['Stick to the plan!', 'An error occured while displaying the previous error'],
        started_at: ['My error', 'My other error'],
        ended_at: ['More errors'],
        name: [],
      }),
    }

    it('passes the appropriate errors to the fields', () => {
      component = shallow(<ScreeningInformationEditView {...props} />)
      expect(component.find('InputField[id="assignee"]').props().errors.toJS())
        .toEqual(['First error', 'Second error'])
      expect(component.find('SelectField[id="communication_method"]').props().errors.toJS())
        .toEqual(['Stick to the plan!', 'An error occured while displaying the previous error'])
      expect(component.find('DateField[label="Screening Start Date/Time"]').props().errors.toJS())
        .toEqual(['My error', 'My other error'])
      expect(component.find('DateField[label="Screening End Date/Time"]').props().errors.toJS())
        .toEqual(['More errors'])
    })
  })
})
