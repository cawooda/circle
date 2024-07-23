install mongoose
install express sessions

make auth free routes by adding context to graphql server:
({ req }) => {
const operationName = req.body.operationName;
if (isAuthFreeOperation(operationName)) {
return {};
}
if (!req.user) {
throw new AuthenticationError('You must be logged in to access this resource');
}
return { user: req.user };
