// All user related data

import { session } from '$app/stores';
import { writable, get } from 'svelte/store';
import { client, gql } from '$lib/graphql';

export const likes = writable([], (set) => {
	const { user } = get(session);

	if (user) {
		client
			.request(
				gql`
					query myLikes($user_id: uuid!) {
						like(where: { user_id: { _eq: $user_id } }) {
							media_id
						}
					}
				`,
				{
					user_id: user.id
				}
			)
			.then(({ like }) => set(like.map(({ media_id }) => media_id)))
			.catch((error) => console.log('error fetching likes', error));
	}
});

export async function addLike(id: string): Promise<void> {
	await client.request(
		gql`
			mutation addLike($id: uuid!) {
				insert_like(objects: { media_id: $id }) {
					affected_rows
				}
			}
		`,
		{ id }
	);
}

export async function removeLike(id: string): Promise<void> {
	await client.request(
		gql`
			mutation removeLike($id: uuid!) {
				delete_like(where: { media_id: { _eq: $id } }) {
					affected_rows
				}
			}
		`,
		{ id }
	);
}
