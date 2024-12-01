/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';
//import { nanoid } from 'nanoid';
import { OTP } from './schemas/o-t-p.schema';
import { MailService } from 'src/services/mail.service';
import { RolesService } from 'src/roles/roles.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
    @InjectModel(OTP.name)
    private OTPModel: Model<OTP>,
    private jwtService: JwtService,
    private mailService: MailService,
    private rolesService: RolesService,
  ) { }

  async signup(signupData: SignupDto) {
    const { email, password, name, role } = signupData;
    //const { email, password, name, roleId } = signupData;

    const roleO = await this.rolesService.getRoleByName(role);
    // Check if email is in use
    const emailInUse = await this.UserModel.findOne({ email });
    if (emailInUse) {
      throw new BadRequestException('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document and save in MongoDB
    const createdUser = await this.UserModel.create({
      //  roleId,
      name,
      email,
      password: hashedPassword,
      roleId: roleO._id,
    });
    const populatedUser = await createdUser.populate('roleId');



    const secret = process.env.JWT_SECRET;
    const confirmationToken = jwt.sign({ email }, secret, { expiresIn: '1h' });

    this.mailService.sendConfirmEmail(email, confirmationToken);

    // Return the response with statusCode and user information
    return {
      statusCode: HttpStatus.OK,
      data: populatedUser,
      message: "Registration successful! A confirmation email has been sent. Please check your inbox."
    };
  }

  async confirmEmail(token: string) {
    try {
      const secret = process.env.JWT_SECRET;
      const decoded = jwt.verify(token, secret);
      const email = decoded['email'];
      const user = await this.findUserByEmail(email);
      if (!user) throw new Error('User not found');
      user.isVerfied = true;
      await user.save();
      return { message: 'Email confirmed successfully', email };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }

  }
  async login(credentials: LoginDto) {

    const { email, password } = credentials;

    // Find if user exists by email
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    // Compare entered password with existing password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials this erorr ids from our');
    }
    if (!user.isVerfied) {
      throw new UnauthorizedException('You most confirm your email');
    }

    // Generate JWT tokens
    const tokens = await this.generateUserTokens(user._id);


    const populatedUser = await user.populate('roleId');

    console.log(populatedUser.roleId.name);
    // Return response with statusCode and user information
    return {
      statusCode: HttpStatus.OK,
      userId: populatedUser._id,
      userName: populatedUser.name,
      userEmail: populatedUser.email,
      userRole: populatedUser.roleId.name,

      ...tokens,
    };
  }


  async loginGoogle(credentials: LoginDto) {

    const { email, password } = credentials;

    // Find if user exists by email
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    // Compare entered password with existing password
    const passwordMatch = password == user.password;
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials this erorr ids from our');
    }

    // Generate JWT tokens
    const tokens = await this.generateUserTokens(user._id);

    // Return response with statusCode and user information
    return {
      statusCode: HttpStatus.OK,
      userId: user._id,
      //userName: user.name,
      //userEmail: user.email,
      //userPassword: user.password,

      ...tokens,
    };
  }


  async changePassword(oldPassword: string, newPassword: string, userId: string) {
    //Find the user
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found...');
    }

    //Compare the old password with the password in DB
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials update the user id id    ---' + user.id + "and the password send by the user is " + oldPassword);
    }

    //Change user's password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;
    await user.save();
    return { statusCode: HttpStatus.OK }
  }

  async forgotPassword(email: string) {
    //Check that user exists
    const user = await this.UserModel.findOne({ email });

    if (user) {
      //If user exists, generate password reset link
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      //const resetToken = nanoid(64);
      await this.OTPModel.create({
        otp: otp,
        userId: user._id,
        expiryDate,
      });
      //Send the link to the user by email
      this.mailService.sendPasswordResetEmail(email, otp);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'If this user exists, they will receive an email',
    };

  }

  async verifyOtp(recoveryCode: string) {
    const otp = await this.OTPModel.findOne({
      otp: recoveryCode,
      expiryDate: { $gte: new Date() },
    });
    if (!otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Generate temporary token for password reset
    const resetToken = this.jwtService.sign(
      { userId: otp.userId },
      { expiresIn: '10m' } // Set short expiration time for security
    );

    // Delete OTP after successful verification
    await this.OTPModel.deleteOne({ otp: recoveryCode });

    return { statusCode: HttpStatus.OK, resetToken };
  }

  async resetPassword(newPassword: string, resetToken: string) {
    try {
      // Verify reset token and extract user ID
      const payload = this.jwtService.verify(resetToken);
      const userId = payload.userId;

      // Retrieve the user and update password
      const user = await this.UserModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      return { statusCode: HttpStatus.OK, message: 'Your password has been changed successfully!' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }



  async refreshTokens(refreshToken: string) {
    const token = await this.RefreshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Refresh Token is invalid');
    }
    return this.generateUserTokens(token.userId);
  }

  async generateUserTokens(userId) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '10h' });
    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(token: string, userId: string) {
    // Calculate expiry date 3 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.RefreshTokenModel.updateOne(
      { userId },
      { $set: { expiryDate, token } },
      {
        upsert: true,
      },
    );
  }

  async getUserPermissions(userId: string) {
    const user = await this.UserModel.findById(userId);

    if (!user) throw new BadRequestException();

    const role = await this.rolesService.getRoleById(user.roleId.toString());
    return role.permissions;
  }



  async findUserByEmail(email: string): Promise<User | null> {
    return this.UserModel.findOne({ email }).exec();
  }


  async findUserById(userId: string) {
    // Validate the ID format before querying the database
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID format');
    }

    const user = await this.UserModel.findById(userId).exec();

    if (!user) {

      return user

    }

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.UserModel.find().exec();
      return users;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }



  async findOrCreateUser(profile: any) {
    const email = profile.emails[0].value;
    const name = profile.displayName;
    
    // Check if the user already exists
    let user = await this.findUserByEmail(email);
    if (!user) {
      // If user doesn't exist, create a new one with a placeholder password
      const newUser: SignupDto = {
        email,
        name,
        password: '', // Leave main password empty as it's handled by Google
        role:"patient",
      };
      const signupResult = await this.signup(newUser);
      user = signupResult.data; // Access the created user directly from the signup result

    }

    return user;
  }

  async upadetuserInformation(name: string, email: string, userId: string) {
    try {
      // Try to find the user by ID
      const user = await this.UserModel.findById(userId);

      // If user is not found, throw a 404 Not Found exception
      if (!user) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        });
      }

      // Update user's information
      user.email = email;
      user.name = name;
      await user.save();

      // Return a success response with the updated user data
      return {
        statusCode: HttpStatus.OK,
        userdata: user
      };
    } catch (error) {
      // Handle cases where the userId format is invalid
      if (error.name === 'CastError') {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid user ID format',
        });
      }
      // Re-throw any other error for global error handling
      throw error;
    }
  }

}