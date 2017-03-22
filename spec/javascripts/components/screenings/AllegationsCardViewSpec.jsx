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

    const table = component.find('tbody')
    expect(table.find('tr').length).toEqual(4)

    const firstRow = table.childAt(0)
    expect(firstRow.childAt(0).text()).toEqual('Bart Simpson')
    expect(firstRow.childAt(1).text()).toEqual('Homer Simpson')

    const secondRow = table.childAt(1)
    expect(secondRow.childAt(0).text()).toEqual('')
    expect(secondRow.childAt(1).text()).toEqual('Marge Simpson')

    const thirdRow = table.childAt(2)
    expect(thirdRow.childAt(0).text()).toEqual('Lisa Simpson')
    expect(thirdRow.childAt(1).text()).toEqual('Homer Simpson')

    const fourthRow = table.childAt(3)
    expect(fourthRow.childAt(0).text()).toEqual('')
    expect(fourthRow.childAt(1).text()).toEqual('Marge Simpson')
  })
})
