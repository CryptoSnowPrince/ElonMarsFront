import { ALERT_SET_ACTION, ALERT_ACTION, SET_SPINNER } from "./action-types";


export function onShowAlert(message:string, flg:string) {
  return async (dispatch: any) => {
    dispatch({
      type: ALERT_SET_ACTION,
      payload: {
        msg: message,
        flg: flg
      }
    });
  }
}

export function handleAlert() {
  return async (dispatch: any) => {
    dispatch({
      type: ALERT_ACTION,
    });
  }
}


export function handleSpinner(flag: boolean, content: string) {
  return async (dispatch: any) => {
    dispatch({
      type: SET_SPINNER,
      payload: {
        flag,
        content
      }
    });
  }
}
