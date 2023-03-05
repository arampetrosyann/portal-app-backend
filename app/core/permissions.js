import auth from '../modules/user/permissions.js'
import workspace from '../modules/workspace/permissions.js'

export default {
  ...auth,
  ...workspace,
}
