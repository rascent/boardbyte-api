import { createMixin } from 'schemix';

export default createMixin((TimestampMixin) => {
  TimestampMixin.dateTime('createdAt', { default: { now: true } }).dateTime('updatedAt', { updatedAt: true });
});
