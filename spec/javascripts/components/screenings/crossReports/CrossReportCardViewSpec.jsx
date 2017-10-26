import CrossReportCardView from 'screenings/crossReports/CrossReportCardView'
import React from 'react'
import {shallow} from 'enzyme'

describe('CrossReportCardView', () => {
  function renderCrossReportCardView({
    editable = true,
    mode = 'edit',
  }) {
    const props = {
      editable,
      mode,
    }
    return shallow(<CrossReportCardView {...props} />)
  }

  describe('when mode is set to edit', () => {
    it('renders the card header', () => {
      const component = renderCrossReportCardView({})
      const header = component.find('ScreeningCardHeader')
      expect(header.exists()).toEqual(true)
      expect(header.props().onEdit).toEqual(component.instance().onEdit)
      expect(header.props().showEdit).toEqual(false)
      expect(header.props().title).toEqual('Cross Report')
    })
    it('renders the edit view', () => {
      const component = renderCrossReportCardView({})
      expect(component.find('Connect(CrossReportForm)').exists()).toEqual(true)
      expect(component.find('Connect(CrossReportForm)').props().toggleShow).toEqual(component.instance().toggleShow)
    })
  })

  describe('when mode is set to show', () => {
    describe('when editable is false', () => {
      it('disables the showEdit', () => {
        const component = renderCrossReportCardView({editable: false, mode: 'show'})
        const header = component.find('ScreeningCardHeader')
        expect(header.props().showEdit).toEqual(false)
      })
    })
    describe('when editable is true', () => {
      it('enables the showEdit', () => {
        const component = renderCrossReportCardView({editable: true, mode: 'show'})
        const header = component.find('ScreeningCardHeader')
        expect(header.props().showEdit).toEqual(true)
      })
    })
    it('renders the cross report show card', () => {
      const component = renderCrossReportCardView({mode: 'show'})
      expect(component.find('Connect(CrossReportShow)').exists()).toEqual(true)
    })
  })
})
