# frozen_string_literal: true

require File.join(File.dirname(__FILE__), 'routes/inactive_release_one_constraint')
require File.join(File.dirname(__FILE__), 'routes/inactive_release_two_constraint')
require File.join(File.dirname(__FILE__), 'routes/inactive_release_one_and_two_constraint')
require File.join(File.dirname(__FILE__), 'routes/active_referral_submit_constraint')

Rails.application.routes.draw do
  root 'home#index'

  resources :screenings,
    only: %i[edit],
    constraints: Routes::InactiveReleaseOneConstraint do
  end

  resources :screenings,
    only: %i[show],
    constraints: Routes::InactiveReleaseOneAndTwoConstraint do
  end

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :screenings,
        only: %i[index],
        constraints: Routes::InactiveReleaseOneAndTwoConstraint

      resources :screenings,
        only: %i[update],
        constraints: Routes::InactiveReleaseOneAndTwoConstraint

      resources :screenings,
        only: %i[show create],
        constraints: Routes::InactiveReleaseOneConstraint do
        member do
          get 'history_of_involvements'
          get 'relationships' => 'relationships#by_screening_id'
          post 'submit', constraints: Routes::ActiveReferralSubmitConstraint
        end
      end

      resources :participants, only: %i[create destroy]

      resources :participants,
        only: %i[update],
        constraints: Routes::InactiveReleaseTwoConstraint

      resource :people, only: [:search] do
        collection do
          get 'search'
        end
      end

      resources :people,
        only: %i[create update show],
        constraints: Routes::InactiveReleaseOneAndTwoConstraint
    end
  end

  resources :people,
    only: %i[new edit show],
    constraints: Routes::InactiveReleaseOneAndTwoConstraint

  resources :version, only: :index

  get "/pages/*id" => 'pages#show', as: :page, format: false
  
end
