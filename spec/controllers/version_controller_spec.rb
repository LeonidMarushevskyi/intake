# frozen_string_literal: true

require 'rails_helper'

describe VersionController do
  describe '#index' do
    let(:sha) { SecureRandom.hex(36) }

    it 'gets the sha of the latest git commit' do
      expect(subject).to receive(:`).and_return sha
      process :index, method: :get
      assert_response :success
      expect(JSON.parse(response.body)['version']).to eq(sha)
    end

    it 'does not break if git is not installed on system' do
      expect(subject).to receive(:`).and_return `(exit 127)`
      process :index, method: :get
      assert_response :success
      expect(JSON.parse(response.body)['version']).to eq('Git not found')
    end

    it 'includes the values included in intake config' do
      expect(Rails.configuration).to receive(:intake).and_return(foo: 'bar')
      process :index, method: :get
      assert_response :success
      expect(JSON.parse(response.body)['foo']).to eq('bar')
    end

    it 'includes active features' do
      expect(Feature).to receive(:active_features).and_return(%w[foo bar])
      process :index, method: :get
      assert_response :success
      expect(JSON.parse(response.body)['active_features']).to eq(%w[foo bar])
    end

    it 'converts the information to pretty json' do
      expect(JSON).to receive(:pretty_generate)
      process :index, method: :get
    end
  end
end
