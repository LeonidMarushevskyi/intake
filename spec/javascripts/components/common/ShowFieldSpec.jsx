import React from 'react'
import {shallow} from 'enzyme'
import ShowField from 'components/common/ShowField'
import Immutable from 'immutable'

describe('ShowField', () => {
  let component
  let fieldLabel

  const requiredProps = {
    gridClassName: 'myWrapperTest',
    labelClassName: 'myLabelTest',
    label: 'this is my label',
  }

  describe('without required flag or errors', () => {
    beforeEach(() => {
      component = shallow(
        <ShowField {...requiredProps}>This is the show field value</ShowField>
      )
      fieldLabel = component.find('FieldLabel')
    })

    it('renders the wrapperClass', () => {
      expect(component.html()).toContain('class="myWrapperTest"')
    })

    it('renders the label', () => {
      expect(fieldLabel.props().label).toEqual('this is my label')
      expect(fieldLabel.props().classes).toContain('myLabelTest')
      expect(fieldLabel.props().required).toBeFalsy()
    })

    it('renders the show field value', () => {
      const valueElement = component.find('div[className="c-gray"]')
      expect(valueElement.length).toEqual(1)
      expect(valueElement.text()).toEqual('This is the show field value')
    })

    it('does not render the label as if it has an error', () => {
      expect(fieldLabel.props().hasError).toBeFalsy()
    })

    it('renders ErrorMessages but with no errors', () => {
      expect(component.find('ErrorMessages').props().errors).toEqual(undefined)
    })
  })

  describe('when field is required', () => {
    it('renders the label as required', () => {
      component = shallow(
        <ShowField {...requiredProps} required>This is the show field value</ShowField>
      )
      fieldLabel = component.find('FieldLabel')
      expect(fieldLabel.props().classes).toContain('myLabelTest')
      expect(fieldLabel.props().required).toEqual(true)
    })
  })

  describe('when ShowField has errors', () => {
    beforeEach(() => {
      const props = {
        ...requiredProps,
        errors: Immutable.List(['Error 1', 'Error 2']),
      }
      component = shallow(
        <ShowField {...props}>This is the show field value</ShowField>
      )
      fieldLabel = component.find('FieldLabel')
    })

    it('renders the label as an error label', () => {
      expect(fieldLabel.props().classes).toContain('myLabelTest')
      expect(fieldLabel.props().required).toBeFalsy()
      expect(fieldLabel.props().hasError).toEqual(true)
    })

    it('renders ErrorMessages and pass it errors', () => {
      expect(component.find('ErrorMessages').exists()).toEqual(true)
      expect(component.find('ErrorMessages').props().errors).toEqual(Immutable.List(['Error 1', 'Error 2']))
    })
  })
})

