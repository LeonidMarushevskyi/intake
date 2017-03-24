import AllegationsCardView from 'components/screenings/AllegationsCardView'
import Immutable from 'Immutable'
import React from 'react'
import {shallow} from 'enzyme'

describe('AllegationsCardView', () => {
  const requiredProps = {
    allegations: Immutable.List(),
    mode: 'edit',
  }

  it('renders the edit view in edit mode', () => {
    const component = shallow(<AllegationsCardView {...requiredProps} mode='edit'/>)
    expect(component.find('AllegationsEditView').length).toEqual(1)
  })

  it('renders the show view in show mode', () => {
    const component = shallow(<AllegationsCardView {...requiredProps} mode='show'/>)
    expect(component.find('AllegationsShowView').length).toEqual(1)
  })

  describe('#onSave', () => {
    it('toggles the mode to show', () => {
      const component = shallow(<AllegationsCardView {...requiredProps} mode={'edit'}/>)
      const instance = component.instance()
      instance.onSave()
      expect(instance.state.mode).toEqual('show')
    })
  })

  describe('#onCancel', () => {
    it('toggles the mode to show', () => {
      const component = shallow(<AllegationsCardView {...requiredProps} mode={'edit'}/>)
      const instance = component.instance()
      instance.onCancel()
      expect(instance.state.mode).toEqual('show')
    })
  })
})
