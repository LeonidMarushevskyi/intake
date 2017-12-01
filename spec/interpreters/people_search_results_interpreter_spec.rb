# frozen_string_literal: true

require 'rails_helper'

describe PeopleSearchResultsInterpreter do
  describe '.interpret_sensitivity_indicator' do
    it 'interprets s as sensitive' do
      document = { '_source' => { 'sensitivity_indicator' => 's' } }
      described_class.interpret_sensitivity_indicator(document)
      expect(document).to match a_hash_including(
        '_source' => a_hash_including(
          'sensitive' => true,
          'sealed' => false
        )
      )
    end
    it 'interprets r as sealed' do
      document = { '_source' => { 'sensitivity_indicator' => 'r' } }
      described_class.interpret_sensitivity_indicator(document)
      expect(document).to match a_hash_including(
        '_source' => a_hash_including(
          'sensitive' => false,
          'sealed' => true
        )
      )
    end
    it 'interprets nil as neither sealed or sensitive' do
      document = { '_source' => { 'sensitivity_indicator' => nil } }
      described_class.interpret_sensitivity_indicator(document)
      expect(document).to match a_hash_including(
        '_source' => a_hash_including(
          'sensitive' => false,
          'sealed' => false
        )
      )
    end
    it 'interprets other characters as neither sealed or sensitive' do
      document = { '_source' => { 'sensitivity_indicator' => (('a'..'z').to_a - %w[s r]).sample } }
      described_class.interpret_sensitivity_indicator(document)
      expect(document).to match a_hash_including(
        '_source' => a_hash_including(
          'sensitive' => false,
          'sealed' => false
        )
      )
    end
  end
  describe '.interpret_languages' do
    it 'leaves an empty language array empty' do
      document = { '_source' => { 'languages' => [] } }
      described_class.interpret_languages(document)
      expect(document).to match a_hash_including(
        '_source' => a_hash_including(
          'languages' => []
        )
      )
    end
    it 'lists the primary language first' do
      document = { '_source' => { 'languages' => [
        { 'name' => 'Spanish', 'primary' => false },
        { 'name' => 'English', 'primary' => true }
      ] } }
      described_class.interpret_languages(document)
      expect(document).to match a_hash_including(
        '_source' => a_hash_including(
          'languages' => %w[English Spanish]
        )
      )
    end
  end
  describe '.interpret_addresses' do
    it 'combines street_name and street_number into street_address' do
      document = { '_source' => { 'addresses' => [
        { 'street_name' => 'street', 'street_number' => '123' }
      ] } }
      described_class.interpret_addresses(document)
      expect(document).to match a_hash_including(
        '_source' => a_hash_including(
          'addresses' => array_including(
            a_hash_including(
              'street_address' => '123 street'
            )
          )
        )
      )
    end
    it 'renames state_code to state' do
      document = { '_source' => { 'addresses' => [{ 'state_code' => 'CA' }] } }
      described_class.interpret_addresses(document)
      expect(document).to match a_hash_including(
        '_source' => a_hash_including(
          'addresses' => array_including(
            a_hash_including(
              'state' => 'CA'
            )
          )
        )
      )
    end
  end
  describe '.interpret_highlights' do
    it 'puts any highlights into _source' do
      document = {
        '_source' => {},
        'highlight' => {
          'last_name' => ['<em>Hillshire</em>'],
          'first_name' => ['<em>Phillip</em>'],
          'ssn' => ['<em>111225555</em>']
        }
      }
      described_class.interpret_highlights(document)
      expect(document).to match a_hash_including(
        '_source' => a_hash_including(
          'highlight' => a_hash_including(
            'last_name' => '<em>Hillshire</em>',
            'first_name' => '<em>Phillip</em>',
            'ssn' => '<em>111225555</em>'
          )
        )
      )
    end
  end
  describe '.interpret_ssn' do
    it 'add dashes to ssn' do
      document = { '_source' => { 'ssn' => '123456789' } }
      described_class.interpret_ssn(document)
      expect(document).to match a_hash_including(
        '_source' => a_hash_including(
          'ssn' => '123-45-6789'
        )
      )
    end
  end

  describe '.interpret_race_ethnicity' do
    it 'separates race_ethnicity into race and ethnicity' do
      document = {
        '_source' => {
          'id' => 'I1dyXvW00b',
          'race_ethnicity' => {
            'race_codes' => [{ 'description' => 'White*' }],
            'unable_to_determine_code' => nil,
            'hispanic_codes' => [{ 'description' => 'Mexican' }],
            'hispanic_origin_code' => 'Y',
            'hispanic_unable_to_determine_code' => nil
          }
        }
      }
      described_class.interpret_race_ethnicity(document)
      expect(document).to match a_hash_including(
        '_source' => a_hash_including(
          'races' => [{ 'race' => 'White' }],
          'ethnicity' => {
            'hispanic_latino_origin' => 'Yes',
            'ethnicity_detail' => ['Mexican']
          }
        )
      )
    end
  end

  describe '.hispanic_latino_origin_for_code' do
    it 'returns description for legacy code' do
      expect(described_class.hispanic_latino_origin_for_code('Y')).to equal('Yes')
      expect(described_class.hispanic_latino_origin_for_code('N')).to equal('No')
      expect(described_class.hispanic_latino_origin_for_code('U')).to equal('Unknown')
      expect(described_class.hispanic_latino_origin_for_code('Z')).to equal('Abandoned')
      expect(described_class.hispanic_latino_origin_for_code('D')).to equal('Declined to answer')
      expect(described_class.hispanic_latino_origin_for_code(nil)).to equal(nil)
    end
  end

  describe '.interpret_ethnicities' do
    it 'handles nil parameter' do
      expect(described_class.interpret_ethnicities(nil)).to eq(nil)
    end
    it 'returns array of NS ethnicities matching legacy ethnicities' do
      legacy_ethnicities = [
        { 'id' => '3164', 'description' => 'Mexican' },
        { 'id' => '839', 'description' => 'South American' }
      ]
      expected_ethnicities = ['Mexican', 'South American']
      expect(described_class.interpret_ethnicities(legacy_ethnicities)).to eq(expected_ethnicities)
    end
  end

  describe '.interpret_races' do
    it 'handles nil parameter' do
      expect(described_class.interpret_races(nil, nil)).to eq(nil)
    end
    it 'returns array of NS races matching legacy races' do
      legacy_races = [
        { 'id' => '3164', 'description' => 'White - Middle Eastern*' },
        { 'id' => '839', 'description' => 'White*' }
      ]
      expected_races = [
        { 'race_detail' => 'Middle Eastern', 'race' => 'White' },
        { 'race' => 'White' }
      ]
      expect(described_class.interpret_races(legacy_races, '')).to eq(expected_races)
    end
    it 'assignes Abandonment as Abandoned race' do
      legacy_races = [
        { 'id' => '12', 'description' => 'Unable to Determine*' }
      ]
      unable_to_determine_code = 'A'
      expected_races = ['Abandoned']
      expect(described_class.interpret_races(legacy_races, unable_to_determine_code))
        .to eq(expected_races)
    end
    it 'assignes Incapacitation as Unknown race' do
      legacy_races = [
        { 'id' => '12', 'description' => 'Unable to Determine*' }
      ]
      unable_to_determine_code = 'I'
      expected_races = ['Unknown']
      expect(described_class.interpret_races(legacy_races, unable_to_determine_code))
        .to eq(expected_races)
    end
    it 'assignes Individual Does Not Know as Unknown race' do
      legacy_races = [
        { 'id' => '12', 'description' => 'Unable to Determine*' }
      ]
      unable_to_determine_code = 'K'
      expected_races = ['Unknown']
      expect(described_class.interpret_races(legacy_races, unable_to_determine_code))
        .to eq(expected_races)
    end
  end
end
