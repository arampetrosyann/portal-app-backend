export const currentUer = async (_parent, args, context) => {
  const { user } = context

  return user
}
