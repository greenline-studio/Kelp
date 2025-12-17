// In a real production app, these would be handled via a backend proxy to avoid exposure
// and CORS issues. For this demo, we simulate the Yelp connection via Gemini's knowledge base.

export const YELP_API_CONFIG = {
  CLIENT_ID: "6V2L2db51mRgcfi_mx7iEA",
  API_KEY: "ii9K62yBQ3HUgO2f96HP4IM8xEhhTsUWYmSUGAta0oOiWVxoXttZQwHOelrpHUt_QNnxmQUDlHtJ_FPTyLWsaY7jbhizJMRxIHjXwrGIebSlb8ZPLy4U-bMa8SBCaXYx"
};

export const MOCK_USER_ID = "guest-user-" + Math.floor(Math.random() * 10000);

export const DEFAULT_PREFERENCES = {
  location: '',
  vibe: '',
  budget: '$$',
  time: 'evening',
  groupSize: 2
};
