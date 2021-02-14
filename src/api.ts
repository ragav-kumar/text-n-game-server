/**
 * All defined API endpoints
 */
export const endpoints = {
	// Define new user and add to DB
	register: "register",
	// Login user
	login: "login",
	// Lengthen active user session or reactivate dormant session. Can fail.
	refresh: "refresh",
	// End user session (invalidates tokens)
	logout: "logout",
	// Attach user to channel and retrieve channel data
	channel: "channel",
	// Special endpoint to retrieve additional old messages from a channel
	channelMessages: "channel-messages",
	// Submit message to channel
	message: "message",
	// Heartbeat
	heartbeat: "heartbeat",
	// What it says on the tin.
	forgotPassword: "forgot-password",
	// What it says on the tin.
	changePassword: "change-password",
} as const;
/**
 * OAuth Token data
 */
export type Tokens = {
	// This is the token described in BaseRequest
	accessToken: string;
	// Number of seconds before the accessToken becomes invalid
	expiresIn: number;
	// Used to generate a new accessToken without forcing the user to login
	refreshToken: string;
}
/**
 * Represents one message in a channel
 */
export type Message = {
	// For server use. Can be used on client if you need a unique identifier
	id: number;
	// User who submitted this message. Bots are users too
	user: number;
	// UNIX timestamp of this message. Timezone independent!
	time: number;
	// the actual message
	text: string;
}
/**
 * Represents any given user
 */
export type User = {
	id: number;
	// while the username is unique and can be used as an identifier, it's also long
	// so I prefer an id for database usage and restrict username to display and login
	username: string;
	// Defined for currently logged in user, but not for others
	email?: string;
}
export type Channel = {
	// notice that the id is a string, not a number. This allows both dynamic and static channels
	id: string;
	// NOT guaranteed to be unique
	name: string;
	// On first request, server will only provide the last N message from the channel.
	// A separate request is necessary to retrieve older messages.
	messages: Message[];
	// All currently active users on the channel
	users: User[];
}
/**
 * This represents a full refresh of all presented data in the app
 * I need a better name for this type...
 */
export type AppData = {
	channels: Channel[];
}

/**
 * Abstract type which serves as the basis for (almost) all other requests.
 * Not exported, since app should not use this directly.
 */
type BaseRequest = {
	// Application Id. This is a compiled constant,
	// and should be unique to every app that uses this API
	clientId: string;
}
/**
 * Any requests which are based on fully logged in users should use this type
 */
type BaseLoggedInRequest = BaseRequest & {
	// OAuth Access token. Signifies the currently active user session
	token: string;
}
/**
 * The basis for all responses; this type is used by the fetch function.
 * Notice that this is a generic type; here, T is the expected data on a successful response
 * Notice that T has a default value of undefined; this allows
 * Usage syntax example: BaseResponse<LoginResponse>
 */
export type BaseResponse<T=undefined> = {
	success: false;
	data: undefined;
	error: string;
} | {
	success: true;
	data: T;
	error: undefined;
}
/**
 * A SimpleResponse is used when the client doesn't expect to receive data back from a request;
 * i.e. the client needs to know a request succeeded or failed, but no more than that.
 */
export type SimpleResponse = BaseResponse<undefined>;
/**
 * A Login request is one of only two requests when the user's password is passed between client and
 * server. It's also one of the few requests which don't inherit from BaseRequest
 */
export type LoginRequest = BaseRequest & {
	// Generally, a user can login with either their username or email
	username: string;
	password: string;
}
export type LoginResponse = {
	tokens: Tokens;
	user: User;
	appData: AppData;
	// TODO: data retrieved on login
}
/**
 * A Refresh request should be initiated if a regular requests fails with a 401 (unauthorized)
 * error. This error usually indicates that the accessToken has expired. refreshTokens are
 * maintained for much longer than accessTokens (typically, one month), so that a user can go
 * a month between sessions without having to login again. This duration is configurable server side
 */
export type RefreshRequest = BaseRequest & {
	refreshToken: string;
}
export type RefreshResponse = {
	tokens: Tokens;
}

/**
 * Logout is a very simple request, and all it does is invalidate the active accessToken and
 * refreshToken for the current user.
 */
export type LogoutRequest = BaseLoggedInRequest;

/**
 * People can't login if they don't register first!
 * Note: Registration != Login. This is to allow for email verification, once that's implemented
 */
export type RegisterRequest = BaseRequest & {
	// A username, like an email, must be unique; however, it has the advantage of not exposing
	// contact info. Thus a username can be freely displayed, while an email must be hidden.
	username: string;
	password: string;
	// Eventually, we'll want to send a verification email for stuff like forgot-password requests
	email: string;
}

export type ForgotPasswordRequest = BaseRequest & {
	email: string;
}
export type ChangePasswordRequest = BaseLoggedInRequest & {
	currentPassword: string;
	newPassword: string;
}

/**
 * A select / change channel request should take form of a channel name
 * Since DMs are just dynamic channels, the server will generate a unique string to identify them
 */
export type SelectChannelRequest = BaseLoggedInRequest & {
	channel: string;
}
export type SelectChannelResponse = Channel;