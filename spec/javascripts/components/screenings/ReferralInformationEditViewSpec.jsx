import Immutable from 'immutable'
import React from 'react'
import ReferralInformationEditView from 'components/screenings/ReferralInformationEditView'
import {shallow} from 'enzyme'

describe('ReferralInformationEditView', () => {
  let component
  let onChange
  beforeEach(() => {
    onChange = jasmine.createSpy()
    component = shallow(<ReferralInformationEditView screening={Immutable.fromJS({})} onChange={onChange} />)
  })

  it('renders the card header', () => {
    expect(component.find('.card-header').text()).toEqual('Referral Information')
  })

  it('render the labels', () => {
    expect(component.find('label').length).toEqual(9)
    expect(component.find('label').map((element) => element.text())).toEqual([
      'Incident Date',
      'Incident County',
      'Address',
      'City',
      'State',
      'Zip',
      'Location Type',
      'Response Time',
      'Screening Decision',
    ])
  })

  it('renders the fields', () => {
    const screening = Immutable.fromJS({
     incident_date: '2006-01-21',
      incident_county: 'alpine',
      address: Immutable.fromJS({
        id: '2',
        street_address: '1500 7th St',
        city: 'Sacramento',
        state: 'CA',
        zip: 95814,
      }),
      location_type: 'Juvenile Detention',
      response_time: 'within_twenty_four_hours',
      screening_decision: 'accept_for_investigation',
    })
    component = shallow(<ReferralInformationEditView screening={screening} onChange={onChange} />)

    const inputs = component.find('#referral-information-card input')
    expect(inputs.length).toEqual(5)
    expect(inputs.map((element) => element.props().value)).toEqual([
      '2006-01-21',
      '2',
      '1500 7th St',
      'Sacramento',
       95814,
    ])
    const selects = component.find('#referral-information-card select')
    expect(selects.length).toEqual(5)
    expect(selects.map((element) => element.props().value)).toEqual([
      'alpine',
      'CA',
      'Juvenile Detention',
      'within_twenty_four_hours',
      'accept_for_investigation',
    ])
  })

  it('fires the onChange call when a field changes', () => {
    component.find('#incident_date').simulate('change', {target: {value: '01/21/2006'}})
    expect(onChange).toHaveBeenCalledWith(['incident_date'], '01/21/2006')
  })
})
