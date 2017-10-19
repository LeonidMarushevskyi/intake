import React from 'react'
import Immutable from 'immutable'
import ScreeningInformationShowView from 'screenings/ScreeningInformationShowView'
import {shallow} from 'enzyme'

describe('ScreeningInformationShowView', () => {
  let component

  const requiredProps = {
    onEdit: jasmine.createSpy(),
    screening: Immutable.fromJS({}),
    errors: {},
  }

  describe('when the screening values are null', () => {
    beforeEach(() => {
      const screening = Immutable.fromJS({
        assignee: null,
        name: null,
        started_at: null,
        ended_at: null,
        communication_method: null,
      })

      const props = {
        ...requiredProps,
        screening,
        errors: {
          assignee: ['Error 1', 'Error 2'],
          started_at: ['Error 3', 'Error 4'],
          communication_method: ['My Spider-Sense is tingling.'],
          ended_at: ['Never give up', 'Never surrender'],
        },
      }

      component = shallow(<ScreeningInformationShowView {...props} />)
    })

    it('renders no screening name', () => {
      expect(component.find('ShowField[label="Title/Name of Screening"]').html())
        .toContain('<span></span>')
    })

    it('renders no social worker', () => {
      expect(component.find('ShowField[label="Assigned Social Worker"]').html())
        .toContain('<span></span>')
    })

    it('renders no start date/time', () => {
      expect(component.find('ShowField[label="Screening Start Date/Time"]').html())
        .toContain('<span></span>')
    })

    it('renders no end date/time', () => {
      expect(component.find('ShowField[label="Screening End Date/Time"]').html())
        .toContain('<span></span>')
    })

    it('renders no communication method', () => {
      expect(component.find('ShowField[label="Communication Method"]').html())
        .toContain('<span></span>')
    })

    it('renders errors for the Assigned Social Worker', () => {
      const socialWorker = component.find('ShowField[label="Assigned Social Worker"]')
      expect(socialWorker.html()).toContain('Error 1')
      expect(socialWorker.html()).toContain('Error 2')
    })

    it('renders errors for the Start Date/Time', () => {
      const startDate = component.find('ShowField[label="Screening Start Date/Time"]')
      expect(startDate.html()).toContain('Error 3')
      expect(startDate.html()).toContain('Error 4')
    })

    it('renders errors for Communication Method', () => {
      const commMethod = component.find('ShowField[label="Communication Method"]')
      expect(commMethod.html()).toContain('My Spider-Sense is tingling.')
    })

    it('renders errors for the End Date/Time', () => {
      const endDate = component.find('ShowField[label="Screening End Date/Time"]')
      expect(endDate.html()).toContain('Never give up')
      expect(endDate.html()).toContain('Never surrender')
    })
  })

  describe('Show fields', () => {
    const props = {
      ...requiredProps,
      screening: Immutable.fromJS({
        name: 'The Rocky Horror Picture Show',
        assignee: 'Michael Bluth',
        started_at: '2016-08-13T10:00:00.000Z',
        ended_at: '2016-08-22T11:00:00.000Z',
        communication_method: 'mail',
        participants: [],
      }),
    }

    beforeEach(() => {
      component = shallow(<ScreeningInformationShowView {...props} />)
    })

    it('renders the screening show fields', () => {
      expect(component.find('ShowField').length).toEqual(5)
    })

    it('renders name of screening', () => {
      const screeningName = component.find('ShowField[label="Title/Name of Screening"]')
      expect(screeningName.html()).toContain('The Rocky Horror Picture Show')
    })

    it('renders the screening start date/time', () => {
      const startDate = component.find('ShowField[label="Screening Start Date/Time"]')
      expect(startDate.props().required).toEqual(true)
      expect(startDate.html()).toContain('08/13/2016 3:00 AM')
    })

    it('renders the screening end date/time', () => {
      const endDate = component.find('ShowField[label="Screening End Date/Time"]')
      expect(endDate.html()).toContain('08/22/2016 4:00 AM')
    })

    it('renders the communication method', () => {
      const comMethod = component.find('ShowField[label="Communication Method"]')
      expect(comMethod.props().required).toEqual(true)
      expect(comMethod.html()).toContain('Mail')
    })

    it('renders Assigned Social Worker', () => {
      const socialWorker = component.find('ShowField[label="Assigned Social Worker"]')
      expect(socialWorker.props().required).toEqual(true)
      expect(socialWorker.html()).toContain('Michael Bluth')
    })
  })
})
