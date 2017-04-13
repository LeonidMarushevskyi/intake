# frozen_string_literal: true
require 'spec_helper'

shared_examples_for 'an authenticated controller action' do
  context 'when authentication is enabled' do
    before do
      allow(Feature).to receive(:active?)
        .with(:authentication).and_return(true)
    end

    it 'calls authenticate user' do
      expect(controller).to receive(:authenticate_user)
      subject
    end
  end

  context 'when authentication is disabled' do
    before do
      allow(Feature).to receive(:active?)
        .with(:authentication).and_return(false)
    end

    it 'does not call authenticate user' do
      expect(controller).to_not receive(:authenticate_user)
      subject
    end
  end
end
