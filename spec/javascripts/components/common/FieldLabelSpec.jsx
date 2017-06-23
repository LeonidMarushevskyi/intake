import React from 'react'
import {shallow} from 'enzyme'
import FieldLabel from 'components/common/FieldLabel'

describe('FieldLabel', () => {
  let component

  describe('when id is passed', () => {
    it('renders the label with for', () => {
      component = shallow(<FieldLabel label={'thing2'} id={'thing1'}/>)
      expect(component.find('label').html())
        .toContain('for="thing1"')
    })
  })

  describe('when no classes passed', () => {
    it('renders the label', () => {
      component = shallow(<FieldLabel label={'I want a label maker'}/>)
      expect(component.find('label').text()).toEqual('I want a label maker')
    })
  })

  describe('when classes are passed', () => {
    const props = {
      label: 'Do not judge a component by its label',
      classes: [
        {'working-class': true},
        {'high-class': false},
        {'i-should-not-exist': null},
        undefined,
        'object-oriendted-class',
      ],
    }

    it('renders the label with the classes', () => {
      component = shallow(<FieldLabel {...props}/>)
      expect(component.find('label').props().className)
        .toEqual('working-class object-oriendted-class')
    })

    it('renders as error if hasError is passed', () => {
      component = shallow(<FieldLabel {...props} hasError/>)
      expect(component.find('label').props().className)
        .toEqual('working-class object-oriendted-class input-error-label')
    })

    it('renders as required if required is passed', () => {
      component = shallow(<FieldLabel {...props} required/>)
      expect(component.find('label').props().className)
        .toEqual('working-class object-oriendted-class required')
    })

    it('renders as error and required if both hasError and required are passed', () => {
      component = shallow(<FieldLabel {...props} hasError required/>)
      expect(component.find('label').props().className)
        .toEqual('working-class object-oriendted-class input-error-label required')
    })
  })

  describe('when an empty array is passed for classes', () => {
    const props = {label: 'I like to be labeled', classes: []}
    beforeEach(() => {
      component = shallow(<FieldLabel {...props}/>)
    })
    it('renders the label', () => {
      expect(component.find('label').text()).toEqual('I like to be labeled')
    })

    it('does not render any classes', () => {
      expect(component.find('label').props().className).toEqual('')
    })
  })
})
