/** Types for twitterapi.io responses */

export interface TweetHashtag {
	text: string;
}

export interface TweetUrl {
	display_url: string;
	expanded_url: string;
	url: string;
}

export interface TweetUserMention {
	id_str: string;
	name: string;
	screen_name: string;
}

export interface TweetEntities {
	hashtags: TweetHashtag[];
	urls: TweetUrl[];
	user_mentions: TweetUserMention[];
}

export interface TweetAuthor {
	id: string;
	userName: string;
	name: string;
	profilePicture: string;
	description: string;
	followers: number;
	following: number;
	location: string;
	createdAt: string;
	isVerified: boolean;
	isBlueVerified: boolean;
}

export interface Tweet {
	id: string;
	text: string;
	url: string;
	createdAt: string;
	likeCount: number;
	retweetCount: number;
	replyCount: number;
	quoteCount: number;
	viewCount: number;
	bookmarkCount: number;
	lang: string;
	isReply: boolean;
	isRetweet: boolean;
	entities: TweetEntities;
	author: TweetAuthor;
	quoted_tweet?: Tweet;
	retweeted_tweet?: Tweet;
}

export interface TweetResponse {
	tweets: Tweet[];
	has_next_page: boolean;
	next_cursor: string;
}

export interface GetUserLastTweetsOptions {
	userName: string;
	cursor?: string;
}
