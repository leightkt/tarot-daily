class UsersController < ApplicationController
    before_action :find_user, only: [:show, :destroy, :update]
    skip_before_action :authorized, only: [:create, :login]

    def index
        @users = User.all
        render json: @users
    end

    def show
        render json: @user, include: :readings
    end
    
    def create
        @user = User.new(user_params)
        if @user.valid?
            @user.save
            render json: @user
        else
            render json: {errors: @user.errors.full_messages}, status: :unprocessable_entity
        end
    end

    def update
        if @user.update(user_params)
            render json: @user
        else
            render json: {errors: @user.errors.full_messages}, status: :unproccessable_entity
        end
    end

    def destroy
        @user.destroy
        render json: {Message: "User: #{@user.user_name} destoryed"}
    end

    def login
        @user = User.find_by(user_name: params[:user][:user_name])
        if @user && @user.authenticate(params[:user][:password])
            @token = JWT.encode({user_id: @user.id}, Rails.application.secrets.secret_key_base[0])
            render json: {user_id: @user.id, token: @token}
        else
            render json: {errors: "Invalid Credentials"}, status: :unauthorized
        end
    end

    private

    def find_user
        @user = User.find(params[:id])
    end

    def user_params
        params.require(:user).permit(:name, :user_name, :password, :star_sign)
    end
end
