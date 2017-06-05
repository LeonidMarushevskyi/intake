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

    it('calls buildHOI', () => {
      const spy = spyOn(HistoryCard.prototype, 'renderHOI')
      shallow(<HistoryCard {...requiredProps}/>)
      expect(spy).toHaveBeenCalled()
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
  })

  describe('#buildHOI', () => {
    it('calls renderReferrals', () => {
      const referralSpy = spyOn(HistoryCard.prototype, 'renderReferrals')
      shallow(<HistoryCard {...requiredProps}/>)
      expect(referralSpy).toHaveBeenCalled()
    })

    it('only calls renderReferrals if referrals are present', () => {
      const involvements = Immutable.fromJS({screenings: []})
      const props = {
        ...requiredProps,
        involvements,
      }
      const referralSpy = spyOn(HistoryCard.prototype, 'renderReferrals')
      shallow(<HistoryCard {...props}/>)
      expect(referralSpy).not.toHaveBeenCalled()
    })
  })

  describe('#renderReferrals', () => {
    it('renders the referral started_at date', () => {
      const involvements = Immutable.fromJS({
        referrals: [{
          start_date: '2016-08-13',
        }],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody#history-of-involvement > tr')
      expect(tr.text()).toContain('08/13/2016')
    })

    it('renders the referral status as In Progress when there is no end_date', () => {
      const involvements = Immutable.fromJS({
        referrals: [{}],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody#history-of-involvement > tr')
      expect(tr.text()).toContain('Referral(In Progress)')
    })

    it('renders the referral status as Closed when end_date is present', () => {
      const involvements = Immutable.fromJS({
        referrals: [{
          end_date: '2016-08-13',
        }],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody#history-of-involvement > tr')
      expect(tr.text()).toContain('Referral(Closed)')
    })

    it('renders the referral county', () => {
      const involvements = Immutable.fromJS({
        referrals: [{
          county_name: 'El Dorado',
        }],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody#history-of-involvement > tr')
      expect(tr.text()).toContain('El Dorado')
    })

    it('renders the referral reporter', () => {
      const involvements = Immutable.fromJS({
        referrals: [
          {
            reporter: {first_name: 'Alex', last_name: 'Hanson'},
          },
        ],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr span.reporter')
      expect(tr.text()).toContain('Reporter: Alex Hanson')
    })

    it('displays nothing when the referral reporter has no first and last name', () => {
      const involvements = Immutable.fromJS({
        referrals: [
          {
            reporter: {first_name: null, last_name: null},
          },
        ],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr span.reporter')
      expect(tr.text()).toEqual('Reporter: ')
    })

    it('renders the referral assigned worker', () => {
      const involvements = Immutable.fromJS({
        referrals: [
          {
            assigned_social_worker: {first_name: 'Bob', last_name: 'Smith'},
          },
        ],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr span.assignee')
      expect(tr.text()).toContain('Worker: Bob Smith')
    })

    it('displays nothing when the referral assigned worker has no first and last name', () => {
      const involvements = Immutable.fromJS({
        referrals: [{
          assigned_social_worker: {first_name: null, last_name: null},
        }],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr span.assignee')
      expect(tr.text()).toEqual('Worker: ')
    })

    it('displays allegations headers', () => {
      const involvements = Immutable.fromJS({
        referrals: [{ }],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const headerRow = component.find('tbody#history-of-involvement tr thead tr').first()
      expect(headerRow.text()).toContain('Victim')
      expect(headerRow.text()).toContain('Perpetrator')
      expect(headerRow.text()).toContain('Allegation(s) & Disposition')
    })

    it('displays allegations', () => {
      const involvements = Immutable.fromJS({
        referrals: [
          {
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
          },
        ],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tableRows = component.find('tbody#history-of-involvement tr tbody tr')

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
})
