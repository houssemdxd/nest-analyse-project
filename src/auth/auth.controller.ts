/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Get, Body, Controller, Post, Put, Req, UseGuards, Query, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-tokens.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { GoogleAuthGuard } from './google-auth.guard';
import { userInfo } from 'os';
import { log } from 'console';
import { UpdateUserIndoDto } from './dtos/update-userInfo.dto'
import { ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';


interface AuthRequest extends Request {
  user?: any; // Define `user` based on what GoogleAuthGuard attaches
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @ApiResponse({ status: 201, description: 'User account created successfully .' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async signUp(@Body() signupData: SignupDto) {
    console.log("this function of sign up is callled ");
    return this.authService.signup(signupData);
  }

  @Get('confirm-email')
  async confirmEmail(@Query('token') token: string) {
    console.log(token);
    return this.authService.confirmEmail(token);
  }

  @Post('login')
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials or unauthorized access.',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Invalid email or password',
        },
      },
    },
  })
  
  @ApiResponse({ status: 200, description: 'login successfully .' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async login(@Body() credentials: LoginDto) {
    console.log("login ;;;;");
    return this.authService.login(credentials);
  }

  @Get('users')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Post('refresh')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  // @UseGuards(AuthenticationGuard)
  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
  ) {
    return this.authService.changePassword(
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
      changePasswordDto.userId,

    );
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const { recoveryCode } = verifyOtpDto;
    console.log(recoveryCode)

    // Call the service to verify the OTP and get the reset token
    const result = await this.authService.verifyOtp(recoveryCode);
    return result; // Returns the reset token
  }

  @Put('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const { newPassword, resetToken } = resetPasswordDto;

    // Call the service to reset the password

    const result = await this.authService.resetPassword(newPassword, resetToken);
    return result; // Success message after password reset

  }


  // Google login initiation
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    // Initiates the Google OAuth flow
  }

  // Google login redirect
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginRedirect(@Req() req: AuthRequest) { // Use AuthRequest to access req.user

    var userDto = new LoginDto()
    userDto.email = req.user.email
    userDto.password = req.user.password

    return this.authService.loginGoogle(req.user)
    //this.authService.login(userDto) // Log in the user

  }









  @Put('update-user')
  async upadteUserInfo(@Body() updateuserinfo: UpdateUserIndoDto) {

    // Call the service to reset the password
    var email = updateuserinfo.email;
    var name1 = updateuserinfo.name;
    var userId = updateuserinfo.userId;

    const result = await this.authService.upadetuserInformation(name1, email, userId);
    return result; // Success message after password reset

  }

  @Put('user-banne/:userId')
  async setIsBanne(@Param('userId') userId: string){
    console.log("--------------ban user");
    return await this.authService.setIsBanned(userId);
  }

}
