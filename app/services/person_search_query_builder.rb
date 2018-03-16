# frozen_string_literal: true

# PeopleSearchQueryBuilder is a service class responsible for creation
# of an elastic search person search query
class PersonSearchQueryBuilder
  attr_reader :search_after

  def initialize(search_term: '', search_after: nil)
    @search_term = search_term
    @search_after = search_after
  end

  def build
    {
      size: 25,
      track_scores: true,
      sort: [{ _score: 'desc', _uid: 'desc' }],
      query: query,
      _source: fields,
      highlight: highlight
    }.tap do |query|
      query[:search_after] = search_after if search_after
    end
  end

  private

  def formatted_search_term
    @search_term
      .downcase
      .gsub(%r{[-/]*(\d+)[-/]*}, '\1')
  end

  def query
    { bool: { must: must, should: should } }
  end

  def must
    return [base_query] unless Rails.configuration.intake[:client_only_search]
    [base_query, client_only]
  end

  def match_query(field, term)
    {
      match: {
        field => {
          query: term
        }
      }
    }
  end

  def should
    term = formatted_search_term
    [
      match_query(:first_name, term),
      match_query(:last_name, term),
      match_query(:'aka.first_name', term),
      match_query(:'aka.last_name', term),
      match_query(:date_of_birth_as_text, term),
      match_query(:ssn, term)
    ]
  end

  def base_query
    {
      match: {
        autocomplete_search_bar: {
          query: formatted_search_term,
          operator: 'and'
        }
      }
    }
  end

  def client_only
    {
      match: {
        'legacy_descriptor.legacy_table_name': 'CLIENT_T'
      }
    }
  end

  def fields
    %w[id legacy_source_table first_name middle_name last_name name_suffix gender
       date_of_birth ssn languages races ethnicity
       addresses.id addresses.street_name addresses.street_number
       addresses.city addresses.state_code addresses.zip addresses.type
       phone_numbers.id phone_numbers.number phone_numbers.type
       highlight legacy_descriptor sensitivity_indicator race_ethnicity]
  end

  def highlight
    {
      order: 'score',
      number_of_fragments: 3,
      require_field_match: false,
      fields: {
        '*': {}
      }
    }
  end
end
