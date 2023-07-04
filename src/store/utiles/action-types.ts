export interface AlertInfo {
  content: string,
  show: boolean,
  type: string,
}

export interface SpinnerInfo{
  content: string;
  show: boolean;
}

export interface UtilesState {
  alert: AlertInfo;
  spinner: SpinnerInfo;
}

export const ALERT_SET_ACTION = "ALERT_SET_ACTION";
export const ALERT_ACTION = "ALERT_ACTION";
export const SET_SPINNER = "SET_SPINNER";


export const ERROR = "ERROR";


interface showAlert {
  type: typeof ALERT_SET_ACTION;
  payload: {
    msg: string;
    flg: string;
  };
}

interface closeAlert {
  type: typeof ALERT_ACTION;
  payload: {
    
  };
}

interface spinnerAction {
  type: typeof SET_SPINNER;
  payload: {
    flag: boolean;
    content: string;
  };
}

export type ActionTypes = showAlert | closeAlert | spinnerAction;
