import AllegationsShowView from 'components/screenings/AllegationsShowView'
import Immutable from 'immutable'
import React from 'react'
import {shallow} from 'enzyme'

describe('AllegationsShowView', () => {
  const requiredProps = {
    allegations: Immutable.List(),
    onEdit: () => {},
  }

  it('renders allegations show view headings', () => {
    const component = shallow(<AllegationsShowView {...requiredProps} />)
    expect(component.text()).toContain('Alleged Victim/Children')
    expect(component.text()).toContain('Alleged Perpetrator')
    expect(component.text()).toContain('Allegation(s)')
  })

  it('renders alleged vicitms/perpetrators', () => {
    const bart = {
      id: '1',
      first_name: 'Bart',
      last_name: 'Simpson',
    }
    const homer = {
      id: '2',
      first_name: 'Homer',
      last_name: 'Simpson',
    }
    const marge = {
      id: '3',
      first_name: 'Marge',
      last_name: 'Simpson',
    }
    const allegations = Immutable.fromJS([
      {id: '10', victim: bart, perpetrator: homer},
      {id: '11', victim: bart, perpetrator: marge},
    ])
    const props = {...requiredProps, allegations}
    const component = shallow(<AllegationsShowView {...props} />)

    const allegationRow = component.find('AllegationRow')
    expect(allegationRow.length).toEqual(2)

    expect(allegationRow.get(0).props.victim).toEqual(Immutable.Map(bart))
    expect(allegationRow.get(0).props.perpetrator).toEqual(Immutable.Map(homer))
    expect(allegationRow.get(0).props.displayVictim).toEqual(true)

    expect(allegationRow.get(1).props.victim).toEqual(Immutable.Map(bart))
    expect(allegationRow.get(1).props.perpetrator).toEqual(Immutable.Map(marge))
    expect(allegationRow.get(1).props.displayVictim).toEqual(true)
  })

  it('calls the onEdit function when edit link is clicked', () => {
    const onEdit = jasmine.createSpy()
    const event = jasmine.createSpyObj('event', ['preventDefault'])
    const props = {
      ...requiredProps,
      onEdit,
    }
    const component = shallow(<AllegationsShowView {...props}/>)
    expect(component.find('EditLink').length).toEqual(1)
    component.find('EditLink').simulate('click', event)
    expect(onEdit).toHaveBeenCalled()
  })
})
