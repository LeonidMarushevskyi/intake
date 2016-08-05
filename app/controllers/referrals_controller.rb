# frozen_string_literal: true
class ReferralsController < ApplicationController
  def new
    @referral_code = LUID.generate.first
  end
end
