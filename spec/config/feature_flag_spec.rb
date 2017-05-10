# frozen_string_literal: true

require 'rails_helper'

describe 'feature configuration' do
  context 'for an undefined feature flag' do
    it 'returns false by default' do
      random_feature = Faker::App.name
      expect(Feature.active?(random_feature.to_sym)).to eq(false)
    end
  end

  context 'for a defined feature' do
    context 'in production env' do
      let(:config_file) { "#{Rails.root}/config/feature.yml" }

      context "when feature's envionment variable is not set" do
        before do
          repo = Feature::Repository::YamlRepository.new(config_file, 'production')
          Feature.set_repository(repo)
        end

        it 'returns false' do
          expect(Feature.active?(:release_one)).to eq(false)
        end
      end

      context "when feature's environment variable is set" do
        it 'returns true' do
          ENV['RELEASE_ONE'] = 'true'
          repo = Feature::Repository::YamlRepository.new(config_file, 'production')
          Feature.set_repository(repo)
          expect(Feature.active?(:release_one)).to eq(true)
          ENV.delete('RELEASE_ONE')
          Feature.refresh!
        end
      end
    end
  end
end
