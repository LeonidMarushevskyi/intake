# frozen_string_literal: true

require 'rails_helper'

describe VersionController do
  describe '#index' do
    let(:sha) { SecureRandom.hex(36) }

    it 'gets the sha of the latest git commit' do
      allow(subject).to receive(:`).and_return sha
      process :index, method: :get
      assert_response :success
      expect(response.body).to eq(sha)
    end

    it 'does not break if git is not installed on system' do
      allow(subject).to receive(:`).and_return `(exit 127)`
      process :index, method: :get
      assert_response :success
      expect(response.body).to eq('Git not found')
    end
  end
end
