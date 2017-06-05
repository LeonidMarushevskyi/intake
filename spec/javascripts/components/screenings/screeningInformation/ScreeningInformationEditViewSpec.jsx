import Immutable from 'immutable'
import ScreeningInformationEditView from 'components/screenings/ScreeningInformationEditView'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('ScreeningInformationEditView', () => {
  let component
  describe('render', () => {
    beforeEach(() => {
      const props = {
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
      component = shallow(<ScreeningInformationEditView {...props} />)
    })

    it('renders the card header', () => {
      expect(component.find('#screening-information-card .card-header').text()).toEqual('Screening Information')
    })

    it('renders the input fields', () => {
      expect(component.find('InputField[label="Title/Name of Screening"]').props().value)
        .toEqual('The Rocky Horror Picture Show')
      expect(component.find('InputField[label="Assigned Social Worker"]').props().value)
        .toEqual('Michael Bluth')
      expect(component.find('InputField[label="Assigned Social Worker"]').props().required)
        .toEqual(true)
      expect(component.find('DateField[label="Screening Start Date/Time"]').props().value)
        .toEqual('2016-08-13T10:00:00.000Z')
      expect(component.find('DateField[label="Screening End Date/Time"]').props().value)
        .toEqual('2016-08-22T11:00:00.000Z')
      expect(component.find('SelectField[label="Communication Method"]').props().value)
        .toEqual('mail')
    })

    it('renders the save and cancel button', () => {
      expect(component.find('.btn.btn-primary').text()).toEqual('Save')
      expect(component.find('.btn.btn-default').text()).toEqual('Cancel')
    })
  })

  describe('onChange', () => {
    let props
    beforeEach(() => {
      props = {
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
      component = mount(<ScreeningInformationEditView {...props} />)
    })

    it('fires the call the onChange function when a field changes', () => {
      const comMethodSelect = component.find('#screening-information-card select')
      comMethodSelect.simulate('change', {target: {value: 'fax'}})
      expect(props.onChange).toHaveBeenCalledWith(['communication_method'], 'fax')
    })
  })

  describe('onSave', () => {
    let props
    beforeEach(() => {
      props = {
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
      component = mount(<ScreeningInformationEditView {...props} />)
    })

    it('fires the onSave function when save clicks', () => {
      component.find('.btn.btn-primary').simulate('click')
      expect(props.onSave).toHaveBeenCalled()
    })
  })
})
