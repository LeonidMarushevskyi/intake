import * as Immutable from 'immutable'
import HistoryCardCase from 'components/screenings/HistoryCardCase'
import React from 'react'
import {shallow} from 'enzyme'

describe('HistoryCardCase', () => {
  it('renders css id with the case id', () => {
    const hoiCase = Immutable.fromJS({id: 'ABC123'})
    const component = shallow(<HistoryCardCase hoiCase={hoiCase} index={1} />)
    expect(component.find('tr#case-ABC123').exists()).toEqual(true)
  })

  it('renders No Date when neither start nor end date is present', () => {
    const hoiCase = Immutable.fromJS({})
    const component = shallow(<HistoryCardCase hoiCase={hoiCase} index={1} />)
    const cells = component.find('tr > td')
    expect(cells.at(0).text()).toEqual('No Date')
  })

  it('renders the case start_at date', () => {
    const hoiCase = Immutable.fromJS({
      start_date: '2016-08-13',
    })

    const component = shallow(<HistoryCardCase hoiCase={hoiCase} index={1} />)
    const cells = component.find('tr > td')
    expect(cells.at(0).text()).toEqual('08/13/2016')
  })

  it('renders the end_at date', () => {
    const hoiCase = Immutable.fromJS({
      end_date: '2016-09-25',
    })

    const component = shallow(<HistoryCardCase hoiCase={hoiCase} index={1} />)
    const cells = component.find('tr > td')
    expect(cells.at(0).text()).toEqual('09/25/2016')
  })

  it('renders a date range when both start and end dates are present', () => {
    const hoiCase = Immutable.fromJS({
      start_date: '2016-08-13',
      end_date: '2016-09-25',
    })

    const component = shallow(<HistoryCardCase hoiCase={hoiCase} index={1} />)
    const cells = component.find('tr > td')
    expect(cells.at(0).text()).toEqual('08/13/2016 - 09/25/2016')
  })

  it('displays a status of Open if there is no end date', () => {
    const hoiCase = Immutable.fromJS({
      start_date: '2016-08-13',
    })

    const component = shallow(<HistoryCardCase hoiCase={hoiCase} index={1} />)
    const cells = component.find('tr > td')
    expect(cells.at(1).text()).toEqual('Case(Open)')
  })

  it('displays a status of In Progress if there is an end date', () => {
    const hoiCase = Immutable.fromJS({
      start_date: '2016-08-13',
      end_date: '2016-09-25',
    })

    const component = shallow(<HistoryCardCase hoiCase={hoiCase} index={1} />)
    const cells = component.find('tr > td')
    expect(cells.at(1).text()).toEqual('Case(Closed)')
  })

  it('displays the service component if present', () => {
    const hoiCase = Immutable.fromJS({
      service_component: 'Family Reunification',
    })

    const component = shallow(<HistoryCardCase hoiCase={hoiCase} index={1} />)
    const cells = component.find('tr > td')
    expect(cells.at(1).text()).toEqual('Case(Open - Family Reunification)')
  })

  it('displays the county', () => {
    const hoiCase = Immutable.fromJS({
      county_name: 'El Dorado',
    })

    const component = shallow(<HistoryCardCase hoiCase={hoiCase} index={1} />)
    const cells = component.find('tr > td')
    expect(cells.at(2).text()).toEqual('El Dorado')
  })

  it('displays the worker name', () => {
    const hoiCase = Immutable.fromJS({
      assigned_social_worker: {
        first_name: 'Social',
        last_name: 'Worker',
      },
    })

    const component = shallow(<HistoryCardCase hoiCase={hoiCase} index={1} />)
    const workerName = component.find('.assignee')
    expect(workerName.text()).toEqual('Worker: Social Worker')
  })

  it('displays nothing if the worker has no name', () => {
    const hoiCase = Immutable.fromJS({
      assigned_social_worker: {
        first_name: null,
        last_name: null,
      },
    })

    const component = shallow(<HistoryCardCase hoiCase={hoiCase} index={1} />)
    const workerName = component.find('.assignee')
    expect(workerName.text()).toEqual('Worker: ')
  })

  it('displays the focus child name', () => {
    const hoiCase = Immutable.fromJS({
      focus_child: {
        first_name: 'FocusFirst',
        last_name: 'FocusLast',
      },
    })

    const component = shallow(<HistoryCardCase hoiCase={hoiCase} index={1} />)
    const hoiChildName = component.find('.focus-child')
    expect(hoiChildName.text()).toEqual('Focus Child: FocusFirst FocusLast')
  })

  it('displays the parent names', () => {
    const hoiCase = Immutable.fromJS({
      parents: [
        {
          first_name: 'Parent1',
          last_name: 'Last1',
        },
        {
          first_name: 'Parent2',
          last_name: 'Last2',
        },
      ],
    })

    const component = shallow(<HistoryCardCase hoiCase={hoiCase} index={1} />)
    const hoiParentNames = component.find('.parents')
    expect(hoiParentNames.text()).toEqual('Parent(s): Parent1 Last1, Parent2 Last2')
  })
})

