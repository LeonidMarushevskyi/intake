import React from 'react'
import {SnapshotPage} from 'snapshots/SnapshotPage'
import {shallow} from 'enzyme'

describe('SnapshotPage', () => {
  const renderSnapshotPage = ({participants = [], ...args}) => {
    const props = {participants, ...args}
    return shallow(<SnapshotPage {...props} />, {disableLifecycleMethods: true})
  }

  it('renders history of involvement', () => {
    const snapshotPage = renderSnapshotPage({})
    expect(snapshotPage.find('Connect(HistoryOfInvolvement)').exists()).toBe(true)
  })

  it('renders person search', () => {
    const snapshotPage = renderSnapshotPage({})
    expect(snapshotPage.find('Connect(PersonSearchForm)').exists()).toBe(true)
  })

  it('renders a person card for each participant', () => {
    const snapshotPage = renderSnapshotPage({participants: [{id: '3'}, {id: '5'}]})
    expect(snapshotPage.find('PersonCardView').length).toEqual(2)
  })

  it('passes the page title to the header', () => {
    const snapshotPage = renderSnapshotPage({})
    expect(snapshotPage.find('Connect(PageHeader)').exists()).toBe(true)
    expect(snapshotPage.find('Connect(PageHeader)').props().pageTitle).toEqual('Snapshot')
  })

  it('passes a null button to the page header so it does not render the default button', () => {
    const snapshotPage = renderSnapshotPage({})
    expect(snapshotPage.find('Connect(PageHeader)').props().button.type).toEqual('button')
  })

  it('calls the unmount function when the component is unmounted', () => {
    const unmount = jasmine.createSpy('unmount')
    const snapshotPage = renderSnapshotPage({unmount})
    snapshotPage.unmount()
    expect(unmount).toHaveBeenCalled()
  })
})
