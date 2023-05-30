function validateUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }  
}
  
module.exports = { validateUrl };