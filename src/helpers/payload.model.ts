export interface PayloadInterface {
  payload?: any[] | any;
  success: boolean;
  message?: string;
}

export interface Validation {
  validated: boolean;
  field?: string;
}

const createMessage = (
  success: boolean,
  message?: string,
  payload?: any[] | any,
  field?: string,
) => {
  return {
    payload,
    success,
    message,
    field,
  };
};

export default createMessage;
