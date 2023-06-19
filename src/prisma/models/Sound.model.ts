import { createModel } from 'schemix';

import UserModel from './User.model';
import TimestampMixin from '../mixins/Timestamp.mixin';

export default createModel((SoundModel) => {
  SoundModel.string('id', {
    id: true,
    // @ts-ignore
    default: { auto: true },
    map: '_id',
    raw: '@database.ObjectId',
  })
    .string('title')
    .string('imageURL', { optional: true })
    .boolean('selling')
    .string('soundURL', { optional: true })
    .relation('author', UserModel, { fields: ['authorId'], references: ['id'] })
    .string('authorId', { raw: '@database.ObjectId' })
    .mixin(TimestampMixin)
    .map('sounds');
});
