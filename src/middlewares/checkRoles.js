import createHttpError from 'http-errors';
import { getContactsById } from '../services/contacts.js';

export const checkContactbyId = () => async (req, res, next) => {
  const userId = req.user._id.toString();
  const { contactId } = req.params;

  const getContact = await getContactsById(contactId);

  if (!getContact || getContact.userId.toString() !== userId) {
    next(
      createHttpError(
        404,
        res.status(404).json({
          status: 404,
          message: `Contact with ID ${contactId} not found`,
          data: { message: 'Contact not found' },
        })
      )
    );
    return;
  }

  next();
};
