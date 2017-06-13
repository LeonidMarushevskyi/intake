import * as Immutable from 'immutable'
import HistoryCardReferral from 'components/screenings/HistoryCardReferral'
import React from 'react'
import {shallow} from 'enzyme'

describe('HistoryCardReferral', () => {
  it('renders css id with the referral id', () => {
    const referral = Immutable.fromJS({id: 'ABC123'})
    const component = shallow(<HistoryCardReferral referral={referral} index={1} />)
    expect(component.find('tr#referral-ABC123').exists()).toEqual(true)
  })

  it('renders No Date when neither start nor end date is present', () => {
    const referral = Immutable.fromJS({})
    const component = shallow(<HistoryCardReferral referral={referral} index={1} />)
    const cells = component.find('tr > td')
    expect(cells.at(0).text()).toEqual('No Date')
  })

  it('renders the referral start date', () => {
    const referral = Immutable.fromJS({
      start_date: '2016-08-13',
    })

    const component = shallow(<HistoryCardReferral referral={referral} index={1} />)
    const cells = component.find('tr > td')
    expect(cells.at(0).text()).toEqual('08/13/2016')
  })

  it('renders the referral end date', () => {
    const referral = Immutable.fromJS({
      end_date: '2016-09-23',
    })

    const component = shallow(<HistoryCardReferral referral={referral} index={1} />)
    const cells = component.find('tr > td')
    expect(cells.at(0).text()).toEqual('09/23/2016')
  })

  it('renders a date range when both start and end dates are present', () => {
    const referral = Immutable.fromJS({
      start_date: '2016-08-13',
      end_date: '2016-09-23',
    })

    const component = shallow(<HistoryCardReferral referral={referral} index={1} />)
    const cells = component.find('tr > td')
    expect(cells.at(0).text()).toEqual('08/13/2016 - 09/23/2016')
  })

  it('renders the referral status as In Progress when there is no end_date', () => {
    const referral = Immutable.fromJS({
      start_date: '2016-08-13',
    })

    const component = shallow(<HistoryCardReferral referral={referral} index={1} />)
    const cells = component.find('tr > td')
    expect(cells.at(1).text()).toEqual('Referral(Open)')
  })

  it('renders the referral status as Closed when end_date is present', () => {
    const referral = Immutable.fromJS({
      end_date: '2016-08-13',
    })

    const component = shallow(<HistoryCardReferral referral={referral} index={1} />)
    const cells = component.find('tr > td')
    expect(cells.at(1).text()).toEqual('Referral(Closed)')
  })

  it('renders the response time if present', () => {
    const referral = Immutable.fromJS({
      response_time: 'Immediate',
    })

    const component = shallow(<HistoryCardReferral referral={referral} index={1} />)
    const cells = component.find('tr > td')
    expect(cells.at(1).text()).toEqual('Referral(Open - Immediate)')
  })

  it('renders the referral county', () => {
    const referral = Immutable.fromJS({
      county_name: 'El Dorado',
    })

    const component = shallow(<HistoryCardReferral referral={referral} index={1} />)
    const cells = component.find('tr > td')
    expect(cells.at(2).text()).toContain('El Dorado')
  })

  it('renders the referral reporter', () => {
    const referral = Immutable.fromJS({
      reporter: {first_name: 'Alex', last_name: 'Hanson'},
    })

    const component = shallow(<HistoryCardReferral referral={referral} index={1} />)
    const cells = component.find('tr > td')
    expect(cells.at(3).text()).toContain('Reporter: Alex Hanson')
  })

  it('displays nothing when the referral reporter has no first and last name', () => {
    const referral = Immutable.fromJS({
      reporter: {first_name: null, last_name: null},
    })

    const component = shallow(<HistoryCardReferral referral={referral} index={1} />)
    const tr = component.find('tr span.reporter')
    expect(tr.text()).toEqual('Reporter: ')
  })

  it('renders the referral assigned worker', () => {
    const referral = Immutable.fromJS({
      assigned_social_worker: {first_name: 'Bob', last_name: 'Smith'},
    })

    const component = shallow(<HistoryCardReferral referral={referral} index={1} />)
    const tr = component.find('tr span.assignee')
    expect(tr.text()).toContain('Worker: Bob Smith')
  })

  it('displays nothing when the referral assigned worker has no first and last name', () => {
    const referral = Immutable.fromJS({
      assigned_social_worker: {first_name: null, last_name: null},
    })

    const component = shallow(<HistoryCardReferral referral={referral} index={1} />)
    const tr = component.find('tr span.assignee')
    expect(tr.text()).toEqual('Worker: ')
  })

  it('displays allegations headers', () => {
    const referral = Immutable.fromJS({})

    const component = shallow(<HistoryCardReferral referral={referral} index={1} />)
    const headerRow = component.find('tr thead tr').first()
    expect(headerRow.text()).toContain('Victim')
    expect(headerRow.text()).toContain('Perpetrator')
    expect(headerRow.text()).toContain('Allegation(s) & Disposition')
  })

  it('displays allegations', () => {
    const referral = Immutable.fromJS({
      allegations: [
        {
          allegation_description: 'General Neglect',
          disposition_description: 'Entered in Error',
          perpetrator_first_name: 'Perpetrator1',
          perpetrator_last_name: 'p1LastName',
          victim_first_name: 'Victim1',
          victim_last_name: 'v1LastName',
        }, {
          allegation_description: 'Severe Neglect',
          disposition_description: null,
          perpetrator_first_name: 'Perpetrator2',
          perpetrator_last_name: 'p2LastName',
          victim_first_name: 'Victim2',
          victim_last_name: 'v2LastName',
        },
      ],
    })
    const component = shallow(<HistoryCardReferral referral={referral} index={1} />)
    const tableRows = component.find('tr tbody tr')

    const firstRowCells = tableRows.at(0).find('td')
    expect(firstRowCells.at(0).text()).toContain('Victim1 v1LastName')
    expect(firstRowCells.at(1).text()).toContain('Perpetrator1 p1LastName')
    expect(firstRowCells.at(2).text()).toContain('General Neglect (Entered in Error)')

    const secondRowCells = tableRows.at(1).find('td')
    expect(secondRowCells.at(0).text()).toContain('Victim2 v2LastName')
    expect(secondRowCells.at(1).text()).toContain('Perpetrator2 p2LastName')
    expect(secondRowCells.at(2).text()).toContain('Severe Neglect (Pending decision)')
  })
})
