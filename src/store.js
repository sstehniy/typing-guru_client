import { createStore, applyMiddleware } from "redux";
import { combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import { uiReducer } from "./reducers/uiReducer";
import { collectionReducer } from "./reducers/collectionReducer";
import { userReducer } from "./reducers/userReducer";
import { invitationReducer } from "./reducers/invitationsReducer";

const reducer = combineReducers({
  collection: collectionReducer,
  invitations: invitationReducer,
  ui: uiReducer,
  user: userReducer,
});

export const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk))
);
