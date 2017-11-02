import WorkerSafetyShow from 'screenings/workerSafety/WorkerSafetyShow'
import React from 'react'
import {shallow} from 'enzyme'

fdescribe('WorkerSafetyShow', () => {
  function renderWorkerSafety(props) {
    return shallow(<WorkerSafetyShow {...props} />)
  }

  it('displays safety alerts', () => {
    const component = renderWorkerSafety({safetyAlerts: ['Something Dangerous', 'Another Dangerous Thing']})
    expect(component.html()).toContain('Something Dangerous')
    expect(component.html()).toContain('Another Dangerous Thing')
  })

  it('displays safety information', () => {
    const component = renderWorkerSafety({safetyInformation: 'Be careful out there'})
    expect(component.html()).toContain('Be careful out there')
  })
})
