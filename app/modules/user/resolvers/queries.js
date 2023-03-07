export const currentUser = async (_parent, args, context) => {
  const { user } = context

  return user
}
