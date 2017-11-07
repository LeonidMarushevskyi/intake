import WorkerSafetyShow from 'views/workerSafety/WorkerSafetyShow'
import React from 'react'
import {shallow} from 'enzyme'

describe('WorkerSafetyShow', () => {
  function renderWorkerSafety(props) {
    return shallow(<WorkerSafetyShow {...props} />)
  }

  it('displays the safety alerts', () => {
    const component = renderWorkerSafety({safetyAlerts: ['Dangerous Environment']})
    expect(component.html()).toContain('Dangerous Environment')
  })

  it('displays the safety information', () => {
    const component = renderWorkerSafety({safetyInformation: 'Be careful out there'})
    expect(component.html()).toContain('Be careful out there')
  })
})
