import Immutable from 'immutable'
import React from 'react'
import {PersonEditPage} from 'components/people/PersonEditPage'
import {browserHistory} from 'react-router'
import {shallow, mount} from 'enzyme'

describe('PersonEditPage', () => {
  let component
  describe('render', () => {
    beforeEach(() => {
      const actionsSpy = {
        fetchPerson: () => null,
      }
      const props = {
        params: {id: 1},
        person: Immutable.Map(),
        actions: actionsSpy,
      }
      component = shallow(<PersonEditPage {...props} />)
      component.setState({
        person: Immutable.fromJS({
          id: 1,
          first_name: 'Kevin',
          middle_name: 'Culkin',
          last_name: 'McCallister',
          name_suffix: 'phd',
          gender: 'male',
          date_of_birth: '11/16/1990',
          ssn: '111223333',
          languages: [],
        }),
      })
    })

    it('renders the card header', () => {
      expect(component.find('.card-header').text()).toEqual('Edit Basic Demographics Card')
    })

    it('renders the person input fields', () => {
      expect(component.find('InputField[label="First Name"]').props().value).toEqual('Kevin')
      expect(component.find('InputField[label="Middle Name"]').props().value).toEqual('Culkin')
      expect(component.find('InputField[label="Last Name"]').props().value).toEqual('McCallister')
      expect(component.find('DateField[label="Date of birth"]').props().value).toEqual('11/16/1990')
      expect(component.find('InputField[label="Social security number"]').props().value).toEqual('111223333')
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

    describe('suffix', () => {
      it('renders a select field', () => {
        expect(component.find('SelectField[label="Suffix"]').props().value).toEqual('phd')
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
        expect(component.find('PhoneNumbersEditView').props().phoneNumbers).toEqual(Immutable.List())
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
        expect(component.find('SelectField[label="Gender"]').props().value).toEqual('male')
      })

      it('change event calls setField with gender', () => {
        const instance = component.instance()
        spyOn(instance, 'setField')
        component.find('SelectField[label="Gender"]')
          .simulate('change', {target: {value: 'female'}})
        expect(instance.setField).toHaveBeenCalledWith(['gender'], 'female')
      })
    })

    describe('Addresses', () => {
      it('renders an address edit view', () => {
        expect(component.find('AddressEditView').props().addresses).toEqual(Immutable.List())
      })

      it('change event calls setField with addresses', () => {
        const instance = component.instance()
        spyOn(instance, 'setField')
        component.find('AddressEditView')
          .simulate('change', Immutable.List())
        expect(instance.setField).toHaveBeenCalledWith(
          ['addresses'], Immutable.List()
        )
      })
    })

    it('renders the save button', () => {
      expect(component.find('button.btn-primary').text()).toEqual('Save')
    })

    it('renders the cancel link', () => {
      expect(component.find('Link').html()).toContain('Cancel')
      expect(component.find('Link').props().to).toEqual('/people/1')
    })
  })

  describe('componentDidMount', () => {
    it('dispatches fetchPerson', () => {
      const actionsSpy = {
        fetchPerson: jasmine.createSpy('fetchPerson'),
      }
      const props = {
        params: {id: 1},
        person: Immutable.Map(),
        actions: actionsSpy,
      }
      component = mount(<PersonEditPage {...props} />)
      expect(actionsSpy.fetchPerson).toHaveBeenCalledWith(1)
    })
  })

  describe('update', () => {
    let actionsSpy
    beforeEach(() => {
      actionsSpy = {
        fetchPerson: jasmine.createSpy('fetchPerson'),
        updatePerson: jasmine.createSpy('updatePerson'),
      }
      const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
      promiseSpyObj.then.and.callFake((then) => then())
      actionsSpy.updatePerson.and.returnValue(promiseSpyObj)
      spyOn(browserHistory, 'push')

      const props = {
        params: {id: 1},
        person: Immutable.Map({id: 1, first_name: 'Bart'}),
        actions: actionsSpy,
      }
      component = shallow(<PersonEditPage {...props} />)
    })

    it('dispatches updatePerson', () => {
      component.find('InputField[label="First Name"]').simulate('change', {target: {value: 'Lisa'}})
      component.find('button.btn-primary').simulate('click')
      expect(actionsSpy.updatePerson).toHaveBeenCalled()
      expect(actionsSpy.updatePerson.calls.argsFor(0)[0].first_name).toEqual('Lisa')
    })

    it('redirects to show', () => {
      component.find('button.btn-primary').simulate('click')
      expect(browserHistory.push).toHaveBeenCalledWith({pathname: '/people/1'})
    })
  })
})
