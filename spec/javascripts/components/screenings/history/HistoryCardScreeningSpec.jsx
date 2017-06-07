import * as Immutable from 'immutable'
import HistoryCardScreening from 'components/screenings/HistoryCardScreening'
import React from 'react'
import {shallow} from 'enzyme'

describe('HistoryCardScreening', () => {
  const requiredProps = {
    all_people: [],
  }

  describe('#render', () => {
    it('renders No Date when neither start nor end date are present', () => {
      const screening = Immutable.fromJS({
        ...requiredProps,
      })

      const component = shallow(<HistoryCardScreening screening={screening} index={1}/>)
      const tr = component.find('tr')
      expect(tr.text()).toContain('No Date')
    })

    it('renders the screening start date', () => {
      const screening = Immutable.fromJS({
        ...requiredProps,
        start_date: '2016-08-13',
      })

      const component = shallow(<HistoryCardScreening screening={screening} index={1}/>)
      const tr = component.find('tr')
      expect(tr.text()).toContain('08/13/2016')
    })

    it('renders the screening end date', () => {
      const screening = Immutable.fromJS({
        ...requiredProps,
        end_date: '2016-09-13',
      })

      const component = shallow(<HistoryCardScreening screening={screening} index={1}/>)
      const tr = component.find('tr')
      expect(tr.text()).toContain('09/13/2016')
    })

    it('renders a date range when both start and end dates are present', () => {
      const screening = Immutable.fromJS({
        ...requiredProps,
        start_date: '2016-08-13',
        end_date: '2016-09-13',
      })

      const component = shallow(<HistoryCardScreening screening={screening} index={1}/>)
      const tr = component.find('tr')
      expect(tr.text()).toContain('08/13/2016 - 09/13/2016')
    })

    it('renders the screening status In Progress when there is no end_date', () => {
      const screening = Immutable.fromJS({
        ...requiredProps,
      })

      const component = shallow(<HistoryCardScreening screening={screening} index={1}/>)
      const tr = component.find('tr')
      expect(tr.text()).toContain('Screening(In Progress)')
    })

    it('renders the screening status Closed when end_date is present', () => {
      const screening = Immutable.fromJS({
        ...requiredProps,
        end_date: '2016-08-13',
      })

      const component = shallow(<HistoryCardScreening screening={screening} index={1}/>)
      const tr = component.find('tr')
      expect(tr.text()).toContain('Screening(Closed)')
    })

    it('renders the screening county', () => {
      const screening = Immutable.fromJS({
        ...requiredProps,
        county_name: 'el_dorado',
      })

      const component = shallow(<HistoryCardScreening screening={screening} index={1}/>)
      const tr = component.find('tr')
      expect(tr.text()).toContain('El Dorado')
    })

    it('renders even if all_people is nil', () => {
      const screening = Immutable.fromJS({
        ...requiredProps,
        start_date: '2016-01-01',
      })

      const component = shallow(<HistoryCardScreening screening={screening} index={1}/>)
      const participants = component.find('tr span.participants')
      expect(participants.text()).toEqual('')
    })

    it('renders all people who are not reporters unless also victim/perp', () => {
      const screening = Immutable.fromJS({
        ...requiredProps,
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
      })

      const component = shallow(<HistoryCardScreening screening={screening} index={1}/>)
      const participants = component.find('tr span.participants')
      expect(participants.text()).toContain('Stirling Archer')
      expect(participants.text()).toContain('Lana Kane')
      expect(participants.text()).toContain('Malory Archer')
      expect(participants.text()).not.toContain('Cyril Figgis')
    })

    it('renders people who do not have a role', () => {
      const screening = Immutable.fromJS({
        ...requiredProps,
        all_people: [{
          first_name: 'Cheryl',
          last_name: 'Tunt',
          roles: [],
        }],
      })

      const component = shallow(<HistoryCardScreening screening={screening} index={1}/>)
      const participants = component.find('tr span.participants')
      expect(participants.text()).toContain('Cheryl Tunt')
    })

    it('renders the reporter when both first and last names are present', () => {
      const screening = Immutable.fromJS({
        ...requiredProps,
        reporter: {first_name: 'Alex', last_name: 'Hanson'},
      })

      const component = shallow(<HistoryCardScreening screening={screening} index={1}/>)
      const tr = component.find('tr span.reporter')
      expect(tr.text()).toContain('Reporter: Alex Hanson')
    })

    it('displays nothing when the reporter has no first and last name', () => {
      const screening = Immutable.fromJS({
        ...requiredProps,
        reporter: {first_name: null, last_name: null},
      })

      const component = shallow(<HistoryCardScreening screening={screening} index={1}/>)
      const tr = component.find('tr span.reporter')
      expect(tr.text()).toContain('Reporter: ')
      expect(tr.text()).not.toContain('Unknown person')
    })

    it('follows the nameFormatter convention if the reporter just has a last name', () => {
      const screening = Immutable.fromJS({
        ...requiredProps,
        reporter: {first_name: null, last_name: 'Johnson'},
      })

      const component = shallow(<HistoryCardScreening screening={screening} index={1}/>)
      const tr = component.find('tr span.reporter')
      expect(tr.text()).toContain('Reporter: ')
      expect(tr.text()).toContain('(Unknown first name) Johnson')
    })

    it('follows the nameFormatter convention if the reporter just has a first name', () => {
      const screening = Immutable.fromJS({
        ...requiredProps,
        reporter: {first_name: 'Bob', last_name: null},
      })

      const component = shallow(<HistoryCardScreening screening={screening} index={1}/>)
      const tr = component.find('tr span.reporter')
      expect(tr.text()).toContain('Reporter: ')
      expect(tr.text()).toContain('Bob (Unknown last name)')
    })

    it('renders the assigned worker', () => {
      const screening = Immutable.fromJS({
        ...requiredProps,
        assigned_social_worker: {first_name: null, last_name: 'Bob Smith'},
      })

      const component = shallow(<HistoryCardScreening screening={screening} index={1}/>)
      const tr = component.find('tr span.assignee')
      expect(tr.text()).toContain('Worker: Bob Smith')
    })

    it('does not render null if the assigned worker has no last name', () => {
      const screening = Immutable.fromJS({
        ...requiredProps,
        assigned_social_worker: {first_name: null, last_name: null},
      })

      const component = shallow(<HistoryCardScreening screening={screening} index={1}/>)
      const tr = component.find('tr span.assignee')
      expect(tr.text()).toContain('Worker: ')
      expect(tr.text()).not.toContain('null')
    })

    it('renders the no worker when assignee is null', () => {
      const screening = Immutable.fromJS({
        ...requiredProps,
      })

      const component = shallow(<HistoryCardScreening screening={screening} index={1}/>)
      const tr = component.find('tr span.assignee')
      expect(tr.text()).toEqual('Worker: ')
    })
  })
})

