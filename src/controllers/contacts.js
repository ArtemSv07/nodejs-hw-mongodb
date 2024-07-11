import createHttpError from 'http-errors';

import {
  getAllContacts,
  getContactsById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

export const getContactsController = async (req, res) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const userId = req.user._id;

    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId,
    });
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
  const userId = req.user._id.toString();

  const { contactId } = req.params;
  try {
    const contact = await getContactsById(contactId);

    if (!contact || contact.userId.toString() !== userId) {
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
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with ID ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(
      createHttpError(
        500,
        res.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: { message: error.message },
        })
      )
    );
  }
};

export const createContactController = async (req, res) => {
  const userId = req.user._id;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contact = await createContact({ ...req.body, userId, photo: photoUrl });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateContact(contactId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  await deleteContact(contactId);
  res.status(204).send();
};
