import Immutable from 'immutable'
import NarrativeCardView from 'components/screenings/NarrativeCardView'
import React from 'react'
import {mount} from 'enzyme'

describe('NarrativeCardView', () => {
  let component
  const onSave = jasmine.createSpy('onSave')
  const screening = Immutable.fromJS({
    report_narrative: 'This is my narrative',
  })
  const props = {
    screening: screening,
    onSave: onSave,
    onCancel: jasmine.createSpy('onCancel'),
    onEdit: jasmine.createSpy('onEdit'),
    onChange: jasmine.createSpy('onChange'),
  }
  const promiseObj = jasmine.createSpyObj('promiseObj', ['then'])

  describe('render', () => {
    describe('when the mode is set to edit', () => {
      beforeEach(() => {
        promiseObj.then.and.callFake((thenFunction) => thenFunction())
        onSave.and.returnValue(promiseObj)
        component = mount(<NarrativeCardView {...props} mode='edit'/>)
      })

      it('renders the edit view', () => {
        expect(component.find('NarrativeEditView').length).toEqual(1)
        expect(component.find('NarrativeEditView').props().screening).toEqual(screening)
      })

      describe("when 'Cancel' is clicked", () => {
        beforeEach(() => {
          const cancelButton = component.find('button[children="Cancel"]')
          cancelButton.simulate('click')
        })

        it('the narrative show view is rendered', () => {
          expect(component.find('NarrativeShowView').props().screening).toEqual(screening)
        })

        it('the edit view does not retain canceled changes', () => {
          expect(component.find('NarrativeShowView').props().screening).toEqual(screening)
        })
      })

      describe('when the narrative is edited', () => {
        beforeEach(() => {
          component.find('textarea').simulate('change', {target: {value: 'this is my new text'}})
        })

        describe("and 'Cancel' is clicked and 'Edit' is clicked", () => {
          beforeEach(() => {
            const cancelButton = component.find('button[children="Cancel"]')
            cancelButton.simulate('click')
            const editLink = component.find('a[aria-label="Edit narrative"]')
            editLink.simulate('click')
          })
          it('the narrative edit view is rendered with the original narrative', () => {
            expect(component.find('NarrativeEditView').props().screening).toEqual(screening)
          })
        })

        describe("and 'Save' is clicked", () => {
          beforeEach(() => {
            const saveButton = component.find('button[children="Save"]')
            saveButton.simulate('click')
          })

          it('calls the props onSave', () => {
            expect(onSave).toHaveBeenCalledWith(Immutable.fromJS(['report_narrative']))
          })

          it('the narrative show view is rendered', () => {
            expect(component.find('NarrativeShowView').length).toEqual(1)
          })
        })
      })
    })

    describe('when the mode is set to show', () => {
      beforeEach(() => {
        component = mount(<NarrativeCardView {...props} mode='show'/>)
      })

      it('renders the show view', () => {
        expect(component.find('NarrativeShowView').length).toEqual(1)
        expect(component.find('NarrativeShowView').props().screening).toEqual(screening)
      })

      describe("and a user clicks 'Edit narrative'", () => {
        beforeEach(() => {
          const editLink = component.find('a[aria-label="Edit narrative"]')
          editLink.simulate('click')
        })

        it('the narrative edit view is rendered', () => {
          expect(component.find('NarrativeEditView').length).toEqual(1)
        })
      })
    })
  })
})
