# frozen_string_literal: true
require 'rails_helper'

describe ApplicationHelper do
  describe '#format_date' do
    context 'when a valid date string is provided' do
      let(:date) { '2016-08-10' }
      it 'returns date as format MM/DD/YYYY' do
        expect(helper.format_date(date)).to eq('08/10/2016')
      end
    end

    context 'when nil is provided' do
      let(:date) { nil }
      it 'returns nil' do
        expect(helper.format_date(date)).to be_nil
      end
    end
  end
end
