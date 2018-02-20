# frozen_string_literal: true

# Snapshot Controller handles all service request for
# the creation and of screenings that are snapshots.
module Api
  module V1
    class SnapshotsController < ApiController # :nodoc:
      def create
        new_snapshot = Screening.new(
          reference: LUID.generate.first,
          indexable: false
        )
        snapshot = ScreeningRepository.create(session[:security_token], new_snapshot)
        render json: snapshot
      end

      def history_of_involvements
        involvements = ScreeningRepository.history_of_involvements(
          session[:security_token], params[:id]
        )
        render json: involvements
      end

      def relationships
        relationships = RelationshipsRepository.find_by_screening_id(
          session[:security_token], params[:id]
        )
        render json: relationships
      end
    end
  end
end
