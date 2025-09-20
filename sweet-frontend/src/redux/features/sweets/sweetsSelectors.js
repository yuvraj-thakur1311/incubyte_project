// redux/features/sweets/sweetsSelectors.js
export const selectSweets = (state) => state.sweets.sweets; 
export const selectSweetsLoading = (state) => state.sweets.loading;
export const selectSweetsError = (state) => state.sweets.error;
