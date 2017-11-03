import WorkerSafetyCardView from 'screenings/WorkerSafetyCardView'
import React from 'react'
import {shallow} from 'enzyme'

describe('WorkerSafetyCardView', () => {
  const renderWorkerSafetyCard = ({editable = true, ...args}) => {
    const props = {editable, ...args}
    return shallow(<WorkerSafetyCardView {...props} />)
  }

  it('renders the card header', () => {
    const component = renderWorkerSafetyCard({mode: 'edit'})
    const header = component.find('ScreeningCardHeader')
    expect(header.exists()).toEqual(true)
    expect(header.props().onEdit).toEqual(component.instance().onEdit)
    expect(header.props().showEdit).toEqual(false)
    expect(header.props().title).toEqual('Worker Safety')
  })

  describe('render', () => {
    describe('when the mode is set to show', () => {
      it('renders the show view', () => {
        const component = renderWorkerSafetyCard({mode: 'show'})
        expect(component.find('Connect(WorkerSafetyShow)').exists()).toEqual(true)
      })
    })
  })
})
