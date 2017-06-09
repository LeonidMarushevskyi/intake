import React from 'react'
import {shallow} from 'enzyme'
import ShowField from 'components/common/ShowField'

describe('ShowField', () => {
  let component
  beforeEach(() => {
    const props = {
      gridClassName: 'myWrapperTest',
      labelClassName: 'myLabelTest',
      label: 'this is my label',
    }
    component = shallow(
      <ShowField {...props}>This is the show field value</ShowField>
    )
  })

  it('renders the wrapperClass', () => {
    expect(component.html()).toContain('class="myWrapperTest"')
  })

  it('renders the label', () => {
    const labelElement = component.find('label')
    expect(labelElement.length).toEqual(1)
    expect(component.find('label.myLabelTest').not('.required').exists()).toEqual(true)
    expect(labelElement.text()).toEqual('this is my label')
  })

  it('renders the show field value', () => {
    const valueElement = component.find('div[className="c-gray"]')
    expect(valueElement.length).toEqual(1)
    expect(valueElement.text()).toEqual('This is the show field value')
  })
})

describe('ShowField as required', () => {
  let component
  beforeEach(() => {
    const props = {
      gridClassName: 'myWrapperTest',
      labelClassName: 'myLabelTest',
      label: 'this is my label',
      required: true,
    }
    component = shallow(
      <ShowField {...props}>This is the show field value</ShowField>
    )
  })
  it('renders the label as required', () => {
    expect(component.find('label.required.myLabelTest').exists()).toEqual(true)
  })
})
