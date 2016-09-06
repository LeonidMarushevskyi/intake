# frozen_string_literal: true

module LocationType
  ALL = [
    [
      'Home Settings', [
        "Child's Home",
        "Relative's Home",
        'Foster Home',
        'Other Home'
      ]
    ], [
      'Institutional Settings', [
        'Residential',
        'Day Care',
        'School',
        'Hospital',
        'Camp',
        'Juvenile Detention',
        'BDDS',
        'Other'
      ]
    ], [
      'Other', [
        'In Public',
        'Other',
        'Unknown'
      ]
    ]
  ].freeze
end
