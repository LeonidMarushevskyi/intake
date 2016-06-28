describe 'RSpec sample unit test' do
  it 'has a working unit test' do
    cute_kitten = double(:kitten, color: 'black')

    expect(cute_kitten.color).to eq('black')
  end
end
