import AllegationsCardView from 'components/screenings/AllegationsCardView'
import Immutable from 'Immutable'
import React from 'react'
import {shallow} from 'enzyme'

describe('AllegationsCardView', () => {
  const allegations = Immutable.List()
  const requiredProps = {
    allegations: allegations,
    mode: 'edit',
    onSave: () => null,
  }

  describe('#onCancel', () => {
    it('toggles the mode to show', () => {
      const component = shallow(<AllegationsCardView {...requiredProps} mode={'edit'}/>)
      const instance = component.instance()
      instance.onCancel()
      expect(instance.state.mode).toEqual('show')
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
    it('toggles the mode to show', () => {
      const component = shallow(<AllegationsCardView {...requiredProps} mode={'edit'}/>)
      const instance = component.instance()
      instance.onSave()
      expect(instance.state.mode).toEqual('show')
    })

    it('calls onSave from props with the appropriate values', () => {
      const onSave = jasmine.createSpy()
      const component = shallow(<AllegationsCardView {...requiredProps} mode={'edit'} onSave={onSave} />)
      const instance = component.instance()
      instance.onSave()
      expect(onSave).toHaveBeenCalledWith(['allegations'], allegations)
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
  })
})
