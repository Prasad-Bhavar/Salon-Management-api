export const apiResponse = (
  res: any,
  response: {
    statusCode: number;
    message: string;
    data?: any;
  }
) => {
  return res.status(response.statusCode).json({
    success: true,
    message: response.message,
    data: response.data ?? null,
  });
};