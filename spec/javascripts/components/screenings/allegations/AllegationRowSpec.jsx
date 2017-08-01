import React from 'react'
import AllegationRow from 'screenings/AllegationRow'
import Immutable from 'immutable'
import {shallow} from 'enzyme'

describe('AllegationRow', () => {
  const bart = Immutable.fromJS({id: '123', first_name: 'Bart', last_name: 'Simpson'})
  const homer = Immutable.fromJS({id: '456', first_name: 'Homer', last_name: 'Simpson'})

  const requiredProps = {
    victim: bart,
    perpetrator: homer,
    onChange: () => null,
    displayVictim: true,
    allegationTypes: Immutable.List(),
  }

  it('renders victim and perpetrator', () => {
    const component = shallow(<AllegationRow {...requiredProps} displayVictim={true} />)
    expect(component.childAt(0).text()).toEqual('Bart Simpson')
    expect(component.childAt(1).text()).toEqual('Homer Simpson')
  })

  it('does not render victim when displayVictim is false', () => {
    const component = shallow(<AllegationRow {...requiredProps} displayVictim={false} />)
    expect(component.childAt(0).text()).toEqual('')
    expect(component.childAt(1).text()).toEqual('Homer Simpson')
  })

  it('sets allegation types value', () => {
    const allegationTypes = Immutable.List(['General neglect'])
    const component = shallow(<AllegationRow {...requiredProps} allegationTypes={allegationTypes} />)
    expect(component.find('Select').props().value).toEqual(allegationTypes.toJS())
  })

  it('displays allegation types', () => {
    const component = shallow(<AllegationRow {...requiredProps} />)
    expect(component.find('Select').length).toEqual(1)
    expect(component.find('Select').props()['aria-label']).toEqual('allegations Bart Simpson Homer Simpson')
    expect(component.find('Select').props().options).toEqual([
      {label: 'General neglect', value: 'General neglect'},
      {label: 'Severe neglect', value: 'Severe neglect'},
      {label: 'Physical abuse', value: 'Physical abuse'},
      {label: 'Sexual abuse', value: 'Sexual abuse'},
      {label: 'Emotional abuse', value: 'Emotional abuse'},
      {label: 'Caretaker absent/incapacity', value: 'Caretaker absent/incapacity'},
      {label: 'Exploitation', value: 'Exploitation'},
      {label: 'At risk, sibling abused', value: 'At risk, sibling abused'},
    ])
  })

  it('allows a user to select an allegation type', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = shallow(<AllegationRow {...requiredProps} onChange={onChange}/>)
    const newSelectedAllegationTypes = [
      {label: 'General neglect', value: 'General neglect'},
    ]
    component.find('Select').simulate('change', newSelectedAllegationTypes)
    expect(onChange).toHaveBeenCalledWith(bart.get('id'), homer.get('id'), Immutable.List(['General neglect']))
  })
})
