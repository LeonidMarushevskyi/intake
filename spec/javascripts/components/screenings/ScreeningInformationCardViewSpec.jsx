import React from 'react'
import ScreeningInformationCardView from 'screenings/ScreeningInformationCardView'
import {shallow} from 'enzyme'

describe('ScreeningInformationCardView', () => {
  function renderScreeningInformationCardView({editable = true, mode}) {
    const props = {editable, mode}
    return shallow(<ScreeningInformationCardView {...props} />)
  }

  it('renders the card header', () => {
    const header = renderScreeningInformationCardView({
      mode: 'edit',
    }).find('ScreeningCardHeader')
    expect(header.length).toEqual(1)
    expect(header.props().showEdit).toEqual(false)
    expect(header.props().title).toEqual('Screening Information')
  })

  it('renders the form container in edit mode', () => {
    const component = renderScreeningInformationCardView({mode: 'edit'})
      .find('Connect(ScreeningInformationForm)')
    expect(component.exists()).toEqual(true)
  })

  it('renders the show container in show mode', () => {
    const component = renderScreeningInformationCardView({mode: 'show'})
      .find('Connect(ScreeningInformationShow)')
    expect(component.exists()).toEqual(true)
  })
})

