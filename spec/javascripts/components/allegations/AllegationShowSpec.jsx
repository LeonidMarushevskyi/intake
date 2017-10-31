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

  it('displays an errorMessage alert if one is passed', () => {
    const component = renderAllegationShow({alertErrorMessage: 'Nope'})
    expect(component.find('AlertErrorMessage').exists()).toEqual(true)
    expect(component.find('AlertErrorMessage').props().message).toEqual('Nope')
  })

  it('does not display an errorMessage alert if one is not passed', () => {
    const component = renderAllegationShow({})
    expect(component.find('AlertErrorMessage').exists()).toEqual(false)
  })

  it('indicates allegations are required if required prop is true', () => {
    const component = renderAllegationShow({required: true})
    expect(component.text()).toContain('(Required)')
  })

  it('does not indicate allegations are required if required prop is not passed', () => {
    const component = renderAllegationShow({})
    expect(component.text()).not.toContain('(Required)')
  })

  it('displays an edit button if onEdit is available', () => {
    const onEdit = jasmine.createSpy('onEdit')
    const component = renderAllegationShow({onEdit})
    expect(component.find('EditLink').exists()).toEqual(true)
  })

  it('calls onEdit when the edit button is clicked', () => {
    const onEdit = jasmine.createSpy('onEdit')
    const component = renderAllegationShow({onEdit})
    component.find('EditLink').simulate('click', {preventDefault: () => {}})
    expect(onEdit).toHaveBeenCalled()
  })

  it('does not display an edit button if no onEdit callback is passed', () => {
    const component = renderAllegationShow({})
    expect(component.find('EditLink').exists()).toEqual(false)
  })
})

