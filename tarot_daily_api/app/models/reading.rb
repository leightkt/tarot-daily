class Reading < ApplicationRecord
  belongs_to :user
  belongs_to :card

  validates :question, :user_id, :card_id, :direction, presence: true
end
