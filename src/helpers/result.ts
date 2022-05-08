const getResultMessage = (status: boolean, data?: any, msg?: string) => ({
  status: status ? 'success' : 'error',
  ...(data && { data }),
  ...(msg && { msg }),
});

export default getResultMessage;
