import React from 'react'
import {HomePage} from 'home/HomePage'
import {shallow, mount} from 'enzyme'
import * as IntakeConfig from 'common/config'

describe('HomePage', () => {
  let component
  const requiredProps = {actions: {}}
  function mountHomePage({actions = {}}) {
    const props = {actions, screenings: []}
    mount(<HomePage {...props} />)
  }

  describe('when release_two is inactive', () => {
    beforeEach(() => {
      spyOn(IntakeConfig, 'isFeatureInactive')
      IntakeConfig.isFeatureInactive.and.returnValue(true)
    })

    describe('#componentDidMount', () => {
      const fetchScreenings = jasmine.createSpy('fetchScreenings')
      beforeEach(() => {
        mountHomePage({actions: {fetchScreenings}})
      })

      it('fetches the screenings', () => {
        expect(fetchScreenings).toHaveBeenCalled()
      })
    })

    it('renders the create screening link', () => {
      component = shallow(<HomePage {...requiredProps} />)
      const createScreeningLink = component.find('Link')
      expect(createScreeningLink.props().children).toEqual('Start Screening')
    })

    it('renders the screening index table', () => {
      component = shallow(<HomePage {...requiredProps} />)
      expect(component.find('ScreeningsTable').length).toEqual(1)
    })

    it('renders the screening index table when screenings are present', () => {
      const screenings = [{id: 1, name: 'Name 1', reference: 'ref1', started_at: '2016-08-11T18:24:22.157Z'}]
      const props = {...requiredProps, screenings}
      component = shallow(<HomePage {...props} />)
      const table = component.find('ScreeningsTable')
      expect(table.props().screenings).toEqual(screenings)
    })

    describe('when a user creates a new screening', () => {
      let createScreening
      beforeEach(() => {
        createScreening = jasmine.createSpy('createScreening')
        component = shallow(<HomePage actions={{createScreening}} />)
        const createScreeningLink = component.find('Link')
        createScreeningLink.simulate('click')
      })

      it('calls the create screening action', () => {
        expect(createScreening).toHaveBeenCalled()
      })
    })
  })

  describe('when release_two feature is not inactive', () => {
    beforeEach(() => {
      spyOn(IntakeConfig, 'isFeatureInactive')
      IntakeConfig.isFeatureInactive.and.returnValue(false)
    })

    it('does not render the screenings table', () => {
      const component = shallow(<HomePage {...requiredProps} />)
      const table = component.find('ScreeningsTable')
      expect(table.length).toEqual(0)
    })

    describe('#componentDidMount', () => {
      const fetchScreenings = jasmine.createSpy('fetchScreenings')
      beforeEach(() => {
        mountHomePage({actions: {fetchScreenings}})
      })

      it('does not fetch screenings', () => {
        expect(fetchScreenings).not.toHaveBeenCalled()
      })
    })
  })
})
