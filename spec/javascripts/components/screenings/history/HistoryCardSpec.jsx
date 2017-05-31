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
  const requiredScreeningAttrs = {
    all_people: Immutable.List(),
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
  })

  describe('#buildHOI', () => {
    it('calls renderScreenings and renderReferrals', () => {
      const referralSpy = spyOn(HistoryCard.prototype, 'renderReferrals')
      const screeningSpy = spyOn(HistoryCard.prototype, 'renderScreenings')
      shallow(<HistoryCard {...requiredProps}/>)
      expect(referralSpy).toHaveBeenCalled()
      expect(screeningSpy).toHaveBeenCalled()
    })

    it('only calls renderScreenings if screenings are present', () => {
      const involvements = Immutable.fromJS({referrals: []})
      const props = {
        ...requiredProps,
        involvements,
      }
      const referralSpy = spyOn(HistoryCard.prototype, 'renderReferrals')
      const screeningSpy = spyOn(HistoryCard.prototype, 'renderScreenings')
      shallow(<HistoryCard {...props}/>)
      expect(screeningSpy).not.toHaveBeenCalled()
      expect(referralSpy).toHaveBeenCalled()
    })

    it('only calls renderReferrals if referrals are present', () => {
      const involvements = Immutable.fromJS({screenings: []})
      const props = {
        ...requiredProps,
        involvements,
      }
      const referralSpy = spyOn(HistoryCard.prototype, 'renderReferrals')
      const screeningSpy = spyOn(HistoryCard.prototype, 'renderScreenings')
      shallow(<HistoryCard {...props}/>)
      expect(referralSpy).not.toHaveBeenCalled()
      expect(screeningSpy).toHaveBeenCalled()
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

  describe('#renderScreenings', () => {
    it('renders the screening started_at date', () => {
      const involvements = Immutable.fromJS({
        screenings: [
          {
            ...requiredScreeningAttrs,
            start_date: '2016-08-13',
          },
        ],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr')
      expect(tr.text()).toContain('08/13/2016')
    })

    it('renders the screening status In Progress when there is no end_date', () => {
      const involvements = Immutable.fromJS({
        screenings: [
          {
            ...requiredScreeningAttrs,
          },
        ],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr')
      expect(tr.text()).toContain('Screening(In Progress)')
    })

    it('renders the screening status Closed when end_date is present', () => {
      const involvements = Immutable.fromJS({
        screenings: [
          {
            ...requiredScreeningAttrs,
            end_date: '2016-08-13',
          },
        ],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr')
      expect(tr.text()).toContain('Screening(Closed)')
    })

    it('renders the screening county', () => {
      const involvements = Immutable.fromJS({
        screenings: [
          {
            ...requiredScreeningAttrs,
            county_name: 'el_dorado',
          },
        ],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr')
      expect(tr.text()).toContain('El Dorado')
    })

    it('renders even if all_people is nil', () => {
      const involvements = Immutable.fromJS({
        screenings: [
          {
            start_date: '2016-01-01',
          },
        ],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const participants = component.find('tbody tr span.participants')
      expect(participants.text()).toEqual('')
    })

    it('renders all people who are not reporters unless also victim/perp', () => {
      const involvements = Immutable.fromJS({
        screenings: [{
          all_people: [{
            first_name: 'Stirling',
            last_name: 'Archer',
            roles: ['Victim'],
          }, {
            first_name: 'Lana',
            last_name: 'Kane',
            roles: ['Perpetrator'],
          }, {
            first_name: 'Malory',
            last_name: 'Archer',
            roles: ['Victim', 'Mandated Reporter'],
          }, {
            first_name: 'Cyril',
            last_name: 'Figgis',
            roles: ['Mandated Reporter'],
          }],
        }],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const participants = component.find('tbody tr span.participants')
      expect(participants.text()).toContain('Stirling Archer')
      expect(participants.text()).toContain('Lana Kane')
      expect(participants.text()).toContain('Malory Archer')
      expect(participants.text()).not.toContain('Cyril Figgis')
    })

    it('renders people who do not have a role', () => {
      const involvements = Immutable.fromJS({
        screenings: [
          {
            all_people: [{
              first_name: 'Cheryl',
              last_name: 'Tunt',
              roles: [],
            }],
          },
        ],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const participants = component.find('tbody tr span.participants')
      expect(participants.text()).toContain('Cheryl Tunt')
    })

    it('renders the reporter when both first and last names are present', () => {
      const involvements = Immutable.fromJS({
        screenings: [
          {
            ...requiredScreeningAttrs,
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

    it('displays nothing when the reporter has no first and last name', () => {
      const involvements = Immutable.fromJS({
        screenings: [
          {
            ...requiredScreeningAttrs,
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
      expect(tr.text()).toContain('Reporter: ')
      expect(tr.text()).not.toContain('Unknown person')
    })

    it('follows the nameFormatter convention if the reporter just has a last name', () => {
      const involvements = Immutable.fromJS({
        screenings: [
          {
            ...requiredScreeningAttrs,
            reporter: {first_name: null, last_name: 'Johnson'},
          },
        ],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr span.reporter')
      expect(tr.text()).toContain('Reporter: ')
      expect(tr.text()).toContain('(Unknown first name) Johnson')
    })

    it('follows the nameFormatter convention if the reporter just has a first name', () => {
      const involvements = Immutable.fromJS({
        screenings: [
          {
            ...requiredScreeningAttrs,
            reporter: {first_name: 'Bob', last_name: null},
          },
        ],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr span.reporter')
      expect(tr.text()).toContain('Reporter: ')
      expect(tr.text()).toContain('Bob (Unknown last name)')
    })

    it('renders the assigned worker', () => {
      const involvements = Immutable.fromJS({
        screenings: [
          {
            ...requiredScreeningAttrs,
            assigned_social_worker: {first_name: null, last_name: 'Bob Smith'},
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

    it('does not render null if the assigned worker has no last name', () => {
      const involvements = Immutable.fromJS({
        screenings: [
          {
            ...requiredScreeningAttrs,
            assigned_social_worker: {first_name: null, last_name: null},
          },
        ],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr span.assignee')
      expect(tr.text()).toContain('Worker: ')
      expect(tr.text()).not.toContain('null')
    })

    it('renders the no worker when assignee is null', () => {
      const involvements = Immutable.fromJS({
        screenings: [
          {
            ...requiredScreeningAttrs,
          },
        ],
      })
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr span.assignee')
      expect(tr.text()).toEqual('Worker: ')
    })
  })
})
