import { createEnum } from 'schemix';

export default createEnum((RoleEnum) => {
  RoleEnum.addValue('User').addValue('Admin');
});
