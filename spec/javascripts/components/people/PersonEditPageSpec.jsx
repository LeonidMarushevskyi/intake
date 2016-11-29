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
    })

    it('renders the card header', () => {
      expect(component.find('.card-header').text()).toEqual('Edit Basic Demographics Card')
    })

    it('renders the person input fields', () => {
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
          address: {
            id: 2,
            street_address: '671 Lincoln Avenue',
            city: 'Winnetka',
            state: 'IL',
            zip: 60093,
          },
        }),
      })

      expect(component.find('InputField[label="First Name"]').props().value).toEqual('Kevin')
      expect(component.find('InputField[label="Middle Name"]').props().value).toEqual('Culkin')
      expect(component.find('InputField[label="Last Name"]').props().value).toEqual('McCallister')
      expect(component.find('SelectField[label="Suffix"]').props().value).toEqual('phd')
      expect(component.find('DateField[label="Date of birth"]').props().value).toEqual('11/16/1990')
      expect(component.find('SelectField[label="Gender"]').props().value).toEqual('male')
      expect(component.find('InputField[label="Social security number"]').props().value).toEqual('111223333')
      expect(component.find('InputField[label="Address"]').props().value).toEqual('671 Lincoln Avenue')
      expect(component.find('InputField[label="City"]').props().value).toEqual('Winnetka')
      expect(component.find('SelectField[label="State"]').props().value).toEqual('IL')
      expect(component.find('InputField[label="Zip"]').props().value).toEqual(60093)
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
      component = mount(<PersonEditPage {...props} />)
    })

    it('dispatches updatePerson', () => {
      const updatedPersonProps = {id: 1, first_name: 'Lisa'}
      component.setState({person: Immutable.fromJS(updatedPersonProps)})
      component.find('button.btn-primary').simulate('click')
      expect(actionsSpy.updatePerson).toHaveBeenCalledWith({person: updatedPersonProps})
    })

    it('redirects to show', () => {
      component.find('button.btn-primary').simulate('click')
      expect(browserHistory.push).toHaveBeenCalledWith({pathname: '/people/1'})
    })
  })
})
