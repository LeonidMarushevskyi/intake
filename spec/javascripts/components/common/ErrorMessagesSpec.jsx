import React from 'react'
import Immutable from 'immutable'
import {shallow} from 'enzyme'
import ErrorMessages from 'components/common/ErrorMessages'

describe('ErrorMessages', () => {
  let component
  const requiredProps = {id: 'myInputFieldId'}

  describe('when no errors are passed', () => {
    beforeEach(() => {
      component = shallow(<ErrorMessages {...requiredProps}/>)
    })

    it('does not explode', () => {
      expect(component.find('div').exists()).toEqual(true)
    })

    it('does not render error messages', () => {
      expect(component.find('.input-error-message').exists()).toEqual(false)
    })
  })

  describe('when an empty list is passed for errors', () => {
    const props = {...requiredProps, errors: Immutable.List()}
    beforeEach(() => {
      component = shallow(<ErrorMessages {...props}/>)
    })

    it('does not explode', () => {
      expect(component.find('div').exists()).toEqual(true)
    })

    it('does not render error messages', () => {
      expect(component.find('.input-error-message').exists()).toEqual(false)
    })
  })

  describe('when there are errors', () => {
    const errorProp = {errors: Immutable.fromJS(['You have failed this city', 'Stick to the plan!'])}
    describe('when id is passed', () => {
      beforeEach(() => {
        const props = {...requiredProps, ...errorProp}
        component = shallow(<ErrorMessages {...props}/>)
      })

      it('adds an aria-describedby prop', () => {
        expect(component.find(".input-error-message[aria-describedby='myInputFieldId']").length).toEqual(2)
      })

      it('adds a role prop', () => {
        expect(component.find(".input-error-message[role='alert']").length).toEqual(2)
      })

      it('displays error messages', () => {
        expect(component.find('.input-error-message').length).toEqual(2)
        expect(component.find('.input-error-message').first().text()).toEqual('You have failed this city')
        expect(component.find('.input-error-message').last().text()).toEqual('Stick to the plan!')
      })
    })

    describe('when id is not passed', () => {
      beforeEach(() => {
        component = shallow(<ErrorMessages {...errorProp}/>)
      })

      it('does not add an aria-describedby prop', () => {
        expect(component.first('.input-error-message').html()).not.toContain('aria-describedby')
      })

      it('adds a role prop', () => {
        expect(component.find(".input-error-message[role='alert']").length).toEqual(2)
      })

      it('displays error messages', () => {
        expect(component.find('.input-error-message').length).toEqual(2)
        expect(component.find('.input-error-message').first().text()).toEqual('You have failed this city')
        expect(component.find('.input-error-message').last().text()).toEqual('Stick to the plan!')
      })
    })
  })
})
