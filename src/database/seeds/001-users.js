import { createItem } from '../query/helper';
const users = [
	{
		id: '1112233',
		name: 'kelechi oliver',
		email: 'oliver@gmail.com',
		password: 'oliverk',
		role: 'admin'
  },
  {
    id: '1112233',
    name: 'kelechi oliver',
    email: 'oliver@gmail.com',
    password: 'oliverk',
    role: 'admin'
  }
];

export default () => {
	users.forEach((user) => {
		createItem('users', user);
	});
};
