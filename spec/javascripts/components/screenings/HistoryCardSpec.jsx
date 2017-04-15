import React from 'react'
import HistoryCard from 'components/screenings/HistoryCard'
import {shallow, mount} from 'enzyme'
import * as Immutable from 'Immutable'

describe('HistoryCard', () => {
  describe('#componentDidMount', () => {
    let fetchHistoryOfInvolvements

    beforeEach(() => {
      fetchHistoryOfInvolvements = jasmine.createSpy('fetchHistoryOfInvolvements')
      const props = {
        actions: {fetchHistoryOfInvolvements},
        participants: Immutable.fromJS([
          {person_id: 1},
          {person_id: 2},
          {person_id: null},
        ]),
      }
      mount(<HistoryCard {...props}/>)
    })

    it('fetches history of involvements', () => {
      expect(fetchHistoryOfInvolvements).toHaveBeenCalledWith([1, 2])
    })
  })

  it('renders history card headings', () => {
    const component = shallow(<HistoryCard />)
    const tr = component.find('tr')
    expect(tr.text()).toContain('Date')
    expect(tr.text()).toContain('Type/Status')
    expect(tr.text()).toContain('County/Office')
    expect(tr.text()).toContain('People and Roles')
  })
})
