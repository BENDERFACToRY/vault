export type myLikes = {
	readonly input: myLikes$input;
	readonly result: myLikes$result;
};

export type myLikes$result = {
	readonly like: {
		readonly media_id: string;
	}[];
};

export type myLikes$input = {
	userId: string;
};
