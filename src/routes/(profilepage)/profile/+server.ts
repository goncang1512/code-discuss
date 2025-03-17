import { json } from '@sveltejs/kit';

export const GET = async () => {
	const users = [
		{
			id: 'user1',
			name: 'Goncang',
			email: 'goncang@example.com'
		},
		{
			id: 'user2',
			name: 'Amri',
			email: 'amri@example.com'
		},
		{
			id: 'user3',
			name: 'Ferdy',
			email: 'ferdy@example.com'
		},
		{
			id: 'user4',
			name: 'Reyhan',
			email: 'reyhan@example.com'
		},
		{
			id: 'user5',
			name: 'Arifan',
			email: 'arifan@example.com'
		}
	];

	return json(users, { status: 200 });
};
