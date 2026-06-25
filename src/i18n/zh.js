export const BRAND_NAME = '彩霞美食'

export const t = {
  // Public
  todaysMenu: '今日菜单',
  loadingTodaysMenu: '正在加载今日菜单...',
  noMenuPublished: '今日菜单尚未发布。',
  checkBackSoon: '请稍后再来查看！',
  adminLogin: '管理员登录',

  // Auth
  adminLoginTitle: '管理员登录',
  masterPassword: '主密码',
  enterMasterPassword: '请输入主密码',
  signIn: '登录',
  signingIn: '登录中...',
  invalidPassword: '主密码错误，请重试。',
  showPassword: '显示密码',
  hidePassword: '隐藏密码',
  close: '关闭',

  // Admin header
  adminDashboard: '管理后台',
  menuManager: '彩霞小卖部菜单管理',
  previewPublic: '预览公开页面',
  logout: '退出登录',
  backToAdmin: '返回管理后台',
  loadingDashboard: '正在加载管理后台...',
  loading: '加载中...',

  // Item pool
  itemPool: '菜品库',
  addNewItem: '添加新菜品',
  itemName: '菜品名称',
  price: '价格',
  category: '分类',
  descriptionOptional: '描述（选填）',
  addToPool: '加入菜品库',
  adding: '添加中...',
  addItemFailed: '添加失败，请重试。',
  dragToMenu: '拖拽菜品至今日菜单 →',
  tapToAddHint: '点击 + 将菜品加入今日菜单',
  addToMenu: '加入菜单',
  noItemsInPool: '菜品库为空，请在上方添加。',

  // Mobile tabs
  tabManagePool: '🍲 管理菜品库',
  tabTodaysMenu: '📋 今日菜单',
  tabArchive: '📁 历史菜单',
  stagedForToday: (n) => `今日菜单已选 ${n} 项`,
  viewAndPublish: '查看并发布',
  tapToAddFromPool: '请从菜品库点击 + 添加菜品',

  // Menu builder
  todaysMenuWorkspace: '今日菜单',
  published: '已发布',
  dropItemsHere: '将菜品拖放到此处，构建今日菜单',
  publishMenu: '发布菜单',
  publishing: '发布中...',
  publishSuccess: '菜单发布成功！',
  publishFailed: '发布失败，请重试。',
  removeItem: '移除',
  menuBuilder: '菜单编辑',
  clearAll: '清空全部',
  editingMenuFor: '正在编辑',
  backToToday: '返回今日',

  // Archive actions
  loadToWorkspace: '载入工作区编辑',
  deleteMenu: '删除菜单',
  confirmDeleteMenu: (date) => `确定要删除 ${date} 的菜单吗？此操作无法撤销。`,
  deleteMenuSuccess: '菜单已删除。',
  deleteMenuFailed: '删除失败，请重试。',
  loadToWorkspaceSuccess: '已载入工作区，可进行编辑后重新发布。',

  // Archive
  dateArchive: '历史菜单',
  year: '年份',
  month: '月份',
  loadingArchive: '正在加载历史记录...',
  noMenusFound: '该时段暂无菜单记录。',
  menuArchive: '历史菜单',
  noItemsOnMenu: '此菜单暂无菜品。',
  draftUnpublished: '草稿（未发布）',
  itemCount: (n) => `${n} 项`,

  // Categories (display labels; values stored in Firestore stay as English keys)
  categories: {
    Main: '主食',
    Side: '小菜',
    Snack: '小食',
    Drink: '饮品',
    Dessert: '甜品',
    Other: '其他',
  },
}

export const CATEGORY_KEYS = ['Main', 'Side', 'Snack', 'Drink', 'Dessert', 'Other']

export const MONTHS_ZH = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
]

export function formatPrice(price) {
  return `HK$${Number(price).toFixed(2)}`
}

export function categoryLabel(key) {
  return t.categories[key] || key
}
