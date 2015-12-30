import { Plant } from '../models/plant';
import { error, warning } from '../logger';

const initialState = {
  all: Plant.fakes
};

var action_handlers = {
  DEFAULT: function(state, action) {
    return state;
  },
  ADD_PLANT_SUCCESS: function(state, action) {
    state = _.cloneDeep(state)
    state.all.push(action.payload);
    return state;
  },
  ADD_PLANT_FAILURE: function(state, action) {
    error("Unable to add plant.");
    return state;
  },
  FETCH_PLANTS_SUCCESS: function(state, action) {
    state = _.cloneDeep(state)
    state.all = action.payload;
    return state;
  },
  FETCH_PLANTS_FAILURE: function(state, action) {
    warning("Unable to download plants. Check your internet connection.");
    return state;
  },
}

export function plantReducer(state = initialState, action) {
  var handler = (action_handlers[action.type] || action_handlers.DEFAULT);
  console.log(action.type, state.all)
  return handler(state, action);
}
