import {App} from 'common/App'
import React from 'react'
import {mount} from 'enzyme'

describe('App', () => {
  it('fetches the system codes when the component mounts', () => {
    const fetch = jasmine.createSpy('fetch')
    mount(<App actions={{fetch}}><div/></App>)
    expect(fetch).toHaveBeenCalled()
  })
})
