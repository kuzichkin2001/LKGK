export const filterContactName = contact =>
  contact.displayName ||
  contact.givenName ||
  contact.middleName ||
  contact.company;
