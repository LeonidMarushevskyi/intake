import Immutable from 'immutable'
import NarrativeCardView from 'components/screenings/NarrativeCardView'
import React from 'react'
import {mount} from 'enzyme'

describe('NarrativeCardView', () => {
  let wrapper
  const onSave = jasmine.createSpy('onSave')
  const props = {
    narrative: 'This is my narrative',
    onSave: onSave,
  }
  const promiseObj = jasmine.createSpyObj('promiseObj', ['then'])

  describe('render', () => {
    describe('when the mode is set to edit', () => {
      beforeEach(() => {
        promiseObj.then.and.callFake((thenFunction) => thenFunction())
        onSave.and.returnValue(promiseObj)
        wrapper = mount(<NarrativeCardView {...props} mode='edit'/>)
      })

      it('renders the edit view', () => {
        expect(wrapper.find('NarrativeEditView').length).toEqual(1)
        expect(wrapper.find('NarrativeEditView').props().narrative).toEqual('This is my narrative')
      })

      describe("and a user clicks 'Cancel'", () => {
        beforeEach(() => {
          const cancelButton = wrapper.find('button[children="Cancel"]')
          cancelButton.simulate('click')
        })

        it('the narrative show view is rendered', () => {
          expect(wrapper.find('NarrativeShowView').length).toEqual(1)
        })
      })

      describe('and the user enters a narrative and submits the form', () => {
        beforeEach(() => {
          const reportNarrative = wrapper.find('#report_narrative')
          reportNarrative.simulate('change', {target: {value: 'This is my new narrative'}})
          const form = wrapper.find('form')
          form.simulate('submit')
        })

        it('calls the props onSave', () => {
          expect(onSave).toHaveBeenCalledWith('This is my new narrative')
        })

        it('the narrative show view is rendered', () => {
          expect(wrapper.find('NarrativeShowView').length).toEqual(1)
        })
      })
    })

    describe('when the mode is set to show', () => {
      beforeEach(() => {
        wrapper = mount(<NarrativeCardView {...props} mode='show'/>)
      })

      it('renders the show view', () => {
        expect(wrapper.find('NarrativeShowView').length).toEqual(1)
        expect(wrapper.find('NarrativeShowView').props().narrative).toEqual('This is my narrative')
      })

      describe("and a user clicks 'Edit narrative'", () => {
        beforeEach(() => {
          const editLink = wrapper.find('a[aria-label="Edit narrative"]')
          editLink.simulate('click')
        })

        it('the narrative edit view is rendered', () => {
          expect(wrapper.find('NarrativeEditView').length).toEqual(1)
        })
      })
    })
  })
})
