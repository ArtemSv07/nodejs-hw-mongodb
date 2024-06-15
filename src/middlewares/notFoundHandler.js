import createError from 'http-errors';

export const notFoundHandle = (req, res, next) => {
  next(
    createError(
      res.status(404).json({
        message: 'Not found',
      })
    )
  );
};
