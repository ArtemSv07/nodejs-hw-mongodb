import { Router } from 'express';

import {
  getContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';

import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';

import { checkContactbyId } from '../middlewares/checkRoles.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', ctrlWrapper(getContactByIdController));

router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);

router.patch(
  '/:contactId',
  checkContactbyId(),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController)
);

router.delete(
  '/:contactId',
  checkContactbyId(),
  ctrlWrapper(deleteContactController)
);
export default router;
