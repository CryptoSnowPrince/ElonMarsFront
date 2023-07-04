import { UtilesState, ActionTypes } from "./action-types";
import { ALERT_SET_ACTION, ALERT_ACTION, SET_SPINNER } from "./action-types";

const initialState: UtilesState = {
  alert: {
    content: "",
    show: false,
    type: "success",
  },
  spinner:{
    content: "",
    show: false,

  }
};

export function utilesReducer(state = initialState, action: ActionTypes): UtilesState {
  switch (action.type) {
    case ALERT_SET_ACTION: {
      const {msg, flg} = action.payload;
      const {alert, spinner} = {...state};

      alert.content = msg;
      alert.type = flg;
      alert.show = true;

      return {alert, spinner};
    }

    case ALERT_ACTION: {
      const {alert, spinner} = {...state};
      alert.show = false;

      return {alert, spinner};
    }

    case SET_SPINNER: {
      const {alert, spinner} = {...state};
      const {flag, content} = action.payload;

      spinner.show = flag;
      spinner.content = content;

      return {alert, spinner};
    }

    default:
      return { ...state };
  }
}
