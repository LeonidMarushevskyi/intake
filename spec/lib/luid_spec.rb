# frozen_string_literal: true
require 'spec_helper'
require 'luid'

describe LUID do
  describe ".generate" do
    it 'generates a set of 3 6-character random strings' do
      strings = LUID.generate
      expect(strings[0]).to match(/[0-9A-Z]{6}/)
      expect(strings[1]).to match(/[0-9A-Z]{6}/)
      expect(strings[2]).to match(/[0-9A-Z]{6}/)
    end
  end
end
