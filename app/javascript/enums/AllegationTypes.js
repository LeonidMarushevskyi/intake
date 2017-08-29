const ALLEGATION_TYPES = Object.freeze([
  {value: 'General neglect', requiresCrossReport: false},
  {value: 'Severe neglect', requiresCrossReport: true},
  {value: 'Physical abuse', requiresCrossReport: true},
  {value: 'Sexual abuse', requiresCrossReport: true},
  {value: 'Emotional abuse', requiresCrossReport: true},
  {value: 'Caretaker absent/incapacity', requiresCrossReport: false},
  {value: 'Exploitation', requiresCrossReport: true},
  {value: 'At risk, sibling abused', requiresCrossReport: false},
])

export default ALLEGATION_TYPES
