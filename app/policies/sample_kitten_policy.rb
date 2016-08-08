# frozen_string_literal: true

class SampleKittenPolicy < ApplicationPolicy # :nodoc:
  attr_reader :user, :sample_kitten

  def initialize(user, sample_kitten)
    @user = user
    @sample_kitten = sample_kitten
  end

  def allowed_to_pet?
    user.first_name == 'Kitty'
  end
end
