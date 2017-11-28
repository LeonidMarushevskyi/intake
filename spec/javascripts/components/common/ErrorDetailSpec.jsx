import React from 'react'
import {shallow} from 'enzyme'
import ErrorDetail from 'common/ErrorDetail'

describe('ErrorDetail', () => {
  it('renders alert icon', () => {
    const component = shallow(<ErrorDetail errors={[]}/>)
    const errorMessageDiv = component.find('div.error-message')
    expect(errorMessageDiv.props().className).toEqual('alert-message error-message')
    expect(errorMessageDiv.props().role).toEqual('alert')
    expect(errorMessageDiv.find('div.alert-icon i.fa.fa-warning').exists()).toEqual(true)
  })
  it('renders alert text', () => {
    const errors = [
      'apple',
      'banana',
      'carrot',
      'dragon fruit',
    ]
    const component = shallow(<ErrorDetail errors={errors}/>)
    const errorDetails = component.find('div.error-message').find('div.alert-text ul')
    expect(errorDetails.exists()).toEqual(true)
    expect(errorDetails.childAt(0).text()).toEqual('apple')
    expect(errorDetails.childAt(1).text()).toEqual('banana')
    expect(errorDetails.childAt(2).text()).toEqual('carrot')
    expect(errorDetails.childAt(3).text()).toEqual('dragon fruit')
  })
})
