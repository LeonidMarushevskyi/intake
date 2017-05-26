# frozen_string_literal: true

require File.join(File.dirname(__FILE__), 'routes/inactive_release_one_constraint')
require File.join(File.dirname(__FILE__), 'routes/active_referral_submit_constraint')

Rails.application.routes.draw do
  root 'home#index'

  resources :screenings,
    only: %i[show edit],
    constraints: Routes::InactiveReleaseOneConstraint do
  end

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :screenings,
        only: %i[show create update index],
        constraints: Routes::InactiveReleaseOneConstraint do
        member do
          get 'history_of_involvements'
          get 'relationships' => 'relationships#by_screening_id'
          post 'submit', constraints: Routes::ActiveReferralSubmitConstraint
        end
      end

      resources :participants, only: %i[create destroy update]
      resource :people, only: [:search] do
        collection do
          get 'search'
        end
      end

      resources :people,
        only: %i[create update show],
        constraints: Routes::InactiveReleaseOneConstraint
    end
  end

  resources :people,
    only: %i[new edit show],
    constraints: Routes::InactiveReleaseOneConstraint

  resources :version, only: :index

  scope host: Rails.application.config.intake[:api_url] do
    get 'api/v1/people/:id' => 'dev#null', as: :intake_api_person
    get 'api/v1/people' => 'dev#null', as: :intake_api_people
    get 'api/v1/people_search' => 'dev#null', as: :intake_api_people_search
    get 'api/v2/people_search' => 'dev#null', as: :intake_api_people_search_v2
    get 'api/v1/screenings' => 'dev#null', as: :intake_api_screenings
    get 'api/v1/screenings/:id' => 'dev#null', as: :intake_api_screening
    get 'api/v1/screenings/:id/history_of_involvements' => 'dev#null',
        as: :intake_api_history_of_involvements
    post 'api/v1/screenings/:id/submit' => 'dev#null', as: :intake_api_screening_submit
    get 'api/v1/participants' => 'dev#null', as: :intake_api_participants
    get 'api/v1/participants/:id' => 'dev#null', as: :intake_api_participant
    get 'api/v1/screenings/:id/relationships' => 'dev#null',
        as: :intake_api_relationships_by_screening
  end
end
