const state = {
  visitedViews: {},
  cachedViews: []
}
const mutations = {
  ADD_VISITED_VIEWS: (state, view) => {
    // 获取浏览器localStorage中的visitedViews缓存
    const visitedViews = JSON.parse(localStorage.getItem('visitedViews')) || []
    // 如果visitedViews数组中无当前路由，push当前路由
    if (!visitedViews.find(v => v.path.replace(/\//g, '') === view.path.replace(/\//g, ''))) {
      visitedViews.push({
        name: view.name,
        path: view.path,
        params: view.params,
        // 路由参数中定义了title，就先取路由参数中的title，否则取路由meta中的title
        title: view.params.title ? view.params.title : view.meta.title || 'no-name'
      })
    }
    // vuex的state和浏览器localStorage分别缓存当前visitedViews
    state.visitedViews = visitedViews
    localStorage.setItem('visitedViews', JSON.stringify(visitedViews))
    // vuex的state缓存cachedViews(noCache = true,为缓存,切换页签的时候不重新查找)
    if ((view.meta.noCache || view.meta.noCache === undefined) && !state.cachedViews.find(el => el === view.name) && view.name !== 'dashboard') {
      state.cachedViews.push(view.name)
    }
  },

  DEL_VISITED_VIEWS: (state, view) => {
    // 获取浏览器localStorage中的visitedViews缓存
    const visitedViews = JSON.parse(localStorage.getItem('visitedViews')) || []
    // 找到当前路由在visitedViews对应的index
    const index = visitedViews.findIndex(v => v.path === view.path)
    // 删除对应index的，重置vuex的state和浏览器localStorage中visitedViews缓存
    if (index !== -1) {
      visitedViews.splice(index, 1)
      state.visitedViews = visitedViews
      localStorage.setItem('visitedViews', JSON.stringify(visitedViews))
    }
    // 找到当前路由的name在cachedViews中对应的缓存并删除
    const i = state.cachedViews.findIndex(v => v === view.name)
    if (i !== -1) state.cachedViews.splice(i, 1)
  },

  DEL_OTHERS_VIEWS: (state, view) => {
    // 获取浏览器localStorage中的visitedViews缓存
    const visitedViews = JSON.parse(localStorage.getItem('visitedViews')) || []
    // 找到dashboard和当前路由对应的visitedViews
    const tempVisitedViews = visitedViews.filter(e => e.path === '/dashboard' || e.path === view.path)
    // 重置vuex的state和浏览器localStorage中visitedViews缓存，重置为tempVisitedViews
    state.visitedViews = tempVisitedViews
    localStorage.setItem('visitedViews', JSON.stringify(tempVisitedViews))
    // 找到当前路由的name在cachedViews中对应的缓存，重置state.cachedViews
    const cachedViews = state.cachedViews.filter(e => e === view.name)
    state.cachedViews = cachedViews
  },

  DEL_ALL_VIEWS: state => {
    // 获取浏览器localStorage中的visitedViews缓存
    const visitedViews = JSON.parse(localStorage.getItem('visitedViews')) || []
    // 找到dashboard对应的visitedViews
    const tempVisitedViews = visitedViews.filter(e => e.path === '/dashboard')
    // 重置vuex的state和浏览器localStorage中visitedViews缓存，重置为tempVisitedViews
    state.visitedViews = tempVisitedViews
    localStorage.setItem('visitedViews', JSON.stringify(tempVisitedViews))
    // 清除state.cachedViews
    state.cachedViews = []
  }
}
const actions = {
  // 添加页签
  addVisitedViews({ commit }, view) {
    commit('ADD_VISITED_VIEWS', view)
  },
  // 删除当前页签
  delVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEWS', view)
      console.log(state)
      resolve([...state.visitedViews])
    })
  },
  // 删除其他页签
  delOthersViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  // 删除所有页签
  delAllViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VIEWS')
      resolve([...state.visitedViews])
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
