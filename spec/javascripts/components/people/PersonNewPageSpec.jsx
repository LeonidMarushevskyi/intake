import Immutable from 'immutable'
import React from 'react'
import {PersonNewPage} from 'components/people/PersonNewPage'
import {shallow} from 'enzyme'
import {browserHistory} from 'react-router'

describe('PersonNewPage', () => {
  let component

  describe('render', () => {
    beforeEach(() => {
      const props = {
        person: Immutable.Map(),
        actions: {},
      }
      component = shallow(<PersonNewPage {...props} />)
    })

    it('renders the card header', () => {
      expect(component.find('.card-header').text()).toEqual('Basic Demographics card')
    })

    it('renders the person input fields', () => {
      expect(component.find('InputField[label="First Name"]').length).toEqual(1)
      expect(component.find('InputField[label="Middle Name"]').length).toEqual(1)
      expect(component.find('InputField[label="Last Name"]').length).toEqual(1)
      expect(component.find('DateField[label="Date of birth"]').length).toEqual(1)
      expect(component.find('InputField[label="Social security number"]').length).toEqual(1)
      expect(component.find('InputField[label="Address"]').length).toEqual(1)
      expect(component.find('InputField[label="City"]').length).toEqual(1)
      expect(component.find('InputField[label="Zip"]').length).toEqual(1)
    })

    describe('suffix', () => {
      it('renders a select field', () => {
        expect(component.find('SelectField[label="Suffix"]').length).toEqual(1)
      })

      it('change event calls setField with suffix', () => {
        const instance = component.instance()
        spyOn(instance, 'setField')
        component.find('SelectField[label="Suffix"]')
          .simulate('change', {target: {value: 'Jr'}})
        expect(instance.setField).toHaveBeenCalledWith(['name_suffix'], 'Jr')
      })
    })

    describe('phone numbers', () => {
      it('renders a phone number edit view', () => {
        expect(component.find('PhoneNumbersEditView').length).toEqual(1)
      })

      it('change event calls setField with phone numbers', () => {
        const instance = component.instance()
        spyOn(instance, 'setField')
        component.find('PhoneNumbersEditView')
          .simulate('change', Immutable.List())
        expect(instance.setField).toHaveBeenCalledWith(
          ['phone_numbers'], Immutable.List()
        )
      })
    })

    describe('gender', () => {
      it('renders a select field', () => {
        expect(component.find('SelectField[label="Gender"]').length).toEqual(1)
      })

      it('change event calls setField with gender', () => {
        const instance = component.instance()
        spyOn(instance, 'setField')
        component.find('SelectField[label="Gender"]')
          .simulate('change', {target: {value: 'female'}})
        expect(instance.setField).toHaveBeenCalledWith(['gender'], 'female')
      })
    })

    describe('address state', () => {
      it('renders a select field', () => {
        expect(component.find('SelectField[label="State"]').length).toEqual(1)
      })

      it('change event calls setField with state', () => {
        const instance = component.instance()
        spyOn(instance, 'setField')
        component.find('SelectField[label="State"]')
          .simulate('change', {target: {value: 'New York'}})
        expect(instance.setField).toHaveBeenCalledWith(['address', 'state'], 'New York')
      })
    })

    describe('languages', () => {
      it('renders the language field', () => {
        expect(component.find('Select[multi]').length).toEqual(1)
        expect(component.find('Select[multi]').props().inputProps.id).toEqual('languages')
        expect(component.find('Select[multi]').props().value).toEqual([])
      })

      it('renders the language field after changes', () => {
        const newSelectedLanguages = [
          {label: 'Farsi', value: 'farsi'},
          {label: 'English', value: 'english'},
        ]
        component.find('Select[multi]').simulate('change', newSelectedLanguages)
        expect(component.find('Select[multi]').props().value).toEqual(['farsi', 'english'])
      })
    })

    describe('address type', () => {
      it('renders a select field', () => {
        expect(component.find('SelectField[label="Address Type"]').length).toEqual(1)
      })

      it('change event calls setField with address type', () => {
        const instance = component.instance()
        spyOn(instance, 'setField')
        component.find('SelectField[label="Address Type"]')
          .simulate('change', {target: {value: 'Placement'}})
        expect(instance.setField).toHaveBeenCalledWith(['address', 'type'], 'Placement')
      })
    })

    it('renders the save button', () => {
      expect(component.find('button').length).toEqual(1)
    })
  })

  describe('save', () => {
    let createPerson

    beforeEach(() => {
      createPerson = jasmine.createSpy('createPerson')
      const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
      promiseSpyObj.then.and.callFake((then) => then())
      createPerson.and.returnValue(promiseSpyObj)
      spyOn(browserHistory, 'push')
    })

    it('dispatches createPerson', () => {
      const props = {
        person: Immutable.Map(),
        actions: {createPerson: createPerson},
      }
      component = shallow(<PersonNewPage {...props} />)
      component.find('InputField[label="First Name"]').simulate('change', {target: {value: 'Bart'}})
      component.find('button.btn-primary').simulate('click')
      expect(createPerson).toHaveBeenCalled()
      expect(createPerson.calls.argsFor(0)[0].person.first_name).toEqual('Bart')
    })

    it('redirects to show', () => {
      const props = {
        person: Immutable.fromJS({id: 1}),
        actions: {createPerson: createPerson},
      }
      component = shallow(<PersonNewPage {...props} />)
      component.find('button.btn-primary').simulate('click')
      expect(browserHistory.push).toHaveBeenCalledWith({pathname: '/people/1'})
    })
  })
})
