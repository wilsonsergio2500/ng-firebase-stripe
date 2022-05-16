
export function userFacingMessage(error: { type: string, message: string }) {
  return error.type
    ? error.message
    : 'An error occurred, developers have been alerted';
}
