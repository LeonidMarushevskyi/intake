import React from 'react'
import ScreeningInformationShow from 'screenings/screeningInformation/ScreeningInformationShow'
import {shallow} from 'enzyme'

describe('ScreeningInformationShow', () => {
  function renderScreeningInformationShow({
    name,
    assignee,
    communication_method,
    started_at,
    ended_at,
    errors = {},
  }) {
    const props = {name, assignee, communication_method, started_at, ended_at, errors}
    return shallow(<ScreeningInformationShow {...props} />)
  }

  it('renders errors for the Assigned Social Worker', () => {
    const socialWorker = renderScreeningInformationShow({
      errors: {assignee: ['Error 1', 'Error 2']},
    }).find('ShowField[label="Assigned Social Worker"]')
    expect(socialWorker.html()).toContain('Error 1')
    expect(socialWorker.html()).toContain('Error 2')
  })

  it('renders errors for the Start Date/Time', () => {
    const startDate = renderScreeningInformationShow({
      errors: {started_at: ['Error 3', 'Error 4']},
    }).find('ShowField[label="Screening Start Date/Time"]')
    expect(startDate.html()).toContain('Error 3')
    expect(startDate.html()).toContain('Error 4')
  })

  it('renders errors for Communication Method', () => {
    const commMethod = renderScreeningInformationShow({
      errors: {communication_method: ['My Spider-Sense is tingling.']},
    }).find('ShowField[label="Communication Method"]')
    expect(commMethod.html()).toContain('My Spider-Sense is tingling.')
  })

  it('renders errors for the End Date/Time', () => {
    const endDate = renderScreeningInformationShow({
      errors: {ended_at: ['Never give up', 'Never surrender']},
    }).find('ShowField[label="Screening End Date/Time"]')
    expect(endDate.html()).toContain('Never give up')
    expect(endDate.html()).toContain('Never surrender')
  })

  it('renders name of screening', () => {
    const screeningName = renderScreeningInformationShow({
      name: 'a sample screening name',
    }).find('ShowField[label="Title/Name of Screening"]')
    expect(screeningName.html()).toContain('a sample screening name')
  })

  it('renders the screening start date/time', () => {
    const startDate = renderScreeningInformationShow({
      started_at: '08/13/2016 3:00 AM',
    }).find('ShowField[label="Screening Start Date/Time"]')
    expect(startDate.props().required).toEqual(true)
    expect(startDate.html()).toContain('08/13/2016 3:00 AM')
  })

  it('renders the screening end date/time', () => {
    const endDate = renderScreeningInformationShow({
      ended_at: '08/22/2016 4:00 AM',
    }).find('ShowField[label="Screening End Date/Time"]')
    expect(endDate.html()).toContain('08/22/2016 4:00 AM')
  })

  it('renders the communication method', () => {
    const comMethod = renderScreeningInformationShow({
      communication_method: 'Mail',
    }).find('ShowField[label="Communication Method"]')
    expect(comMethod.props().required).toEqual(true)
    expect(comMethod.html()).toContain('Mail')
  })

  it('renders Assigned Social Worker', () => {
    const socialWorker = renderScreeningInformationShow({
      assignee: 'a sample assignee',
    }).find('ShowField[label="Assigned Social Worker"]')
    expect(socialWorker.props().required).toEqual(true)
    expect(socialWorker.html()).toContain('a sample assignee')
  })
})
