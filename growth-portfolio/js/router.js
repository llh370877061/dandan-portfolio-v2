// ============================================
// 成长档案 - 路由系统
// ============================================

export class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.onRouteChange = null;

    window.addEventListener('hashchange', () => this.handleRoute());
  }

  register(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  navigate(path) {
    window.location.hash = path;
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, ...paramParts] = hash.split('/').filter(Boolean);
    const routePath = '/' + (path || '');

    // 支持带参数的路由，如 /records/act_xxx
    const params = {};
    if (paramParts.length > 0) {
      params.id = paramParts.join('/');
    }

    if (this.routes[routePath]) {
      this.currentRoute = routePath;
      this.routes[routePath](params);

      // 更新导航状态
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.route === routePath);
      });

      // 更新页面标题
      const titles = {
        '/': '首页',
        '/records': '成长记录',
        '/assessment': '成长评估',
        '/timeline': '时间轴',
        '/reflection': '反思空间',
        '/achievements': '成就殿堂',
        '/statistics': '数据统计'
      };

      const pageTitle = document.querySelector('.page-title');
      if (pageTitle) {
        pageTitle.textContent = titles[routePath] || '成长档案';
      }

      if (this.onRouteChange) {
        this.onRouteChange(routePath, params);
      }
    }
  }

  start() {
    this.handleRoute();
    return this;
  }
}

export default new Router();
