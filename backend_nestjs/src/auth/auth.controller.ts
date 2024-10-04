import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    /**
    * Constructor for AuthController.
    * @param authService The service that handles the authentication logic.
    */
    constructor(private authService: AuthService) { }

    /**
     * This method calls the `login` method from the AuthService to authenticate the user.
     * @param loginDto The login credentials provided by the user (email and password).
     * @returns A token or authentication details if the login is successful.
     * @throws UnauthorizedException If the email or password is incorrect.
     */
    @Post('login')
    async login(@Body() loginDto: { email: string, password: string }) {
        const { email, password } = loginDto;
        return this.authService.login(email, password);
    }
}
