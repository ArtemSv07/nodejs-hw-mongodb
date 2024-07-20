import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import { getContactsById } from '../services/contacts.js';

export const checkContactbyId = () => async (req, res, next) => {
  const userId = req.user._id.toString();
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(400, `Invalid contact ID ${contactId}`));
  }

  try {
    const getContact = await getContactsById(contactId);
    if (!getContact || getContact.userId.toString() !== userId) {
      return next(
        createHttpError(
          404,
          res.status(404).json({
            status: 404,
            message: `Contact with ID ${contactId} not found`,
            data: { message: 'Contact not found' },
          })
        )
      );
    }
  } catch (error) {
    next(createHttpError(500, `Internal server ${error.message}`));
  }

  next();
};
