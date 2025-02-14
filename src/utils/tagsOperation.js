export default {
  install(Vue) {
    Vue.prototype.$openTag = (vm, options) => {
      const { name, status, props, pkName = 'id', _query } = options
      let pageId
      if (pkName && props && props[pkName]) {
        if (status === 'view') {
          pageId = `v_${props[pkName]}`
        }
        if (status === 'edit') {
          pageId = `e_${props[pkName]}`
        }
        if (status === 'approve') {
          pageId = `e_${props[pkName]}`
        }
      } else {
        pageId = `a_${Date.now()}`
      }
      if (pkName && !props && options && options[pkName]) {
        if (status === 'view') {
          pageId = `v_${options[pkName]}`
        }
        if (status === 'edit') {
          pageId = `e_${options[pkName]}`
        }
        if (status === 'approve') {
          pageId = `f_${options[pkName]}`
        }
      }
      const query = !_query ? {} : { ..._query }
      const wrapperProps = { ...options }
      delete wrapperProps.props
      const nameProp = name === undefined ? 'formWrapper' : name
      vm.$router.push({
        name: nameProp,
        params: {
          pageId,
          ...wrapperProps,
          ...props
        },
        query
      })
    }
    // Vue.prototype.$closeTag = (vm, to) => {
    //   const view = { path: vm.$route.path, name: vm.$route.name }
    //   vm.$store.dispatch('tagsView/delVisitedViews', view).then(views => {
    //     if (to) {
    //       vm.$router.push(to)
    //     } else {
    //       const latestView = views.slice(-1)[0]
    //       vm.$router.push(latestView.path)
    //     }
    //   })
    // }
  }
}
