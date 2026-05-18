export const asyncHandler =
  (fn: any) =>
  (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);


//   asyncHandler
//      ↓
// runs your controller
//      ↓
// if error happens → automatically calls next(error)
//      ↓
// Express error middleware handles it