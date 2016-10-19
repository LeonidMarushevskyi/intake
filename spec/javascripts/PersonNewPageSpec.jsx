import * as Utils from 'utils/http'
import PersonNewPage from 'PersonNewPage'
import React from 'react'
import {mount, shallow} from 'enzyme';

describe('PersonNewPage', () => {
  describe('render', () => {
    it('renders the card header', () => {
      const wrapper = mount(<PersonNewPage />)
      expect(wrapper.find('.card-header').text()).toEqual('Create New Person')
    })

    it('renders the person label fields', () => {
      const wrapper = mount(<PersonNewPage />)
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
      const wrapper = shallow(<PersonNewPage />)
      expect(wrapper.find('input').length).toEqual(7)
    })

    it('renders the person select fields', () => {
      const wrapper = shallow(<PersonNewPage />)
      expect(wrapper.find('select').length).toEqual(2)
    })

    it('renders the save button', () => {
      const wrapper = shallow(<PersonNewPage />)
      expect(wrapper.find('button').length).toEqual(1)
    })
  })

  describe('save', () => {
    beforeEach(() => {
      const xhrSpyObject = jasmine.createSpyObj('xhrSpyObj', ['done'])
      spyOn(Utils, 'request').and.returnValue(xhrSpyObject)
      const xhrResponse = { responseJSON: {} }
      xhrSpyObject.done.and.callFake((afterDone) => afterDone(xhrResponse))
    })

    it('POSTs the person data to the server', () => {
      const wrapper = mount(<PersonNewPage />)
      wrapper.instance().save()
      expect(Utils.request).toHaveBeenCalled()
      expect(Utils.request.calls.argsFor(0)[0]).toEqual('POST')
      expect(Utils.request.calls.argsFor(0)[1]).toEqual('/people.json')
    })

    it('redirects to the person show page', () => {
      const wrapper = mount(<PersonNewPage />)
      const instance = wrapper.instance()
      spyOn(instance, 'show')
      instance.save()
      expect(instance.show).toHaveBeenCalled()
    })
  })
})

