const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  type: state => state.user.type,
  name: state => state.user.name,
  username: state => state.user.username,
  avatar: state => state.user.avatar,
  routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes
}
export default getters
