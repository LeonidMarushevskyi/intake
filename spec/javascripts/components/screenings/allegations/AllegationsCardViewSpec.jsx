import AllegationsCardView from 'components/screenings/AllegationsCardView'
import Immutable from 'immutable'
import React from 'react'
import {shallow} from 'enzyme'

describe('AllegationsCardView', () => {
  const allegations = Immutable.List()
  const requiredProps = {
    allegations: allegations,
    mode: 'edit',
    onSave: () => null,
    onChange: () => null,
    onCancel: () => null,
  }

  describe('#onCancel', () => {
    it('toggles the mode to show', () => {
      const component = shallow(<AllegationsCardView {...requiredProps} mode={'edit'}/>)
      const instance = component.instance()
      instance.onCancel()
      expect(instance.state.mode).toEqual('show')
    })

    it('clears edits for the allegations card', () => {
      const onCancel = jasmine.createSpy('onCancel')
      const component = shallow(<AllegationsCardView {...requiredProps} mode={'edit'} onCancel={onCancel}/>)
      const instance = component.instance()
      instance.onCancel()
      expect(onCancel).toHaveBeenCalledWith(['allegations'])
    })
  })

  describe('#onEdit', () => {
    it('toggles the mode to edit', () => {
      const component = shallow(<AllegationsCardView {...requiredProps} mode={'show'}/>)
      const instance = component.instance()
      instance.onEdit()
      expect(instance.state.mode).toEqual('edit')
    })
  })

  describe('#onSave', () => {
    let component
    let onSave
    let instance

    beforeEach(() => {
      onSave = jasmine.createSpy('onSave')
      component = shallow(
        <AllegationsCardView
          {...requiredProps}
          mode={'edit'}
          onSave={onSave}
        />
      )
      instance = component.instance()
      instance.onSave()
    })

    it('toggles the mode to show', () => {
      expect(instance.state.mode).toEqual('show')
    })

    it('calls onSave from props with the appropriate values', () => {
      expect(onSave).toHaveBeenCalledWith(['allegations'])
    })
  })

  describe('#onChange', () => {
    it('calls onChange from props with the appropriate values', () => {
      const allegationTypes = Immutable.List(['General Neglect'])
      const onChange = jasmine.createSpy('onChange')
      const component = shallow(<AllegationsCardView {...requiredProps} onChange={onChange} />)
      component.instance().onChange('123', '456', allegationTypes)

      const callParams = onChange.calls.argsFor(0)
      const fieldSeq = callParams[0]
      const actualAllegationTypes = callParams[1]
      expect(fieldSeq).toEqual(['allegations', '123', '456'])
      expect(actualAllegationTypes.toJS()).toEqual(allegationTypes.toJS())
      expect(Immutable.is(actualAllegationTypes, allegationTypes)).toEqual(true)
    })
  })

  describe('show mode', () => {
    const props = {
      ...requiredProps,
      mode: 'show',
    }

    it('renders the allegations show view', () => {
      const component = shallow(<AllegationsCardView {...props} />)
      expect(component.find('AllegationsShowView').length).toEqual(1)
    })

    it("renders only allegations with persisted id's", () => {
      const allegations = Immutable.fromJS([
        {id: null},
        {id: '1'},
        {id: null},
        {id: '2'},
      ])
      const expectedAllegations = [{id: '1'}, {id: '2'}]
      const component = shallow(<AllegationsCardView {...props} allegations={allegations} />)
      const renderedAllegations = component.find('AllegationsShowView').props().allegations

      expect(renderedAllegations.toJS()).toEqual(expectedAllegations)
      expect(Immutable.is(renderedAllegations, Immutable.fromJS(expectedAllegations))).toEqual(true)
    })
  })

  describe('edit mode', () => {
    const props = {
      ...requiredProps,
      mode: 'edit',
    }
    it('renders the allegations edit view', () => {
      const component = shallow(<AllegationsCardView {...props} />)
      expect(component.find('AllegationsEditView').length).toEqual(1)
    })

    it("renders all allegations, with or without id's", () => {
      const allegations = Immutable.fromJS([
        {id: null},
        {id: '1'},
        {id: null},
        {id: '2'},
      ])
      const component = shallow(<AllegationsCardView {...props} allegations={allegations} />)
      const renderedAllegations = component.find('AllegationsEditView').props().allegations

      expect(renderedAllegations).toEqual(allegations)
    })

    it('passes onChange to the edit card', () => {
      const component = shallow(<AllegationsCardView {...props} />)
      expect(component.find('AllegationsEditView').props().onChange).toEqual(component.instance().onChange)
    })
  })
})
