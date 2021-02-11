class User < ApplicationRecord
    has_secure_password

    has_many :readings, dependent: :destroy
    has_many :cards, through: :readings

    validates :name, :user_name, :password, :star_sign, presence: true
    validates :user_name, length: {in: 6..12, message: "%{attribute} must be between 6 and 12 characters"}
    validates :user_name, uniqueness: {message: "must be unique and %{value} has already been taken"}
end
