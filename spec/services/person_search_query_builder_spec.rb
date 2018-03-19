# frozen_string_literal: true

require 'rails_helper'

describe PersonSearchQueryBuilder do
  let(:search_term) { 'This is my search term' }

  describe '.build' do
    context 'when search_after is present' do
      let(:search_after) { %w[one two] }

      it 'builds a person search query with search_after' do
        expect(
          described_class.new(search_term: search_term, search_after: search_after).build
        ).to eq(
          _source: [
            'id',
            'legacy_source_table',
            'first_name',
            'middle_name',
            'last_name',
            'name_suffix',
            'gender',
            'date_of_birth',
            'ssn',
            'languages',
            'races',
            'ethnicity',
            'addresses.id',
            'addresses.street_name',
            'addresses.street_number',
            'addresses.city',
            'addresses.state_code',
            'addresses.zip',
            'addresses.type',
            'phone_numbers.id',
            'phone_numbers.number',
            'phone_numbers.type',
            'highlight',
            'legacy_descriptor',
            'sensitivity_indicator',
            'race_ethnicity'
          ],
          highlight: {
            order: 'score',
            number_of_fragments: 3,
            require_field_match: false,
            fields: { '*': {} }
          },
          size: 25,
          track_scores: true,
          sort: [{ _score: 'desc', _uid: 'desc' }],
          search_after: %w[one two],
          query: {
            bool: {
              must: [
                {
                  match: {
                    autocomplete_search_bar: {
                      query: 'this is my search term',
                      operator: 'and'
                    }
                  }
                }
              ],
              should: [
                {
                  match: {
                    first_name: {
                      query: 'this is my search term'
                    }
                  }
                },
                {
                  match: {
                    last_name: {
                      query: 'this is my search term'
                    }
                  }
                },
                {
                  match: {
                    'aka.first_name': {
                      query: 'this is my search term'
                    }
                  }
                },
                {
                  match: {
                    'aka.last_name': {
                      query: 'this is my search term'
                    }
                  }
                },
                {
                  match: {
                    date_of_birth_as_text: {
                      query: 'this is my search term'
                    }
                  }
                },
                {
                  match: {
                    ssn: {
                      query: 'this is my search term'
                    }
                  }
                }
              ]
            }
          }
        )
      end
    end
    context 'when search_after is not present' do
      let(:search_after) { nil }

      it 'builds a person search query without search_after' do
        expect(
          described_class.new(search_term: search_term, search_after: search_after).build
        ).to eq(
          _source: [
            'id',
            'legacy_source_table',
            'first_name',
            'middle_name',
            'last_name',
            'name_suffix',
            'gender',
            'date_of_birth',
            'ssn',
            'languages',
            'races',
            'ethnicity',
            'addresses.id',
            'addresses.street_name',
            'addresses.street_number',
            'addresses.city',
            'addresses.state_code',
            'addresses.zip',
            'addresses.type',
            'phone_numbers.id',
            'phone_numbers.number',
            'phone_numbers.type',
            'highlight',
            'legacy_descriptor',
            'sensitivity_indicator',
            'race_ethnicity'
          ],
          highlight: {
            order: 'score',
            number_of_fragments: 3,
            require_field_match: false,
            fields: { '*': {} }
          },
          size: 25,
          track_scores: true,
          sort: [{ _score: 'desc', _uid: 'desc' }],
          query: {
            bool: {
              must: [
                {
                  match: {
                    autocomplete_search_bar: {
                      query: 'this is my search term',
                      operator: 'and'
                    }
                  }
                }
              ],
              should: [
                {
                  match: {
                    first_name: {
                      query: 'this is my search term'
                    }
                  }
                },
                {
                  match: {
                    last_name: {
                      query: 'this is my search term'
                    }
                  }
                },
                {
                  match: {
                    'aka.first_name': {
                      query: 'this is my search term'
                    }
                  }
                },
                {
                  match: {
                    'aka.last_name': {
                      query: 'this is my search term'
                    }
                  }
                },
                {
                  match: {
                    date_of_birth_as_text: {
                      query: 'this is my search term'
                    }
                  }
                },
                {
                  match: {
                    ssn: {
                      query: 'this is my search term'
                    }
                  }
                }
              ]
            }
          }
        )
      end
    end

    context 'when the search term includes date of birth' do
      it 'filters out slashes in the date of birth' do
        search_terms = [
          '01/02/2001',
          '02/2001',
          '2001',
          '01/02',
          '1/2/2001',
          '2/2001',
          '1/2'
        ]
        expected_results = %w[
          01022001
          022001
          2001
          0102
          122001
          22001
          12
        ]
        search_terms.each_with_index do |search_term, index|
          expect(
            described_class.new(search_term: search_term).build
          ).to match(
            a_hash_including(
              query: {
                bool: {
                  must: [
                    {
                      match: {
                        autocomplete_search_bar: {
                          query: expected_results[index],
                          operator: 'and'
                        }
                      }
                    }
                  ],
                  should: [
                    {
                      match: {
                        first_name: {
                          query: expected_results[index]
                        }
                      }
                    },
                    {
                      match: {
                        last_name: {
                          query: expected_results[index]
                        }
                      }
                    },
                    {
                      match: {
                        'aka.first_name': {
                          query: expected_results[index]
                        }
                      }
                    },
                    {
                      match: {
                        'aka.last_name': {
                          query: expected_results[index]
                        }
                      }
                    },
                    {
                      match: {
                        date_of_birth_as_text: {
                          query: expected_results[index]
                        }
                      }
                    },
                    {
                      match: {
                        ssn: {
                          query: expected_results[index]
                        }
                      }
                    }
                  ]
                }
              }
            )
          )
        end
      end

      it 'filters out dashes' do
        search_terms = [
          '01-02-2001',
          '02-2001',
          '2001',
          '01-02',
          '1-2-2001',
          '2-2001',
          '1-2'
        ]
        expected_results = %w[
          01022001
          022001
          2001
          0102
          122001
          22001
          12
        ]
        search_terms.each_with_index do |search_term, index|
          expect(
            described_class.new(search_term: search_term).build
          ).to match(
            a_hash_including(
              query: {
                bool: {
                  must: [
                    {
                      match: {
                        autocomplete_search_bar: {
                          query: expected_results[index],
                          operator: 'and'
                        }
                      }
                    }
                  ],
                  should: [
                    {
                      match: {
                        first_name: {
                          query: expected_results[index]
                        }
                      }
                    },
                    {
                      match: {
                        last_name: {
                          query: expected_results[index]
                        }
                      }
                    },
                    {
                      match: {
                        'aka.first_name': {
                          query: expected_results[index]
                        }
                      }
                    },
                    {
                      match: {
                        'aka.last_name': {
                          query: expected_results[index]
                        }
                      }
                    },
                    {
                      match: {
                        date_of_birth_as_text: {
                          query: expected_results[index]
                        }
                      }
                    },
                    {
                      match: {
                        ssn: {
                          query: expected_results[index]
                        }
                      }
                    }
                  ]
                }
              }
            )
          )
        end
      end

      it 'keeps apostrophes and slashes in the name' do
        search_term = "A/li'son Juniper 01/02"
        expected_search_term = "a/li'son juniper 0102"
        expect(
          described_class.new(search_term: search_term).build
        ).to match(
          a_hash_including(
            query: {
              bool: {
                must: [
                  {
                    match: {
                      autocomplete_search_bar: {
                        query: expected_search_term,
                        operator: 'and'
                      }
                    }
                  }
                ],
                should: [
                  {
                    match: {
                      first_name: {
                        query: expected_search_term
                      }
                    }
                  },
                  {
                    match: {
                      last_name: {
                        query: expected_search_term
                      }
                    }
                  },
                  {
                    match: {
                      'aka.first_name': {
                        query: expected_search_term
                      }
                    }
                  },
                  {
                    match: {
                      'aka.last_name': {
                        query: expected_search_term
                      }
                    }
                  },
                  {
                    match: {
                      date_of_birth_as_text: {
                        query: expected_search_term
                      }
                    }
                  },
                  {
                    match: {
                      ssn: {
                        query: expected_search_term
                      }
                    }
                  }
                ]
              }
            }
          )
        )
      end

      it 'removes slashes in date times as the user is typing' do
        search_terms = [
          '0',
          '01',
          '01/',
          '01/0',
          '01/02',
          '01/02/',
          '01/02/1',
          '01/02/19',
          '01/02/199',
          '01/02/1995',
          '//0/1/0//2/1/9/9/5//',
          '1',
          '1/',
          '1/2',
          '1/2/',
          '1/2/1',
          '1/2/19',
          '1/2/199',
          '1/2/1995'
        ]
        expected_results = %w[
          0
          01
          01
          010
          0102
          0102
          01021
          010219
          0102199
          01021995
          01021995
          1
          1
          12
          12
          121
          1219
          12199
          121995
        ]
        search_terms.each_with_index do |search_term, index|
          expect(
            described_class.new(search_term: search_term).build
          ).to match(
            a_hash_including(
              query: {
                bool: {
                  must: [
                    {
                      match: {
                        autocomplete_search_bar: {
                          query: expected_results[index],
                          operator: 'and'
                        }
                      }
                    }
                  ],
                  should: [
                    {
                      match: {
                        first_name: {
                          query: expected_results[index]
                        }
                      }
                    },
                    {
                      match: {
                        last_name: {
                          query: expected_results[index]
                        }
                      }
                    },
                    {
                      match: {
                        'aka.first_name': {
                          query: expected_results[index]
                        }
                      }
                    },
                    {
                      match: {
                        'aka.last_name': {
                          query: expected_results[index]
                        }
                      }
                    },
                    {
                      match: {
                        date_of_birth_as_text: {
                          query: expected_results[index]
                        }
                      }
                    },
                    {
                      match: {
                        ssn: {
                          query: expected_results[index]
                        }
                      }
                    }
                  ]
                }
              }
            )
          )
        end
      end
    end
  end
end
