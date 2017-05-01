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
  const requiredScreeningAttrs = {
    participants: [],
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
        ...requiredScreeningAttrs,
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

    it('renders the involvement status In Progress when ended_at is null', () => {
      const involvements = Immutable.fromJS([{
        ...requiredScreeningAttrs,
        ended_at: null,
      }])
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr')
      expect(tr.text()).toContain('Screening(In Progress)')
    })

    it('renders the involvement status Closed when ended_at is not null', () => {
      const involvements = Immutable.fromJS([{
        ...requiredScreeningAttrs,
        ended_at: '2016-08-13T10:00:00.000Z',
      }])
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr')
      expect(tr.text()).toContain('Screening(Closed)')
    })

    it('renders the incident county', () => {
      const involvements = Immutable.fromJS([{
        ...requiredScreeningAttrs,
        incident_county: 'Sacramento',
      }])
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr')
      expect(tr.text()).toContain('Sacramento')
    })

    it('renders all people who are not reporters unless also victim/perp', () => {
      const involvements = Immutable.fromJS([{
        participants: [{
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
      }])
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
      const involvements = Immutable.fromJS([{
        participants: [{
          first_name: 'Cheryl',
          last_name: 'Tunt',
          roles: [],
        }],
      }])
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const participants = component.find('tbody tr span.participants')
      expect(participants.text()).toContain('Cheryl Tunt')
    })

    it('renders the reporter', () => {
      const involvements = Immutable.fromJS([{
        participants: [{
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
        }],
      }])
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr span.reporter')
      expect(tr.text()).toContain('Reporter: Malory Archer')
    })

    it('renders the assigned worker', () => {
      const involvements = Immutable.fromJS([{
        ...requiredScreeningAttrs,
        assignee: 'Algernop Krieger',
      }])
      const props = {
        ...requiredProps,
        involvements,
      }
      const component = shallow(<HistoryCard {...props}/>)
      const tr = component.find('tbody tr span.assignee')
      expect(tr.text()).toContain('Worker: Algernop Krieger')
    })

    it('renders the no worker when assignee is null', () => {
      const involvements = Immutable.fromJS([{
        ...requiredScreeningAttrs,
        assignee: null,
      }])
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
