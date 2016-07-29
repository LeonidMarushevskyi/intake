require 'rails_helper'

describe 'Pundit' do
  context 'is installed correctly' do
    let(:kitten) { SampleKitten.new }

    it 'and allows a permitted action' do
      current_user = FactoryGirl.build(:user, first_name: 'Kitty')
      authorized = Pundit.authorize(current_user, kitten, :allowed_to_pet?)

      expect(authorized).to eq true
    end

    it 'and forbids a forbidden action' do
      current_user = FactoryGirl.build(:user, first_name: 'NotKitty')

      expect{Pundit.authorize(current_user, kitten, :allowed_to_pet?)}
        .to raise_error(Pundit::NotAuthorizedError)
    end
  end
end
