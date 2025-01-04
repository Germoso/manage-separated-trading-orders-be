import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { TickerModule } from 'src/modules/ticker/ticker.module';
import { PositionModule } from './position/position.module';

@Module({
  imports: [
    JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '4h' },
    }),
    UserModule,
    PrismaModule,
    AuthModule,
    AccountModule,
    TickerModule,
    PositionModule
  ],
  controllers: [AppController],
  providers: [AppService,     {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },],
})

export class AppModule {}
