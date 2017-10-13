import React from 'react'
import {shallow} from 'enzyme'
import ErrorMessages from 'common/ErrorMessages'

describe('ErrorMessages', () => {
  let component

  describe('when no errors are passed', () => {
    beforeEach(() => {
      component = shallow(<ErrorMessages id={'myInputFieldId'}/>)
    })

    it('renders the div wrapper', () => {
      expect(component.find('div').exists()).toEqual(true)
    })

    it('does not render error messages', () => {
      expect(component.find('.input-error-message').exists()).toEqual(false)
    })
  })

  describe('when errors is an empty array', () => {
    const props = {id: 'myInputFieldId', errors: []}

    it('does not render error messages', () => {
      component = shallow(<ErrorMessages {...props}/>)
      expect(component.find('.input-error-message').exists()).toEqual(false)
    })
  })

  describe('when there are errors', () => {
    const errors = ['You have failed this city', 'Stick to the plan!']
    describe('when ariaDescribedBy is passed', () => {
      beforeEach(() => {
        const props = {ariaDescribedBy: 'myInputFieldId', errors}
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

    describe('when ariaDescribedBy is not passed', () => {
      beforeEach(() => {
        component = shallow(<ErrorMessages errors={errors}/>)
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
