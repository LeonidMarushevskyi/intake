import React from 'react'
import {shallow} from 'enzyme'
import AllegationShow from 'allegations/AllegationShow'

describe('AllegationShow', () => {
  const renderAllegationShow = ({...props}) => (
    shallow(<AllegationShow {...props}/>)
  )

  it('renders "Allegations" in the card header', () => {
    const component = renderAllegationShow()
    expect(component.find('.card-header').text()).toEqual('Allegations')
  })

  it('renders a table of allegations with column headings', () => {
    const component = renderAllegationShow()
    const table = component.find('table')
    expect(table.exists()).toEqual(true)
    const headings = component.find('th')
    expect(headings.length).toEqual(3)
    expect(headings.at(0).text()).toEqual('Alleged Victim/Children')
    expect(headings.at(1).text()).toEqual('Alleged Perpetrator')
    expect(headings.at(2).text()).toEqual('Allegation(s)')
  })

  it('renders allegations in a table', () => {
    const allegations = [
      {victim: 'Jane', perpetrator: 'John', type: 'Physical Abuse'},
      {victim: 'Sally', perpetrator: 'Sam', type: 'General Neglect'},
      {victim: 'Bill', perpetrator: 'Bob', type: 'Abuse'},
    ]
    const component = renderAllegationShow({allegations})
    const allegationRows = component.find('tbody').find('tr')
    expect(allegationRows.length).toEqual(3)
    expect(allegationRows.at(1).find('td').at(0).text()).toEqual('Sally')
    expect(allegationRows.at(1).find('td').at(1).text()).toEqual('Sam')
    expect(allegationRows.at(1).find('td').at(2).text()).toEqual('General Neglect')
  })
})

