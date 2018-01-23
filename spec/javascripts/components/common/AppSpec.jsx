import {App} from 'common/App'
import React from 'react'
import {shallow, mount} from 'enzyme'
import * as IntakeConfig from 'common/config'

describe('App', () => {
  beforeEach(() => {
    spyOn(IntakeConfig, 'config').and.returnValue({base_path: 'intake'})
  })

  it('fetches user info when the component mounts', () => {
    const fetchUserInfoActionSpy = jasmine.createSpy('fetchUserInfoAction')
    mount(<App actions={{fetchUserInfoAction: fetchUserInfoActionSpy}}><div/></App>)
    expect(fetchUserInfoActionSpy).toHaveBeenCalled()
  })

  it('renders the global header component on all app views', () => {
    const app = shallow(<App actions={{}}><div/></App>)
    expect(app.find('GlobalHeader').exists()).toBe(true)
  })

  it('renders its children', () => {
    const app = shallow(<App actions={{}}><div/></App>)
    expect(app.find('div').exists()).toBe(true)
  })
})
