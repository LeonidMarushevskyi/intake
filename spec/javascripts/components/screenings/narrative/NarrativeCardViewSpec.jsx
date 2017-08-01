import Immutable from 'immutable'
import NarrativeCardView from 'screenings/NarrativeCardView'
import React from 'react'
import {mount} from 'enzyme'

describe('NarrativeCardView', () => {
  let component
  const screening = Immutable.fromJS({report_narrative: 'This is my narrative'})
  const props = {screening: screening}
  const promiseObj = jasmine.createSpyObj('promiseObj', ['then'])

  beforeEach(() => {
    props.onSave = jasmine.createSpy('onSave')
    props.onChange = jasmine.createSpy('onChange')
    props.onCancel = jasmine.createSpy('onCancel')
    props.onEdit = jasmine.createSpy('onEdit')
  })

  describe('render', () => {
    describe('when the mode is set to edit', () => {
      beforeEach(() => {
        promiseObj.then.and.callFake((thenFunction) => thenFunction())
        props.onSave.and.returnValue(promiseObj)
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

          describe('with missing data', () => {
            beforeEach(() => {
              const invaildProps = {
                ...props,
                screening: Immutable.fromJS({report_narrative: ''}),
                mode: 'edit',
              }

              component = mount(<NarrativeCardView {...invaildProps} />)
              component.find('.btn.btn-default').simulate('click')
            })

            it('validates the field', () => {
              expect(component.update().find('NarrativeShowView').props().errors.get('report_narrative').toJS()).toContain('Please enter a narrative.')
            })
          })
        })

        describe("and 'Save' is clicked", () => {
          beforeEach(() => {
            const saveButton = component.find('button[children="Save"]')
            saveButton.simulate('click')
          })

          it('calls the props onSave', () => {
            expect(Immutable.is(props.onSave.calls.mostRecent().args[0],
              Immutable.fromJS(['report_narrative']))).toEqual(true)
          })

          it('the narrative show view is rendered', () => {
            expect(component.find('NarrativeShowView').length).toEqual(1)
          })

          describe('with missing data', () => {
            beforeEach(() => {
              const invaildProps = {
                ...props,
                screening: Immutable.fromJS({report_narrative: ''}),
                mode: 'edit',
              }

              component = mount(<NarrativeCardView {...invaildProps} />)
              component.find('.btn.btn-primary').simulate('click')
            })

            it('validates the field', () => {
              expect(component.update().find('NarrativeShowView').props().errors.get('report_narrative').toJS()).toContain('Please enter a narrative.')
            })
          })
        })
      })

      describe('on field blur', () => {
        it('validates if errors are present on the field', () => {
          const oldErrors = Immutable.fromJS({report_narrative: ['The rules of gravity have begun to apply!']})
          component.setState({errors: oldErrors})
          component.find('textarea').simulate('blur', {target: {value: '   '}})
          expect(component.update().find('NarrativeEditView').props().errors.get('report_narrative').toJS()).toContain('Please enter a narrative.')
        })

        it('does not validate if there are no errors on the field', () => {
          component.find('textarea').simulate('blur', {target: {value: ''}})
          expect(component.update().find('NarrativeEditView').props().errors.get('report_narrative').toJS()).toContain('Please enter a narrative.')
        })
      })

      describe('on field change', () => {
        it('validates if errors are present on the field', () => {
          const oldErrors = Immutable.fromJS({report_narrative: ['The rules of gravity have begun to apply!']})
          component.setState({errors: oldErrors})
          component.find('textarea').simulate('change', {target: {value: '   '}})
          expect(component.update().find('NarrativeEditView').props().errors.get('report_narrative').toJS()).toContain('Please enter a narrative.')
          expect(props.onChange).toHaveBeenCalledWith(['report_narrative'], '   ', undefined)
        })

        it('does not validate if there are no errors on the field', () => {
          component.find('textarea').simulate('change', {target: {value: ''}})
          expect(component.update().find('NarrativeEditView').props().errors.get('report_narrative')).toEqual(undefined)
          expect(props.onChange).toHaveBeenCalledWith(['report_narrative'], null, undefined)
        })
      })

      describe('on initial load', () => {
        describe('with missing required field', () => {
          beforeEach(() => {
            const invaildProps = {
              ...props,
              screening: Immutable.fromJS({report_narrative: ''}),
              mode: 'edit',
            }

            component = mount(<NarrativeCardView {...invaildProps} />)
          })

          it('no error on initial load', () => {
            expect(component.find('NarrativeEditView').props().errors.get('report_narrative')).toEqual(undefined)
          })
        })
      })
    })

    describe('when the mode is set to show', () => {
      it('renders the show view', () => {
        component = mount(<NarrativeCardView {...props} mode='show'/>)
        expect(component.find('NarrativeShowView').length).toEqual(1)
        expect(component.find('NarrativeShowView').props().screening).toEqual(screening)
      })

      describe("and a user clicks 'Edit narrative'", () => {
        beforeEach(() => {
          component = mount(<NarrativeCardView {...props} mode='show'/>)
          const editLink = component.find('a[aria-label="Edit narrative"]')
          editLink.simulate('click')
        })

        it('the narrative edit view is rendered', () => {
          expect(component.find('NarrativeEditView').length).toEqual(1)
        })
      })

      describe('and missing required field', () => {
        beforeEach(() => {
          const invaildProps = {
            ...props,
            screening: Immutable.fromJS({report_narrative: ''}),
            mode: 'show',
          }

          component = mount(<NarrativeCardView {...invaildProps} />)
        })

        it('the error is passed down', () => {
          expect(component.find('NarrativeShowView').props().errors.get('report_narrative').toJS()).toContain('Please enter a narrative.')
        })
      })
    })
  })
})
