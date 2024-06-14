import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactsById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to retrieve contacts',
      error: error.message,
    });
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactsById(contactId);
    if (!contact) {
      return next(
        createHttpError(404, {
          status: 404,
          message: `Contact with ID ${contactId} not found`,
          data: { message: 'Contact not found' },
        })
      );
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with ID ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(
      createHttpError(500, {
        status: 500,
        message: 'Internal server error',
        data: { message: error.message },
      })
    );
  }
};

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);
  if (!result) {
    next(
      createHttpError(404, {
        status: 404,
        message: `Contact with ID ${contactId} not found`,
        data: { message: 'Contact not found' },
      })
    );
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);
  if (!contact) {
    next(
      createHttpError(404, {
        status: 404,
        message: `Contact with ID ${contactId} not found`,
        data: { message: 'Contact not found' },
      })
    );
    return;
  }
  res.status(204).send();
};
