import React from 'react'
import Immutable from 'immutable'
import InformationShowView from 'components/screenings/InformationShowView'
import {shallow} from 'enzyme'

describe('InformationShowView', () => {
  let component
  beforeEach(() => {
    const props = {params: {id: 1}}
    component = shallow(<InformationShowView screening={Immutable.Map({})} />)
  })

  it('render the card headers', () => {
    expect(component.find('.card-header').text()).toEqual('Screening Information')
  })

  it('renders the screening information label fields', () => {
    const labels = component.find('#screening-information-card label')

    expect(labels.length).toEqual(4)
    expect(labels.map((element) => element.text())).toEqual([
      'Title/Name of Screening',
      'Screening Start Date/Time',
      'Screening End Date/Time',
      'Communication Method',
    ])
  })

  it('renders the screening value fields', () => {
    const screening = Immutable.fromJS({
      name: 'The Rocky Horror Picture Show',
      started_at: '2016-08-13T10:00:00.000Z',
      ended_at: '2016-08-22T11:00:00.000Z',
      communication_method: 'mail',
    })
    component = shallow(<InformationShowView screening={screening} />)
    const values = component.find('#screening-information-card .c-gray')

    expect(values.length).toEqual(4)
    expect(values.map((element) => element.text())).toEqual([
      'The Rocky Horror Picture Show',
      '08/13/2016 10:00 AM',
      '08/22/2016 11:00 AM',
      'Mail',
    ])
  })

  it('displays information correctly when they are null', () => {
    const screening = Immutable.fromJS({
      name: null,
      started_at: null,
      ended_at: null,
      communication_method: null,
    })

    component = shallow(<InformationShowView screening={screening} />)
    expect(component.find('#screening-information-card .c-gray')
      .map((element) => element.text())).toEqual(['', '', '', ''])
  })
})
