const parseContactType = contactType => {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const isContactType = contactType =>
    ['work', 'home', 'personal'].includes(contactType);

  if (isContactType(contactType)) return contactType;
};

const parseBoolean = value => {
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return undefined;
};

export const parseFilterParams = query => {
  const { contactType, isFavourite } = query;

  const parsedcontactType = parseContactType(contactType);
  const parsedIsFavourite = parseBoolean(isFavourite);

  return {
    contactType: parsedcontactType,
    isFavourite: parsedIsFavourite,
  };
};
