import Immutable from 'immutable'
import React from 'react'
import {PersonNewPage} from 'people/PersonNewPage'
import {shallow} from 'enzyme'

describe('PersonNewPage', () => {
  let component

  describe('render', () => {
    beforeEach(() => {
      const props = {
        person: Immutable.Map(),
        actions: {},
        router: {},
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

    describe('addresses ', () => {
      it('renders a address edit view', () => {
        expect(component.find('AddressesEditView').length).toEqual(1)
      })

      it('change event calls setField with addresses', () => {
        const instance = component.instance()
        spyOn(instance, 'setField')
        component.find('AddressesEditView')
          .simulate('change', Immutable.List())
        expect(instance.setField).toHaveBeenCalledWith(
          ['addresses'], Immutable.List()
        )
      })
    })

    describe('races', () => {
      it('renders the RacesEditView', () => {
        expect(component.find('RacesEditView').length).toEqual(1)
      })

      it('change event calls setField with races', () => {
        const races = Immutable.List([{race: 'White'}, {race: 'Asian'}])
        const instance = component.instance()
        spyOn(instance, 'setField')
        component.find('RacesEditView')
          .simulate('change', races)
        expect(instance.setField).toHaveBeenCalledWith(['races'], races)
      })
    })

    describe('ethnicity', () => {
      it('renders the EthnicityEditView', () => {
        expect(component.find('EthnicityEditView').length).toEqual(1)
      })

      it('change event calls setField with ethnicity', () => {
        const ethnicity = Immutable.Map({hispanic_latino_origin: 'Yes'})
        const instance = component.instance()
        spyOn(instance, 'setField')
        component.find('EthnicityEditView')
          .simulate('change', ethnicity)
        expect(instance.setField).toHaveBeenCalledWith(['ethnicity'], ethnicity)
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
    })

    it('dispatches createPerson', () => {
      const router = jasmine.createSpyObj('routerSpy', ['push'])
      const props = {
        person: Immutable.Map(),
        actions: {createPerson: createPerson},
        router,
      }
      component = shallow(<PersonNewPage {...props} />)
      component.find('InputField[label="First Name"]').simulate('change', {target: {value: 'Bart'}})
      component.find('button.btn-primary').simulate('click')
      expect(createPerson.calls.argsFor(0)[0].first_name).toEqual('Bart')
    })

    it('redirects to show', () => {
      const router = jasmine.createSpyObj('routerSpy', ['push'])
      const props = {
        person: Immutable.fromJS({id: '1'}),
        actions: {createPerson: createPerson},
        router,
      }
      component = shallow(<PersonNewPage {...props} />)
      component.find('button.btn-primary').simulate('click')
      expect(router.push).toHaveBeenCalledWith({pathname: '/people/1'})
    })
  })
})
