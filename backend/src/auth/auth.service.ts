import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getDemoUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tenantId: true,
      },
    });
    return users;
  }

  async login(email: string, passwordHashOrPlain: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: { tenant: true },
    });

    if (!user) {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    // Support both direct password123 match or bcrypt
    const isMatch =
      passwordHashOrPlain === 'password123' ||
      (await bcrypt.compare(passwordHashOrPlain, user.passwordHash).catch(() => false));

    if (!isMatch) {
      throw new UnauthorizedException('Password salah');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      name: user.name,
    };

    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenant: user.tenant,
      },
    };
  }
}
