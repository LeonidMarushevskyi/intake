import AllegationsCardView from 'components/screenings/AllegationsCardView'
import Immutable from 'Immutable'
import React from 'react'
import {shallow} from 'enzyme'

describe('AllegationsCardView', () => {
  const requiredProps = {
    allegations: Immutable.List(),
  }
  it('renders allegations card view headings', () => {
    const component = shallow(<AllegationsCardView {...requiredProps} />)
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

    const props = {allegations}
    const component = shallow(<AllegationsCardView {...props} />)

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
})
