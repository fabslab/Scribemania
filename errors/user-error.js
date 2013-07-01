
// Function to create an Error object that indicates a user error rather than
// an application level error.
module.exports = function UserError(msg) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.message = msg;
  this.name = "UserError";
}