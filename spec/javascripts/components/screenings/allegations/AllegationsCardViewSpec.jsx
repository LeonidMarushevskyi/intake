import AllegationsCardView from 'components/screenings/AllegationsCardView'
import Immutable from 'immutable'
import React from 'react'
import {shallow} from 'enzyme'

describe('AllegationsCardView', () => {
  let component
  let instance
  const allegations = Immutable.fromJS([
    {id: null},
    {id: '1'},
    {id: null},
    {id: '2'},
  ])

  const requiredProps = {
    allegations: Immutable.List(),
    areAllegationsRequired: false,
    mode: 'edit',
  }

  beforeEach(() => {
    requiredProps.onSave = jasmine.createSpy('onSave')
    requiredProps.onChange = jasmine.createSpy('onChange')
    requiredProps.onCancel = jasmine.createSpy('onCancel')
  })

  describe('#onCancel', () => {
    beforeEach(() => {
      requiredProps.onCancel = jasmine.createSpy('onCancel')
      component = shallow(<AllegationsCardView {...requiredProps} mode={'edit'}/>)
      instance = component.instance()
      instance.onCancel()
    })

    it('toggles the mode to show', () => {
      expect(instance.state.mode).toEqual('show')
    })

    it('clears edits for the allegations card', () => {
      expect(requiredProps.onCancel).toHaveBeenCalledWith(['allegations'])
    })
  })

  describe('#onEdit', () => {
    it('toggles the mode to edit', () => {
      component = shallow(<AllegationsCardView {...requiredProps} mode={'show'}/>)
      instance = component.instance()
      instance.onEdit()
      expect(instance.state.mode).toEqual('edit')
    })
  })

  describe('#onSave', () => {
    beforeEach(() => {
      requiredProps.onSave = jasmine.createSpy('onSave')
      component = shallow(<AllegationsCardView {...requiredProps}/>)
      instance = component.instance()
      instance.onSave()
    })

    it('toggles the mode to show', () => {
      expect(instance.state.mode).toEqual('show')
    })

    it('calls onSave from props with the appropriate values', () => {
      expect(requiredProps.onSave).toHaveBeenCalledWith(['allegations'])
    })
  })

  describe('#onChange', () => {
    it('calls onChange from props with the appropriate values', () => {
      const allegationTypes = Immutable.List(['General Neglect'])
      const onChange = jasmine.createSpy('onChange')
      requiredProps.onChange = onChange
      component = shallow(<AllegationsCardView {...requiredProps}/>)
      component.instance().onChange('123', '456', allegationTypes)

      const callParams = onChange.calls.argsFor(0)
      const fieldSeq = callParams[0]
      const actualAllegationTypes = callParams[1]
      expect(fieldSeq).toEqual(['allegations', '123', '456'])
      expect(actualAllegationTypes.toJS()).toEqual(allegationTypes.toJS())
      expect(Immutable.is(actualAllegationTypes, allegationTypes)).toEqual(true)
    })
  })

  describe('alertErrorMessage', () => {
    it('returns null when allegations are not required', () => {
      const props = {
        ...requiredProps,
        areAllegationsRequired: false,
      }
      const component = shallow(<AllegationsCardView {...props}/>)
      expect(component.instance().alertErrorMessage()).toEqual(null)
    })

    it('returns null when allegation are required but valid allegations exist', () => {
      const props = {
        ...requiredProps,
        areAllegationsRequired: true,
        allegations: Immutable.fromJS([{
          id: 1,
          allegation_types: ['exploitation'],
        }]),
      }
      const component = shallow(<AllegationsCardView {...props}/>)
      expect(component.instance().alertErrorMessage()).toEqual(null)
    })

    it('returns a message when allegations are required and no allegations are valid', () => {
      const props = {
        ...requiredProps,
        areAllegationsRequired: true,
        allegations: Immutable.fromJS([{
          id: 1,
          allegation_types: [],
        }]),
      }
      const component = shallow(<AllegationsCardView {...props}/>)
      expect(component.instance().alertErrorMessage()).toContain('must include at least one allegation.')
    })
  })

  describe('show mode', () => {
    beforeEach(() => {
      requiredProps.mode = 'show'
    })

    it('renders the allegations show view', () => {
      component = shallow(<AllegationsCardView {...requiredProps} />)
      expect(component.find('AllegationsShowView').length).toEqual(1)
    })

    it("renders only allegations with persisted id's", () => {
      const expectedAllegations = [{id: '1'}, {id: '2'}]
      component = shallow(<AllegationsCardView {...requiredProps} allegations={allegations} />)
      const renderedAllegations = component.find('AllegationsShowView').props().allegations

      expect(renderedAllegations.toJS()).toEqual(expectedAllegations)
      expect(Immutable.is(renderedAllegations, Immutable.fromJS(expectedAllegations))).toEqual(true)
    })
  })

  describe('edit mode', () => {
    beforeEach(() => {
      requiredProps.mode = 'edit'
    })

    it('renders the allegations edit view', () => {
      component = shallow(<AllegationsCardView {...requiredProps} />)
      expect(component.find('AllegationsEditView').length).toEqual(1)
    })

    it("renders all allegations, with or without id's", () => {
      component = shallow(<AllegationsCardView {...requiredProps} allegations={allegations} />)
      const renderedAllegations = component.find('AllegationsEditView').props().allegations

      expect(renderedAllegations).toEqual(allegations)
    })

    it('passes onChange to the edit card', () => {
      component = shallow(<AllegationsCardView {...requiredProps} />)
      expect(component.find('AllegationsEditView').props().onChange).toEqual(component.instance().onChange)
    })
  })
})
