class UsersController < ApplicationController
    before_action :find_user, only: [:show, :destroy, :update]

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
            render json: @user, include: :readings
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
        @user = User.find_by(user_name: params[:user_name])
        if @user
            check_password
        else
            render json: {errors: "User Not Found"}, status: :not_found
        end
    end

    def check_password
        if @user.authenticate(params[:password])
            render json: @user, include: :readings
        else 
            render json: {errors: "incorrect password"}, status: :not_found
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
