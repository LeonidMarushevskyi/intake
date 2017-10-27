import React from 'react'
import {shallow} from 'enzyme'
import ShowField from 'common/ShowField'

describe('ShowField', () => {
  let component
  let formField

  const requiredProps = {
    gridClassName: 'myWrapperTest',
    labelClassName: 'myLabelTest',
    label: 'this is my label',
  }

  beforeEach(() => {
    component = shallow(
      <ShowField {...requiredProps}>This is the show field value</ShowField>
    )
    formField = component.find('FormField')
  })

  it('passes props to the FormField', () => {
    expect(formField.props().labelClassName).toEqual('myLabelTest')
    expect(formField.props().gridClassName).toEqual('myWrapperTest')
    expect(formField.props().label).toEqual('this is my label')
    expect(formField.childAt(0).node.type).toEqual('span')
  })

  it('renders the show field value', () => {
    expect(component.find('span').text()).toEqual('This is the show field value')
  })
})

describe('when field is required and has errors', () => {
  it('renders the label as required', () => {
    const props = {
      label: 'this is my label',
      required: true,
      errors: ['Error 1', 'Error 2'],
    }
    const component = shallow(<ShowField {...props} >show field value</ShowField>)
    const formField = component.find('FormField')
    expect(formField.props().required).toEqual(true)
    expect(formField.props().errors).toEqual(['Error 1', 'Error 2'])
  })
})
