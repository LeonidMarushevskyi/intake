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

  it('passes the page title to the page header', () => {
    const component = renderHomePage({})
    const pageHeader = component.find('Connect(PageHeader)')
    expect(pageHeader.props().pageTitle).toEqual('Dashboard')
  })

  describe('when screening and snapshot features are active', () => {
    beforeEach(() => {
      const features = {
        screenings: true,
        snapshot: true,
      }
      spyOn(IntakeConfig, 'isFeatureActive').and.callFake((feature) => features[feature])
    })

    describe('#componentDidMount', () => {
      it('fetches screenings when the user has permission', () => {
        const fetchScreenings = jasmine.createSpy('fetchScreenings')
        renderHomePageWithLifecycle({canSeeHotline: true, actions: {fetchScreenings}})
        expect(fetchScreenings).toHaveBeenCalled()
      })
      it('does not fetch screenings when the user has no permission', () => {
        const fetchScreenings = jasmine.createSpy('fetchScreenings')
        renderHomePageWithLifecycle({actions: {fetchScreenings}})
        expect(fetchScreenings).not.toHaveBeenCalled()
      })
    })

    describe('when the user has permissions to see snapshot', () => {
      it('passes the start snapshot btn to the header', () => {
        const component = renderHomePage({canSeeSnapshot: true}).find('Connect(PageHeader)')
        const pageHeader = component.find('Connect(PageHeader)')
        const [startScreening, startSnapshot] = pageHeader.props().button.props.children
        expect(startScreening.props.children).toBe(undefined)
        expect(startSnapshot.props.children).toEqual('Start Snapshot')
      })

      it('renders the screening index table', () => {
        const component = renderHomePage({canSeeSnapshot: true})
        expect(component.find('ScreeningsTable').length).toEqual(0)
      })
    })

    describe('when the user has permissions to see hotline', () => {
      it('passes the start screening btn to the screening header', () => {
        const component = renderHomePage({canSeeHotline: true}).find('Connect(PageHeader)')
        const pageHeader = component.find('Connect(PageHeader)')
        const [startScreening, startSnapshot] = pageHeader.props().button.props.children
        expect(startScreening.props.children).toEqual('Start Screening')
        expect(startSnapshot.props.children).toBe(undefined)
      })

      it('renders the screening index table', () => {
        const component = renderHomePage({canSeeHotline: true})
        expect(component.find('ScreeningsTable').length).toEqual(1)
      })

      it('renders the screening index table when screenings are present', () => {
        const screenings = [
          {id: 1, name: 'Name 1', reference: 'ref1', started_at: '2016-08-11T18:24:22.157Z'},
        ]
        const component = renderHomePage({screenings, canSeeHotline: true})
        const table = component.find('ScreeningsTable')
        expect(table.props().screenings).toEqual(screenings)
      })
    })
  })

  describe('when the screenings feature is not active', () => {
    beforeEach(() => {
      const features = {
        screenings: false,
        snapshot: true,
      }
      spyOn(IntakeConfig, 'isFeatureActive').and.callFake((feature) => features[feature])
    })

    describe('when the user has permission to only see snapshot', () => {
      it('passes one button to the screening header', () => {
        const component = renderHomePage({canSeeSnapshot: true}).find('Connect(PageHeader)')
        const pageHeader = component.find('Connect(PageHeader)')
        const [empty, startSnapshot] = pageHeader.props().button.props.children
        expect(empty.type).toEqual('div')
        expect(startSnapshot.props.children).toEqual('Start Snapshot')
      })
      it('does not render the screenings table', () => {
        const component = renderHomePage({canSeeSnapshot: true})
        expect(component.find('ScreeningsTable').exists()).toBe(false)
      })
      describe('#componentDidMount', () => {
        it('does not fetch screenings', () => {
          const fetchScreenings = jasmine.createSpy('fetchScreenings')
          renderHomePageWithLifecycle({canSeeSnapshot: true, actions: {fetchScreenings}})
          expect(fetchScreenings).not.toHaveBeenCalled()
        })
      })
    })

    describe('when the user has permission only to see hotline', () => {
      it('no buttons should be visible', () => {
        const component = renderHomePage({canSeeHotline: true}).find('Connect(PageHeader)')
        const pageHeader = component.find('Connect(PageHeader)')
        const [empty, startSnapshot] = pageHeader.props().button.props.children
        expect(empty.type).toEqual('div')
        expect(startSnapshot.props.children).toBe(undefined)
      })
      it('does not render the screenings table', () => {
        const component = renderHomePage({canSeeHotline: true})
        expect(component.find('ScreeningsTable').exists()).toBe(false)
      })
      describe('#componentDidMount', () => {
        it('does not fetch screenings', () => {
          const fetchScreenings = jasmine.createSpy('fetchScreenings')
          renderHomePageWithLifecycle({canSeeHotline: true, actions: {fetchScreenings}})
          expect(fetchScreenings).not.toHaveBeenCalled()
        })
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

    describe('when the user has snapshot permissions only', () => {
      it('passes one button to the screening header', () => {
        const component = renderHomePage({canSeeSnapshot: true}).find('Connect(PageHeader)')
        const pageHeader = component.find('Connect(PageHeader)')
        const [startScreening, empty] = pageHeader.props().button.props.children
        expect(startScreening.props.children).toEqual(undefined)
        expect(empty.type).toEqual('div')
      })
    })
    describe('when the user has hotline permissions only', () => {
      it('passes one button to the screening header', () => {
        const component = renderHomePage({canSeeHotline: true}).find('Connect(PageHeader)')
        const pageHeader = component.find('Connect(PageHeader)')
        const [startScreening, empty] = pageHeader.props().button.props.children
        expect(startScreening.props.children).toEqual('Start Screening')
        expect(empty.type).toEqual('div')
      })
    })
  })
})
