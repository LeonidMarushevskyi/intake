import Immutable from 'immutable'
import InformationEditView from 'components/screenings/InformationEditView'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('InformationEditView', () => {
  let component
  describe('render', () => {
    beforeEach(() => {
      const onChange = () => null
      const screening = Immutable.fromJS({
        name: 'The Rocky Horror Picture Show',
        started_at: '2016-08-13T10:00:00.000Z',
        ended_at: '2016-08-22T11:00:00.000Z',
        communication_method: 'mail',
        participants: [],
      })
      component = shallow(<InformationEditView screening={screening} onChange={onChange} />)
    })

    it('renders the card header', () => {
      expect(component.find('#screening-information-card .card-header').text()).toEqual('Screening Information')
    })

    it('renders the input fields', () => {
      expect(component.find('InputField[label="Title/Name of Screening"]').props().value)
        .toEqual('The Rocky Horror Picture Show')
      expect(component.find('DateField[label="Screening Start Date/Time"]').props().value)
        .toEqual('2016-08-13T10:00:00.000Z')
      expect(component.find('DateField[label="Screening End Date/Time"]').props().value)
        .toEqual('2016-08-22T11:00:00.000Z')
      expect(component.find('SelectField[label="Communication Method"]').props().value)
        .toEqual('mail')
    })
  })

  describe('onChange', () => {
    let onChange
    beforeEach(() => {
      onChange = jasmine.createSpy('onChange')
      const screening = Immutable.Map()
      component = mount(<InformationEditView screening={screening} onChange={onChange} />)
    })

    it('fires the call the onChange function when a field changes', () => {
      const comMethodSelect = component.find('#screening-information-card select')
      comMethodSelect.simulate('change', {target: {value: 'fax'}})
      expect(onChange).toHaveBeenCalledWith(['communication_method'], 'fax')
    })
  })
})
