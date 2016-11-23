import Immutable from 'immutable'
import React from 'react'
import {browserHistory} from 'react-router'
import {PersonNewPage} from 'components/people/PersonNewPage'
import {shallow} from 'enzyme'

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
      expect(component.find('SelectField[label="Suffix"]').length).toEqual(1)
      expect(component.find('DateField[label="Date of birth"]').length).toEqual(1)
      expect(component.find('SelectField[label="Gender"]').length).toEqual(1)
      expect(component.find('InputField[label="Social security number"]').length).toEqual(1)
      expect(component.find('InputField[label="Address"]').length).toEqual(1)
      expect(component.find('InputField[label="City"]').length).toEqual(1)
      expect(component.find('SelectField[label="State"]').length).toEqual(1)
      expect(component.find('InputField[label="Zip"]').length).toEqual(1)
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
      const personProps = {first_name: 'Bart'}
      const props = {
        person: Immutable.Map(),
        actions: {createPerson: createPerson}
      }
      component = shallow(<PersonNewPage {...props} />)
      component.setState({person: Immutable.fromJS(personProps)})
      component.find('button.btn-primary').simulate('click')
      expect(createPerson).toHaveBeenCalledWith({person: personProps})
    })

    it('redirects to show', () => {
      const props = {
        person: Immutable.fromJS({id: 1}),
        actions: {createPerson: createPerson}
      }
      component = shallow(<PersonNewPage {...props} />)
      component.find('button.btn-primary').simulate('click')
      expect(browserHistory.push).toHaveBeenCalledWith({pathname: '/people/1'})
    })
  })
})
