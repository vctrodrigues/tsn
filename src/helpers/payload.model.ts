export interface PayloadInterface {
  payload?: any[] | any;
  success: boolean;
  message?: string;
}

const createMessage = (
  success: boolean,
  message?: string,
  payload?: any[] | any,
) => {
  return {
    payload,
    success,
    message,
  };
};

export default createMessage;
