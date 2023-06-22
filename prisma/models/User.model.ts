import { createModel } from 'schemix';

import SoundModel from './Sound.model';
import RoleEnum from '../enums/Role.enum';

export default createModel((UserModel) => {
  UserModel.string('id', {
    id: true,
    // @ts-ignore
    default: { auto: true },
    map: '_id',
    raw: '@database.ObjectId',
  })
    .string('email', { unique: true })
    .string('name')
    .string('password', { optional: true })
    .string('provider', { optional: true })
    .string('providerId', { optional: true })
    .string('picture', { optional: true })
    .string('refreshToken', { optional: true })
    .enum('role', RoleEnum, { default: 'User' })
    .relation('sounds', SoundModel, { list: true })
    .map('users');
});
