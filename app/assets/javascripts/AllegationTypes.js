const ALLEGATION_TYPES = Object.freeze([
  {value: 'General neglect', is_serious: false},
  {value: 'Severe neglect', is_serious: true},
  {value: 'Physical abuse', is_serious: true},
  {value: 'Sexual abuse', is_serious: true},
  {value: 'Emotional abuse', is_serious: true},
  {value: 'Caretaker absent/incapacity', is_serious: false},
  {value: 'Exploitation', is_serious: true},
  {value: 'At risk, sibling abused', is_serious: true},
])

export default ALLEGATION_TYPES
