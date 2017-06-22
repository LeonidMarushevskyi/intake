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
    let blurSpy

    beforeEach(() => {
      blurSpy = jasmine.createSpy('onBlur')
      const props = {
        ...requiredProps,
        onBlur: blurSpy,
      }

      component = shallow(<ScreeningInformationEditView {...props} />)
    })

    it('calls onBlur for the social worker with the field name and value', () => {
      const socialWorker = requiredProps.screening.get('assignee')
      const assigneeField = component.find('InputField[label="Assigned Social Worker"]')
      assigneeField.props().onBlur({target: {value: socialWorker}})
      expect(blurSpy).toHaveBeenCalledWith('assignee', socialWorker)
    })

    it('calls onBlur for the start date with the field name and value', () => {
      const dateValue = requiredProps.screening.get('started_at')
      const startDate = component.find('DateField[label="Screening Start Date/Time"]')
      startDate.props().onBlur(dateValue)
      expect(blurSpy).toHaveBeenCalledWith('started_at', dateValue)
    })

    it('calls onBlur for the communication method with the field name and value', () => {
      const commMethodValue = requiredProps.screening.get('communication_method')
      const commMethodField = component.find('SelectField[label="Communication Method"]')
      commMethodField.props().onBlur({target: {value: commMethodValue}})
      expect(blurSpy).toHaveBeenCalledWith('communication_method', commMethodValue)
    })
  })

  describe('errors', () => {
    const props = {
      ...requiredProps,
      errors: Immutable.fromJS(
        {
          assignee: ['First error', 'Second error'],
          communication_method: ['Stick to the plan!', 'An error occured while displaying the previous error'],
          started_at: ['My error', 'My other error'],
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
    })
  })
})
