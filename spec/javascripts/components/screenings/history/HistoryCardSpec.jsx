import * as Immutable from 'immutable'
import HistoryCard from 'components/screenings/HistoryCard'
import React from 'react'
import {shallow} from 'enzyme'

describe('HistoryCard', () => {
  const requiredProps = {
    actions: {},
    involvements: Immutable.fromJS({screenings: [], referrals: []}),
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

    it('renders screenings, if present', () => {
      const involvements = Immutable.fromJS({screenings: [{}]})
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const screeningCards = component.find('HistoryCardScreening')
      expect(screeningCards.length).toEqual(1)
    })

    it('does not render screenings if empty', () => {
      const involvements = Immutable.fromJS({screenings: []})
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const screeningCards = component.find('HistoryCardScreening')
      expect(screeningCards.length).toEqual(0)
    })

    it('renders referrals, if present', () => {
      const involvements = Immutable.fromJS({referrals: [{}]})
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const referralCards = component.find('HistoryCardReferral')
      expect(referralCards.length).toEqual(1)
    })

    it('does not render referrals if empty', () => {
      const involvements = Immutable.fromJS({referrals: []})
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const referralCards = component.find('HistoryCardReferral')
      expect(referralCards.length).toEqual(0)
    })
  })
})
