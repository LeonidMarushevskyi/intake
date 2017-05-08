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

  it('renders rows for allegations, with allegation types in alphabetical order', () => {
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
      {id: '10', victim: bart, perpetrator: homer, allegation_types: ['Exploitation']},
      {id: '11', victim: bart, perpetrator: marge, allegation_types: ['Severe neglect', 'General neglect']},
    ])
    const props = {...requiredProps, allegations}
    const component = shallow(<AllegationsShowView {...props} />)

    const allegationRows = component.find('tbody').find('tr')
    expect(allegationRows.length).toEqual(3)

    const allegationCells = allegationRows.find('td')
    expect(allegationCells.at(0).text()).toEqual('Bart Simpson')
    expect(allegationCells.at(1).text()).toEqual('Homer Simpson')
    expect(allegationCells.at(2).text()).toEqual('Exploitation')

    expect(allegationCells.at(3).text()).toEqual('Bart Simpson')
    expect(allegationCells.at(4).text()).toEqual('Marge Simpson')
    expect(allegationCells.at(5).text()).toEqual('General neglect')

    expect(allegationCells.at(6).text()).toEqual('Bart Simpson')
    expect(allegationCells.at(7).text()).toEqual('Marge Simpson')
    expect(allegationCells.at(8).text()).toEqual('Severe neglect')
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
