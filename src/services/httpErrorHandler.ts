export class HttpErrorHandler {
  public static errorResponseHandler(error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      const errorStatus = axiosError.response?.status;

      const getErrorMessages = (status: any) => ({
        500: 'Internal Server Error',
      }[status]);
      
      const message = errorStatus ? getErrorMessages(errorStatus) || '' : '';

      // TODO: Add toast notification
      console.log(message);
    }

    return Promise.reject(error);
  }
}
