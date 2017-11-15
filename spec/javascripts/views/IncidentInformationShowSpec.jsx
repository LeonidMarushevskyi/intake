import React from 'react'
import {shallow} from 'enzyme'
import IncidentInformationShow from 'views/IncidentInformationShow'

describe('IncidentInformationShow', () => {
  const renderIncidentInformationShow = ({errors = {}, address = {}, ...args}) => {
    const props = {errors, address, ...args}
    return shallow(<IncidentInformationShow {...props}/>)
  }

  it('renders the incident date', () => {
    const component = renderIncidentInformationShow({
      incidentDate: '2006-01-21',
    })
    expect(component.find('ShowField[label="Incident Date"]').html())
      .toContain('2006-01-21')
  })

  it('renders the street address', () => {
    const component = renderIncidentInformationShow({
      address: {
        streetAddress: '1500 7th St',
      },
    })
    expect(component.find('ShowField[label="Address"]').html())
      .toContain('1500 7th St')
  })

  it('renders the city', () => {
    const component = renderIncidentInformationShow({
      address: {
        city: 'Sacramento',
      },
    })
    expect(component.find('ShowField[label="City"]').html())
      .toContain('Sacramento')
  })

  it('renders the incident county', () => {
    const component = renderIncidentInformationShow({
      incidentCounty: 'alpine',
    })
    expect(component.find('ShowField[label="Incident County"]').html())
      .toContain('alpine')
  })

  it('renders the state', () => {
    const component = renderIncidentInformationShow({
      address: {
        state: 'CA',
      },
    })
    expect(component.find('ShowField[label="State"]').html())
      .toContain('CA')
  })

  it('renders the zip', () => {
    const component = renderIncidentInformationShow({
      address: {
        zip: '95814',
      },
    })
    expect(component.find('ShowField[label="Zip"]').html())
      .toContain('95814')
  })

  it('renders the location type', () => {
    const component = renderIncidentInformationShow({
      locationType: 'Juvenile Detention',
    })
    expect(component.find('ShowField[label="Location Type"]').html())
      .toContain('Juvenile Detention')
  })
})
