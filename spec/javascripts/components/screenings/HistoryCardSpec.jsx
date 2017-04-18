import * as Immutable from 'immutable'
import HistoryCard from 'components/screenings/HistoryCard'
import React from 'react'
import {shallow} from 'enzyme'

describe('HistoryCard', () => {
  const requiredProps = {
    actions: {},
    involvements: Immutable.List(),
    participants: Immutable.List(),
    screeningId: '33',
  }

  describe('#componentWillReceiveProps', () => {
    let component
    let fetchHistoryOfInvolvements

    beforeEach(() => {
      fetchHistoryOfInvolvements = jasmine.createSpy('fetchHistoryOfInvolvements')
      const props = {
        ...requiredProps,
        actions: {fetchHistoryOfInvolvements},
        participants: Immutable.List(),
      }
      component = shallow(<HistoryCard {...props}/>)
    })

    describe('when participants change', () => {
      beforeEach(() => {
        const updatedProps = {
          participants: Immutable.fromJS([
            {id: 1},
            {id: 2},
          ]),
        }
        component.setProps(updatedProps)
      })

      it('fetches history of involvements', () => {
        expect(fetchHistoryOfInvolvements).toHaveBeenCalledWith(requiredProps.screeningId)
      })
    })

    describe('when participants are the same', () => {
      beforeEach(() => {
        const updatedProps = {participants: Immutable.List()}
        component.setProps(updatedProps)
      })

      it('does not fetch history of involvements', () => {
        expect(fetchHistoryOfInvolvements).not.toHaveBeenCalled()
      })
    })
  })

  describe('#render', () => {
    it('renders history card headings', () => {
      const component = shallow(<HistoryCard {...requiredProps}/>)
      const tr = component.find('thead tr')
      expect(tr.text()).toContain('Date')
      expect(tr.text()).toContain('Type/Status')
      expect(tr.text()).toContain('County/Office')
      expect(tr.text()).toContain('People and Roles')
    })

    it('renders the involvement started_at date', () => {
      const involvements = Immutable.fromJS([{
        started_at: '2016-08-13T10:00:00.000Z',
      }])
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr')
      expect(tr.text()).toContain('08/13/2016')
    })
  })
})
