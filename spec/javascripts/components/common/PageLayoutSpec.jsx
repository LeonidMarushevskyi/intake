import {PageLayout} from 'common/PageLayout'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('PageLayout', () => {
  function renderLayout({
    actions = {},
    hasError = null,
    pageHeaderDetails = {},
  }) {
    return shallow(
      <PageLayout hasError={hasError} actions={actions}
        pageHeaderDetails={pageHeaderDetails}
      ><span id='child'/></PageLayout>
    )
  }

  it('fetches the system codes when the component mounts', () => {
    const fetchSystemCodesActionSpy = jasmine.createSpy('fetchSystemCodesAction')
    mount(
      <PageLayout
        actions={{fetchSystemCodesAction: fetchSystemCodesActionSpy}}
        pageHeaderDetails={{pageHeaderTitle: ''}}
      ><div/></PageLayout>
    )
    expect(fetchSystemCodesActionSpy).toHaveBeenCalled()
  })

  describe('PageHeader', () => {
    let layoutComponent
    beforeEach(() => {
      layoutComponent = renderLayout({pageHeaderDetails: {
        pageHeaderButtonText: 'Start Screening',
        pageHeaderHasButton: true,
        pageHeaderLocation: 'dashboard',
        pageHeaderTitle: 'Dashboard',
      }})
    })

    it('renders the page header title', () => {
      expect(layoutComponent.find('PageHeader').props().pageTitle).toEqual('Dashboard')
    })

    it('renders the page header button', () => {
      expect(layoutComponent.html()).toContain(
        '<button type="button" class="btn primary-btn pull-right">Start Screening</button>'
      )
    })

    describe('Button', () => {
      it('calls the button callback', () => {
        const pageHeaderButtonOnClick = jasmine.createSpy('pageHeaderButtonOnClick')
        const pageHeaderDetails = {
          pageHeaderButtonText: 'Start Screening', pageHeaderHasButton: true,
          pageHeaderLocation: 'dashboard', pageHeaderTitle: 'Dashboard',
          pageHeaderButtonOnClick,
        }
        layoutComponent = mount(
          <PageLayout pageHeaderDetails={pageHeaderDetails} actions={{fetchSystemCodesAction: () => {}}}>
            <span id='child'/>
          </PageLayout>)
        layoutComponent.find('button').simulate('click')
        expect(pageHeaderButtonOnClick).toHaveBeenCalled()
      })
    })

    it('does not render a button at the page header', () => {
      layoutComponent = renderLayout({pageHeaderDetails: {pageHeaderHasButton: false, pageHeaderTitle: ''}})
      expect(layoutComponent.html()).not.toContain('button')
    })
  })

  it('renders its children', () => {
    const layoutComponent = renderLayout({actions: {}})
    expect(layoutComponent.find('#child').exists()).toBe(true)
  })

  describe('error banner', () => {
    it('is not rendered when no errors', () => {
      const component = renderLayout({hasError: false})
      expect(component.find('PageError').exists()).toEqual(false)
    })
    it('is rendered when generic error occurs', () => {
      const component = renderLayout({hasError: true})
      expect(component.find('PageError').exists()).toEqual(true)
    })
    it('is rendered when pageErrorMessage exists', () => {
      const component = renderLayout({hasError: true, pageErrorMessage: 'pageErrorMessage'})
      expect(component.find('PageError').exists()).toEqual(true)
    })
  })
})
