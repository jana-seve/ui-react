function validateRequired(value) {
  if (!value) {
    return 'required field';
  }
}

function validateOrgAddress(value, values) {
  if (values.org_name && !value) {
    return 'required field';
  }
}

export { validateRequired, validateOrgAddress };
