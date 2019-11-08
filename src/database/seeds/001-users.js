import { createItem } from '../query/helper';
import { hashPassword } from '../../utils'
const users = [
	{
		id: '11111',
		firstName: 'kelvin',
		lastName: 'heart',
		email: 'oliver4@gmail.com',
		gender: 'male',
		jobRole: 'techonologist',
		department: 'tech',
		address: 'oshodi , lagos',
		userRole: 'employee',
		password: hashPassword('password'),
	},
	{
		id: '11112',
		firstName: 'oliver',
		lastName: 'kelechi',
		email: 'admin@gmail.com',
		gender: 'female',
		jobRole: 'support assist',
		department: 'support',
		address: 'ph city',
		userRole: 'admin',
		password: hashPassword('devcAdmin'),
	}
];

export default () => {
	users.forEach(async (user) => {
		const { error } = await createItem('users', user);
		if (error) throw new Error(error);
	});
};