import Immutable from 'immutable'
import InformationEditView from 'components/screenings/InformationEditView'
import React from 'react'
import {shallow} from 'enzyme'

describe('InformationEditView', () => {
  let component
  let onChange
  beforeEach(() => {
    onChange = jasmine.createSpy()
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

  it('render the labels', () => {
    const labels = component.find('#screening-information-card label')
    expect(labels.length).toEqual(4)
    expect(labels.map((element) => element.text())).toEqual([
      'Title/Name of Screening',
      'Screening Start Date/Time',
      'Screening End Date/Time',
      'Communication Method',
    ])
  })

  it('render the fields', () => {
    const inputs = component.find('#screening-information-card input')
    expect(inputs.length).toEqual(3)
    expect(inputs.map((element) => element.props().value)).toEqual([
      'The Rocky Horror Picture Show',
      '2016-08-13T10:00:00.000Z',
      '2016-08-22T11:00:00.000Z',
    ])
    expect(component.find('#screening-information-card select').props().value).toEqual('mail')
  })

  it('fires the call the onChange function when a field changes', () => {
    component.find('#screening-information-card select').simulate('change', {target: { value: 'fax'}})
    expect(onChange).toHaveBeenCalledWith([ 'communication_method' ], 'fax')
  })
})
