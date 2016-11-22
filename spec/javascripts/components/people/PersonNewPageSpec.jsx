import Immutable from 'immutable'
import React from 'react'
import {browserHistory} from 'react-router'
import {PersonNewPage} from 'components/people/PersonNewPage'
import {mount} from 'enzyme'

describe('PersonNewPage', () => {
  let component

  describe('render', () => {
    beforeEach(() => {
      const props = {
        person: Immutable.Map(),
        actions: {},
      }
      component = mount(<PersonNewPage {...props} />)
    })

    it('renders the card header', () => {
      expect(component.find('.card-header').text()).toEqual('Basic Demographics card')
    })

    it('renders the person label fields', () => {
      expect(component.find('label').length).toEqual(9)
      expect(component.find('label').nodes.map((element) => element.textContent)).toEqual([
        'First Name',
        'Last Name',
        'Date of birth',
        'Gender',
        'Social security number',
        'Address',
        'City',
        'State',
        'Zip',
      ])
    })

    it('renders the person input fields', () => {
      expect(component.find('input').length).toEqual(7)
    })

    it('renders the person select fields', () => {
      expect(component.find('select').length).toEqual(2)
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
      component = mount(<PersonNewPage {...props} />)
      component.setState({person: Immutable.fromJS(personProps)})
      component.find('button.btn-primary').simulate('click')
      expect(createPerson).toHaveBeenCalledWith({person: personProps})
    })

    it('redirects to show', () => {
      const props = {
        person: Immutable.fromJS({id: 1}),
        actions: {createPerson: createPerson}
      }
      component = mount(<PersonNewPage {...props} />)
      component.find('button.btn-primary').simulate('click')
      expect(browserHistory.push).toHaveBeenCalledWith({pathname: '/people/1'})
    })
  })
})
