import * as Utils from 'utils/http'
import Immutable from 'immutable'
import PersonEditPage from 'PersonEditPage'
import React from 'react'
import {mount} from 'enzyme'

describe('PersonEditPage', () => {
  let xhrSpyObject
  beforeEach(() => {
    xhrSpyObject = jasmine.createSpyObj('xhrSpyObj', ['done'])
    spyOn(Utils, 'request').and.returnValue(xhrSpyObject)
  })

  describe('render', () => {
    it('renders the card header', () => {
      const props = { params: { id: 1 } }
      const wrapper = mount(<PersonEditPage {...props} />)
      expect(wrapper.find('.card-header').text()).toEqual('Edit Person')
    })

    it('renders the person label fields', () => {
      const props = { params: { id: 1 } }
      const wrapper = mount(<PersonEditPage {...props} />)
      expect(wrapper.find('label').length).toEqual(9)
      expect(wrapper.find('label').nodes.map((element) => element.textContent)).toEqual([
        'First Name',
        'Last Name',
        'Gender',
        'Date of birth',
        'Social security number',
        'Address',
        'City',
        'State',
        'Zip'
      ])
    })

    it('renders the person input fields', () => {
      const props = { params: { id: 1 } }
      const wrapper = mount(<PersonEditPage {...props} />)
      wrapper.setState({
        person: Immutable.fromJS({
          first_name: 'Kevin',
          last_name: 'McCallister',
          gender: 'male',
          date_of_birth: '11/16/1990',
          ssn: '111223333',
          address: {
            street_address:'671 Lincoln Avenue',
            city:'Winnetka',
            state: 'IL',
            zip: 60093,
          },
        }),
      })

      expect(wrapper.find('#first_name').props().value).toEqual('Kevin')
      expect(wrapper.find('#last_name').props().value).toEqual('McCallister')
      expect(wrapper.find('#gender').props().value).toEqual('male')
      expect(wrapper.find('#date_of_birth').props().value).toEqual('11/16/1990')
      expect(wrapper.find('#ssn').props().value).toEqual('111223333')
      expect(wrapper.find('#street_address').props().value).toEqual('671 Lincoln Avenue')
      expect(wrapper.find('#city').props().value).toEqual('Winnetka')
      expect(wrapper.find('#state').props().value).toEqual('IL')
      expect(wrapper.find('#zip').props().value).toEqual(60093)
    })

    it('renders the save button', () => {
      const props = { params: { id: 1 } }
      const wrapper = mount(<PersonEditPage {...props} />)
      expect(wrapper.find('button.btn-primary').text()).toEqual('Save')
    })

    it('renders the cancel link', () => {
      const props = { params: { id: 1 } }
      const wrapper = mount(<PersonEditPage {...props} />)
      expect(wrapper.find('Link').text()).toEqual('Cancel')
      expect(wrapper.find('Link').props().to).toEqual('/people/1')
    })
  })

  describe('fetch', () => {
    it('GETs the person data to the server', () => {
      const props = { params: { id: 1 } }
      const wrapper = mount(<PersonEditPage {...props} />)
      wrapper.instance().fetch()
      expect(Utils.request).toHaveBeenCalled()
      expect(Utils.request.calls.argsFor(0)[0]).toEqual('GET')
      expect(Utils.request.calls.argsFor(0)[1]).toEqual('/people/1.json')
    })
  })

  describe('save', () => {
    beforeEach(() => {
      const xhrResponse = { responseJSON: {} }
      xhrSpyObject.done.and.callFake((afterDone) => afterDone(xhrResponse))
    })

    it('POSTs the person data to the server', () => {
      const props = { params: { id: 1 } }
      const wrapper = mount(<PersonEditPage {...props} />)
      wrapper.instance().save()
      expect(Utils.request).toHaveBeenCalled()
      expect(Utils.request.calls.argsFor(1)[0]).toEqual('PUT')
      expect(Utils.request.calls.argsFor(1)[1]).toEqual('/people/1.json')
    })

    it('redirects to the person show page', () => {
      const props = { params: { id: 1 } }
      const wrapper = mount(<PersonEditPage {...props} />)
      const instance = wrapper.instance()
      spyOn(instance, 'show')
      instance.save()
      expect(instance.show).toHaveBeenCalled()
    })
  })
})

