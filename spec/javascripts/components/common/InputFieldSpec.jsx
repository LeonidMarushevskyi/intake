import React from 'react'
import {shallow} from 'enzyme'
import InputField from 'components/common/InputField'

describe('InputField', () => {
  let component
  const onChange = jasmine.createSpy('onChange')
  const props = {
    gridClassName: 'myWrapperTest',
    labelClassName: 'myLabelTest',
    id: 'myInputFieldId',
    label: 'this is my label',
    placeholder: 'This is some placeholder text...',
    onChange: onChange,
    value: 'this is my field value',
  }
  beforeEach(() => {
    component = shallow(<InputField {...props}/>)
  })

  it('renders the wrapperClass', () => {
    expect(component.html()).toContain('class="myWrapperTest"')
  })

  it('renders the id', () => {
    expect(component.find('input').props().id).toEqual('myInputFieldId')
    expect(component.find('label').props().htmlFor).toEqual('myInputFieldId')
  })

  it('renders the label', () => {
    const labelElement = component.find('label')
    expect(labelElement.length).toEqual(1)
    expect(labelElement.html()).toContain('<label class="myLabelTest"')
    expect(labelElement.text()).toEqual('this is my label')
  })

  it('renders the input placeholder', () => {
    const inputElement = component.find('input')
    expect(inputElement.props().placeholder).toEqual('This is some placeholder text...')
  })

  it('renders the input value', () => {
    const inputElement = component.find('input')
    expect(inputElement.props().value).toEqual('this is my field value')
  })

  it('renders the input type', () => {
    const inputElement = component.find('input')
    const inputElementWithType = shallow(
      <InputField {...props} type='tel'/>
    ).find('input')

    expect(inputElement.props().type).toEqual('text')
    expect(inputElementWithType.props().type).toEqual('tel')
  })

  it('calls onChange when a change event occurs on input field', () => {
    const inputElement = component.find('input')
    inputElement.simulate('change')
    expect(onChange).toHaveBeenCalled()
  })

  describe('when mask is NOT passed in', () => {
    const props = {
      gridClassName: 'myWrapperTest',
      labelClassName: 'myLabelTest',
      id: 'myInputFieldId',
      label: 'this is my label',
      onChange: onChange,
    }

    beforeEach(() => {
      component = shallow(<InputField {...props}/>)
    })
    it('renders an input field', () => {
      const maskedInput = component.find('MaskedInput')
      expect(maskedInput.length).toEqual(0)
    })
  })

  describe('when mask is passed in', () => {
    const propsWithMaskedInput = {
      gridClassName: 'myWrapperTest',
      labelClassName: 'myLabelTest',
      id: 'myInputFieldId',
      label: 'this is my label',
      onChange: onChange,
      mask: '111-111-1111',
    }

    beforeEach(() => {
      component = shallow(<InputField {...propsWithMaskedInput}/>)
    })
    it('renders a MaskedInput field', () => {
      const inputElement = component.find('MaskedInput')
      expect(inputElement.props().mask).toEqual('111-111-1111')
    })
  })
})
