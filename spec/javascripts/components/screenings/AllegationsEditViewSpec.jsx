import AllegationsEditView from 'components/screenings/AllegationsEditView'
import Immutable from 'immutable'
import React from 'react'
import {shallow} from 'enzyme'

describe('AllegationsEditView', () => {
  const requiredProps = {
    allegations: Immutable.List(),
    onCancel: () => {},
    onSave: () => {},
  }

  it('renders allegations card view headings', () => {
    const component = shallow(<AllegationsEditView {...requiredProps} />)
    expect(component.find('tr').text()).toContain('Alleged Victim/Children')
    expect(component.find('tr').text()).toContain('Alleged Perpetrator')
    expect(component.find('tr').text()).toContain('Allegation(s)')
  })

  it('renders alleged vicitms/perpetrators', () => {
    const bart = {
      id: 1,
      first_name: 'Bart',
      last_name: 'Simpson',
    }
    const homer = {
      id: 2,
      first_name: 'Homer',
      last_name: 'Simpson',
    }
    const marge = {
      id: 3,
      first_name: 'Marge',
      last_name: 'Simpson',
    }
    const lisa = {
      id: 4,
      first_name: 'Lisa',
      last_name: 'Simpson',
    }
    const allegations = Immutable.fromJS([
      {id: null, victim: bart, perpetrator: homer},
      {id: null, victim: bart, perpetrator: marge},
      {id: null, victim: lisa, perpetrator: homer},
      {id: null, victim: lisa, perpetrator: marge},
    ])

    const props = {...requiredProps, allegations}
    const component = shallow(<AllegationsEditView {...props} />)

    const allegationRow = component.find('AllegationRow')
    expect(allegationRow.length).toEqual(4)

    expect(allegationRow.get(0).props.victim).toEqual(Immutable.Map(bart))
    expect(allegationRow.get(0).props.perpetrator).toEqual(Immutable.Map(homer))
    expect(allegationRow.get(0).props.displayVictim).toEqual(true)

    expect(allegationRow.get(1).props.victim).toEqual(Immutable.Map(bart))
    expect(allegationRow.get(1).props.perpetrator).toEqual(Immutable.Map(marge))
    expect(allegationRow.get(1).props.displayVictim).toEqual(false)

    expect(allegationRow.get(2).props.victim).toEqual(Immutable.Map(lisa))
    expect(allegationRow.get(2).props.perpetrator).toEqual(Immutable.Map(homer))
    expect(allegationRow.get(2).props.displayVictim).toEqual(true)

    expect(allegationRow.get(3).props.victim).toEqual(Immutable.Map(lisa))
    expect(allegationRow.get(3).props.perpetrator).toEqual(Immutable.Map(marge))
    expect(allegationRow.get(3).props.displayVictim).toEqual(false)
  })

  it('calls onSave when the save button is clicked', () => {
    const onSave = jasmine.createSpy()
    const component = shallow(<AllegationsEditView {...requiredProps} onSave={onSave} />)
    component.find('button[children="Save"]').simulate('click')
    expect(onSave).toHaveBeenCalled()
  })

  it('calls onCancel when the cancel button is clicked', () => {
    const onCancel = jasmine.createSpy()
    const component = shallow(<AllegationsEditView {...requiredProps} onCancel={onCancel} />)
    component.find('button[children="Cancel"]').simulate('click')
    expect(onCancel).toHaveBeenCalled()
  })

  it('Allegation row props', () => {
    const onChange = () => null
    const bart = {
      id: 1,
      first_name: 'Bart',
      last_name: 'Simpson',
    }
    const homer = {
      id: 2,
      first_name: 'Homer',
      last_name: 'Simpson',
    }
    const allegations = Immutable.fromJS([{id: null, victim: bart, perpetrator: homer, allegation_types: []}])

    const props = {...requiredProps, allegations, onChange}
    const component = shallow(<AllegationsEditView {...props} />)
    const allegationRowProps = component.find('AllegationRow').props()
    expect(allegationRowProps.onChange).toEqual(onChange)
    expect(allegationRowProps.allegationTypes).toEqual(Immutable.List())
  })
})
