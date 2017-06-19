import Immutable from 'immutable'
import ScreeningInformationEditView from 'components/screenings/ScreeningInformationEditView'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('ScreeningInformationEditView', () => {
  let component

  const requiredProps = {
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
})
