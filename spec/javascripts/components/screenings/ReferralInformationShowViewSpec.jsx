import Immutable from 'immutable'
import React from 'react'
import ReferralInformationShowView from 'components/screenings/ReferralInformationShowView'
import {shallow} from 'enzyme'

describe('ReferralInformationShowView', () => {
  let component

  beforeEach(() => {
    component = shallow(<ReferralInformationShowView screening={Immutable.fromJS({})} />)
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

  it('render the values', () => {
    const screening = Immutable.fromJS({
      incident_date: '2006-01-21',
      incident_county: 'alpine',
      address: {
        street_address: '1500 7th St',
        city: 'Sacramento',
        state: 'CA',
        zip: 95814,
      },
      location_type: 'Juvenile Detention',
      response_time: 'within_twenty_four_hours',
      screening_decision: 'accept_for_investigation',
    })

    component = shallow(<ReferralInformationShowView screening={screening} />)
    const values = component.find('.c-gray')

    expect(values.length).toEqual(9)
    expect(values.map((element) => element.text())).toEqual([
      '01/21/2006',
      'Alpine',
      '1500 7th St',
      'Sacramento',
      'California',
      '95814',
      'Juvenile Detention',
      'Within 24 hours',
      'Accept for Investigation',
    ])
  })

  it('renders correctly when values are not set', () => {
    const screening = Immutable.fromJS({
      incident_date: null,
      incident_county: null,
      address: {
        street_address: null,
        city: null,
        state: null,
        zip: null,
      },
      location_type: null,
      response_time: null,
      screening_decision: null,
    })
    component = shallow(<ReferralInformationShowView screening={screening} />)
    const values = component.find('.c-gray')
    expect(values.map((element) => element.text())).toEqual(['', '', '', '', '', '', '', '', ''])
  })
})
