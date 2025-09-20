export const selectAuth = (state) => state.auth;

export const selectIsAuthenticated = (state) => Boolean(state.auth.token);

export const selectUser = (state) => state.auth.user;

export const selectAuthError = (state) => state.auth.error;
