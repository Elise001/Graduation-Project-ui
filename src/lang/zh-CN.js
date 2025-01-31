export default {
  /**
   frame， 系统框架， 主要包括以下部分：
   login， 系统登录是账号， 密码， 提示等内容的国际化内容；
   errorPage， 错误页面提示；
   Layout， 整体布局中的提示， 如loading: '系统君正在玩儿命加载'；
   Narvbar， 系统导航栏上内容的国际化；
   ChangePassword， 修改登录密码；
   theme， 换肤；
   errorLog， 错误日志；
   components， 系统中公共组件的国际化内容
   */
  frame: {
    login: {
      title: '青岛海信网络能源嗨选型系统',
      logIn: '登录',
      username: '账户',
      password: '密码',
      username_require: '账户不能为空',
      username_length: '长度在 3 到 20 个字符',
      validatePass: '密码不能小于6位',
      wechat: '微信',
      userORPassError: '账户或密码错误！'
    },
    errorPage: {
      gif: 'gif来源',
      page: '页面',
      pageAuth: '你没有权限去该页面',
      callLeader: '如有不满请联系你领导',
      otherChoice: '或者你可以去:',
      backToDashboard: '返回首页',
      lookAround: '随便看看',
      lookAround2: '随便看',
      seePicture: '点我看图',
      copyright: '版权所有',
      linkWords: '华尔街见闻',
      checkWebsite: '请检查您输入的网址是否正确，请点击以下按钮返回主页或者发送错误报告',
      noAuthEnter: '特朗普说这个页面你不能进......'
    },
    Layout: {
      loading: '系统君正在玩儿命加载'
    },
    navbar: {
      logOut: '退出登录',
      dashboard: '工作台',
      application: '应用',
      github: '项目地址',
      screenfull: '全屏',
      theme: '换肤',
      changePassword: '修改密码',
      changeLanguage: '语言切换成功'
    },
    ChangePassword: {
      title: '修改密码',
      oldPass: '旧密码',
      pass: '密码',
      checkPass: '确认密码',
      validatePass: '请输入密码',
      validatePass2: '请再次输入密码',
      validatePass3: '两次输入密码不一致',
      passChangeFail: '不可登录的用户密码无法修改，请激活用户后再修改'
    },
    theme: {
      change: '换肤',
      documentation: '换肤文档',
      tips: 'Tips: 它区别于 navbar 上的 theme-pick, 是两种不同的换肤方法，各自有不同的应用场景，具体请参考文档。'
    },
    errorLog: {
      tips: '请点击右上角bug小图标',
      description:
        '现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在 Vue 官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。',
      documentation: '文档介绍'
    },
    components: {
      backToTop: '回到顶部',
      dropzone: '只能一个图',
      ThemePicker: '换肤成功',
      editorImage: '请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！',
      uploadPicture: '只能上传图片！',
      uploadPdf: '只能上传PDF！',
      uploadFile: '文件类型不符合要求！',
      removedFile: '确定移除 ',
      password: '6-20位字符，包括：数字、小写、大写字母以及特殊字符',
      strong: '强',
      medium: '中',
      weak: '弱',
      excelImport: 'Excel表数据导入'
    }
  },
  plugins: {
    message: {
      detailInfo: '详细信息',
      gotIt: '我知道了',
      contentUnfinished: '内容未完善'
    }
  },
  /**
   common， 系统中各个一级菜单（ 模块） 中都会用到的内容， 主要包括以下部分：
   title， 系统中通用标题， dialog页面的标题， table列表的标题， form表单的标题， 例如： create: '创建', update: '编辑'，
   dialogDepartName: '选择部门'等；
   label， 通用标签， 通用的table列名， form标签， 例如： id: '序号'，operation: '操作'，description: '描述'，remark: '备注'等各个模块都会用到的标签；
   button， 系统中通用的按钮， 例如search: '搜索'，reset: '重置'，refresh: '刷新'，append: '添加'，edit: '编辑'，delete: '删除'等；
   placeholder， input， select， time - picker等输入框中通用的提示内容， 例如filterText: '输入关键字进行过滤'，
   description: ‘请填写描述’ 等；
   message， message消息提示的通用内容， 例如indicate: '提示'，createSuc: '创建成功', deleteSuc: '删除成功'等
   */
  common: {
    title: {
      create: '创建',
      update: '编辑',
      indicate: '提示',
      dialogDepartName: '选择部门',
      international: '国际化',
      dialogPasswordTitle: '修改密码',
      columnsSet: '列设置',
      customQueryPlan: '自定义查询方案',
      planName: '方案名称：'
    },
    label: {
      success: '成功',
      updateSuccess: '修改成功',
      id: '序号',
      name: '名称',
      title: '标题',
      user: '用户',
      username: '用户账号',
      contact: '联系人',
      mobile: '手机',
      telephone: '办公电话',
      email: '电子邮件',
      sex: '性别',
      company: '公司',
      depart: '部门',
      serverDepart: '名称',
      role: '角色',
      crtUserName: '创建人',
      crtUserId: '创建人ID',
      crtTime: '创建时间',
      updUserName: '最后更新人',
      updUserId: '最后更新人ID',
      updTime: '最后更新时间',
      type: '类型',
      status: '状态',
      description: '描述',
      roleType: '角色类型',
      explanation: '说明',
      remark: '备注',
      attachment: '附件',
      isSync: '是否同步',
      isFreeze: '是否冻结',
      operation: '操作',
      edit: '编辑',
      create: '创建',
      delete: '删除',
      resetPassword: '重置密码',
      yes: '是',
      no: '否',
      info: '提示',
      dashboard: '仪表盘',
      customQuery: '自定义查询',
      and: '和',
      operaterSuccess: '操作成功',
      isServers: '是否服务商系统管理员'
    },
    button: {
      add: '新增行',
      deletes: '删减行',
      deleteAll: '删除所有',
      search: '搜索',
      query: '查询',
      reset: '重置',
      refresh: '刷新',
      init: '初始化',
      enableType: '启用',
      disableType: '停用',
      disabled: '禁用',
      append: '添加',
      increase: '新增',
      addUser: '添加用户',
      view: '查看',
      edit: '编辑',
      edits: '修改',
      delete: '删除',
      batchDelete: '批量删除',
      update: '更新',
      maintain: '维护',
      confer: '授予',
      confirm: '确定',
      cofirmClose: '确认关闭弹出框',
      cancel: '取消',
      cancelEdit: '取消编辑',
      temporary: '暂存',
      save: '保存',
      submit: '提交',
      back: '返回',
      flowBack: '撤回',
      terminate: '终止',
      discard: '废弃',
      upload: '上传',
      download: '下载',
      uploadImage: '上传图片',
      clickUpload: '点击上传',
      preview: '预览',
      import: '导入',
      downloadTemp: '导入模板下载',
      export: '导出',
      international: '国际化',
      appendRoot: '新增根节点',
      queryCondition: '查询条件',
      hideQueryCondition: '折叠查询条件',
      showQueryCondition: '展开查询条件',
      hideCondition: '折叠',
      showCondition: '展开',
      close: '关闭',
      columnsSet: '列设置',
      exportAll: '导出全部',
      exportCurrentPage: '导出当前页',
      resetColumnsSet: '重置列设置'
    },
    placeholder: {
      filterText: '输入关键字进行过滤',
      title: '请输入标题',
      ServiceRegions: '请输入所属服务大区名称',
      ServiceManager: '请输入大区服务经理名称',
      DispatchWorkers: '请输入是否自动派工',
      description: '请填写描述',
      write: '请填写',
      choose: '请选择',
      sex: '请选择性别',
      content: '请输入内容',
      startTime: '开始日期',
      to: '至',
      endTime: '结束日期',
      startTimeMinute: '开始时间',
      endTimeMinute: '结束时间',
      planName: '方案名称'
    },
    message: {
      indicate: '提示',
      success: '成功',
      createSuc: '创建成功',
      deleteSuc: '删除成功',
      deleteFlowSuc: '流程终止成功',
      updateSuc: '更新成功',
      editSuc: '修改成功',
      appendSuc: '添加成功',
      addSuccess: '新增成功',
      maintainSuc: '维护成功',
      saveSuc: '保存成功',
      disableSuc: '禁用成功',
      uploadSuc: '上传成功',
      loginSuc: '登录成功',
      fail: '失败',
      createFail: '创建失败',
      deleteFail: '删除失败',
      updateFail: '更新失败',
      editFail: '修改失败',
      appendFail: '添加失败',
      maintainFail: '维护失败',
      saveFail: '保存失败',
      disableFail: '禁用失败',
      uploadFail: '上传失败',
      loginFail: '登录失败',
      deleteFlowFail: '流程终止失败',
      service_delete: '是否要删除该条数据?',
      exportDataError: '导出数据错误',
      dataNullWarning: '未发现可导入数据，请确认',
      fileNullWarning: '未读取到文件内容，请确认',
      submit: '提交前请检查您填报内容的准确性，完整性，谢谢！',
      queryPlanName: '请输入方案名称',
      queryPlanNameRepeat: '方案名称重复',
      queryConditionNull: '查询条件为空',
      checkQueryConditions: '查询条件重复，请检查',
      smsCodeRepeat: 'smsCode编码重复'
    }
  }
}
