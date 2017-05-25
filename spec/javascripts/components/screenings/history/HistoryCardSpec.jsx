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

    it('renders the involvement started_at date', () => {
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

    it('renders the involvement status In Progress when there is no end_date', () => {
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

    it('renders the involvement status Closed when end_date is present', () => {
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

    it('renders the incident county', () => {
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
