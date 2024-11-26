import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { GoogleService } from "./google.service";
import { Strategy, VerifyCallback } from "passport-google-oauth20"
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService){
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
        });
    }
    
            async validate(
                accessToken: String,
                profile: any,
                done: VerifyCallback,
        ): Promise<any> {
            const { name, email, photos } = profile;
            const user = {
                email: email[0].value,
                firstname: name.givenName,
                lastname: name.familyName,
                photos: photos[0].value,
            };

            done(null, user)
    }
}