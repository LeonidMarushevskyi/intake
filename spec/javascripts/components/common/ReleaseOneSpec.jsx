import React from 'react'
import {shallow} from 'enzyme'
import ReleaseOne from 'common/ReleaseOne'

describe('ReleaseOne', () => {
  function renderReleaseOne() {
    return shallow(<ReleaseOne />, {disableLifecycleMethods: true})
  }
  it('renders a people label', () => {
    const component = renderReleaseOne()
      .find('label')
    expect(component.text()).toEqual('People')
  })
  it('renders an autocompleter', () => {
    const component = renderReleaseOne()
      .find('Autocompleter')
    expect(component.exists()).toEqual(true)
    expect(component.props().id).toEqual('people')
    expect(component.props().results).toEqual([])
    expect(component.props().total).toEqual(0)
  })
})
