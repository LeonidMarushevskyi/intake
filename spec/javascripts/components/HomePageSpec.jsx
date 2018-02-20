import React from 'react'
import {HomePage} from 'home/HomePage'
import {shallow} from 'enzyme'
import * as IntakeConfig from 'common/config'

describe('HomePage', () => {
  const renderHomePage = ({actions = {}, screenings = [], ...args}) => {
    const props = {actions, screenings, ...args}
    return shallow(<HomePage {...props} />, {disableLifecycleMethods: true})
  }

  const renderHomePageWithLifecycle = ({actions = {}, screenings = [], ...args}) => {
    const props = {actions, screenings, ...args}
    return shallow(<HomePage {...props} />)
  }

  describe('when screening and snapshot features are active', () => {
    beforeEach(() => {
      const features = {
        screenings: true,
        snapshot: true,
      }
      spyOn(IntakeConfig, 'isFeatureActive').and.callFake((feature) => features[feature])
    })

    describe('#componentDidMount', () => {
      it('fetches the screenings', () => {
        const fetchScreenings = jasmine.createSpy('fetchScreenings')
        renderHomePageWithLifecycle({actions: {fetchScreenings}})
        expect(fetchScreenings).toHaveBeenCalled()
      })
    })

    it('passes the page title to the page header', () => {
      const component = renderHomePage({})
      const pageHeader = component.find('Connect(PageHeader)')
      expect(pageHeader.props().pageTitle).toEqual('Dashboard')
    })

    it('passes two buttons to the screening header', () => {
      const component = renderHomePage({}).find('Connect(PageHeader)')
      const pageHeader = component.find('Connect(PageHeader)')
      const [startScreening, startSnapshot] = pageHeader.props().button.props.children
      expect(startScreening.props.children).toEqual('Start Screening')
      expect(startSnapshot.props.children).toEqual('Start Snapshot')
    })

    it('renders the screening index table', () => {
      const component = renderHomePage({})
      expect(component.find('ScreeningsTable').length).toEqual(1)
    })

    it('renders the screening index table when screenings are present', () => {
      const screenings = [
        {id: 1, name: 'Name 1', reference: 'ref1', started_at: '2016-08-11T18:24:22.157Z'},
      ]
      const component = renderHomePage({screenings})
      const table = component.find('ScreeningsTable')
      expect(table.props().screenings).toEqual(screenings)
    })
  })

  describe('when screening feature is not inactive', () => {
    beforeEach(() => {
      const features = {
        screenings: false,
        snapshot: true,
      }
      spyOn(IntakeConfig, 'isFeatureActive').and.callFake((feature) => features[feature])
    })

    it('passes one button to the screening header', () => {
      const component = renderHomePage({}).find('Connect(PageHeader)')
      const pageHeader = component.find('Connect(PageHeader)')
      const [empty, startSnapshot] = pageHeader.props().button.props.children
      expect(empty.type).toEqual('div')
      expect(startSnapshot.props.children).toEqual('Start Snapshot')
    })

    it('does not render the screenings table', () => {
      const component = renderHomePage({})
      expect(component.find('ScreeningsTable').exists()).toBe(false)
    })

    describe('#componentDidMount', () => {
      it('does not fetch screenings', () => {
        const fetchScreenings = jasmine.createSpy('fetchScreenings')
        renderHomePageWithLifecycle({actions: {fetchScreenings}})
        expect(fetchScreenings).not.toHaveBeenCalled()
      })
    })
  })

  describe('when snapshot feature is not active', () => {
    beforeEach(() => {
      const features = {
        screenings: true,
        snapshot: false,
      }
      spyOn(IntakeConfig, 'isFeatureActive').and.callFake((feature) => features[feature])
    })

    it('passes one button to the screening header', () => {
      const component = renderHomePage({}).find('Connect(PageHeader)')
      const pageHeader = component.find('Connect(PageHeader)')
      const [startScreening, empty] = pageHeader.props().button.props.children
      expect(startScreening.props.children).toEqual('Start Screening')
      expect(empty.type).toEqual('div')
    })
  })
})
