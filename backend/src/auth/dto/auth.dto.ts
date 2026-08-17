import { IsEmail, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail({}, { message: 'El formato del correo es inválido' })
  email!: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;
}
