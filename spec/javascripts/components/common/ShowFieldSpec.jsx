import React from 'react'
import {shallow} from 'enzyme'
import ShowField from 'components/common/ShowField'
import Immutable from 'immutable'

describe('ShowField', () => {
  let component

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

    it('does not render errors', () => {
      expect(component.find('.input-error-message').length).toEqual(0)
      expect(component.find('.input-error-label').length).toEqual(0)
    })
  })

  describe('ShowField as required', () => {
    beforeEach(() => {
      const props = {
        ...requiredProps,
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

  describe('when ShowField has errors', () => {
    beforeEach(() => {
      const props = {
        ...requiredProps,
        errors: Immutable.List(['Error 1', 'Error 2']),
      }
      component = shallow(
        <ShowField {...props}>This is the show field value</ShowField>
      )
    })

    it('renders the label as an error label', () => {
      expect(component.find('.input-error-label').length).toEqual(1)
    })

    it('renders errors', () => {
      expect(component.find('.input-error-message').length).toEqual(2)
      expect(component.text()).toContain('Error 1')
      expect(component.text()).toContain('Error 2')
    })
  })
})

