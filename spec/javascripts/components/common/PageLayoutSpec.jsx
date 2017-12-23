import {PageLayout} from 'common/PageLayout'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('PageLayout', () => {
  function renderLayout({
    actions = {},
    errorCount = null,
    hasError = null,
    pageHeaderDetails = {},
  }) {
    return shallow(
      <PageLayout errorCount={errorCount} hasError={hasError} actions={actions}
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

    describe('Start Screening Button', () => {
      it('calls the create screening action', () => {
        const createScreening = jasmine.createSpy('createScreening')
        const fetchSystemCodesAction = jasmine.createSpy('fetchSystemCodesAction')
        const pageHeaderDetails = {
          pageHeaderButtonText: 'Start Screening', pageHeaderHasButton: true,
          pageHeaderLocation: 'dashboard', pageHeaderTitle: 'Dashboard',
        }
        layoutComponent = mount(
          <PageLayout actions={{createScreening, fetchSystemCodesAction}}
            pageHeaderDetails={pageHeaderDetails}
          >
            <span id='child'/>
          </PageLayout>)
        layoutComponent.find('button').simulate('click')
        expect(createScreening).toHaveBeenCalled()
      })
    })

    describe('Submit Screening Button', () => {
      it('calls the submit screening action', () => {
        const submitScreening = jasmine.createSpy('submitScreening')
        const fetchSystemCodesAction = jasmine.createSpy('fetchSystemCodesAction')
        const pageHeaderDetails = {
          pageHeaderButtonText: 'Start Screening', pageHeaderHasButton: true,
          pageHeaderLocation: 'screening', pageHeaderTitle: 'Screening 1',
        }
        layoutComponent = mount(
          <PageLayout actions={{submitScreening, fetchSystemCodesAction}}
            pageHeaderDetails={pageHeaderDetails} params={{id: 1}}
          >
            <span id='child'/>
          </PageLayout>)
        layoutComponent.find('button').simulate('click')
        expect(submitScreening).toHaveBeenCalled()
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
      const component = renderLayout({hasError: false, errorCount: 0})
      expect(component.find('PageError').exists()).toEqual(false)
    })
    describe('generic errors', () => {
      it('is rendered when generic error occurs', () => {
        const component = renderLayout({hasError: true})
        expect(component.find('PageError').exists()).toEqual(true)
      })
    })
    describe('countable errors', () => {
      it('is rendered when errors count is passed', () => {
        const component = renderLayout({hasError: true, errorCount: 15})
        expect(component.find('PageError').exists()).toEqual(true)
        expect(component.find('PageError').props().errorCount).toEqual(15)
      })
    })
  })
})
