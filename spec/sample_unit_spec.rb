require 'rails_helper'

describe 'RSpec sample unit test' do
  it 'has a working unit test' do
    cute_kitten = double(:kitten, color: 'black')

    expect(cute_kitten.color).to eq('black')
  end

  it 'has working factory' do
    kitten = FactoryGirl.build(:kitten)
    expect(kitten.name).to be
    expect(kitten.color).to be
  end
end
