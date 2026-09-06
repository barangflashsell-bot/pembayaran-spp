// ==========================================
// SPA Hash-Based Router
// ==========================================

export interface RouteConfig {
  path: string;
  title: string;
  icon: string;
  render: () => HTMLElement;
}

type RouteChangeCallback = (path: string) => void;

class Router {
  private routes: Map<string, RouteConfig> = new Map();
  private listeners: RouteChangeCallback[] = [];
  private currentPath: string = '';

  /** Register a route */
  register(config: RouteConfig): void {
    this.routes.set(config.path, config);
  }

  /** Register multiple routes */
  registerAll(configs: RouteConfig[]): void {
    configs.forEach((config) => this.register(config));
  }

  /** Navigate to a path */
  navigate(path: string): void {
    window.location.hash = `#${path}`;
  }

  /** Get current path from hash */
  getCurrentPath(): string {
    return window.location.hash.slice(1) || '/';
  }

  /** Get route config for current path */
  getCurrentRoute(): RouteConfig | undefined {
    return this.routes.get(this.getCurrentPath());
  }

  /** Get all registered routes */
  getRoutes(): RouteConfig[] {
    return Array.from(this.routes.values());
  }

  /** Listen for route changes */
  onRouteChange(callback: RouteChangeCallback): void {
    this.listeners.push(callback);
  }

  /** Start listening for hash changes */
  start(): void {
    const handleChange = () => {
      const path = this.getCurrentPath();
      if (path !== this.currentPath) {
        this.currentPath = path;
        this.listeners.forEach((cb) => cb(path));
      }
    };

    window.addEventListener('hashchange', handleChange);

    // Handle initial route
    if (!window.location.hash) {
      this.navigate('/');
    } else {
      handleChange();
    }
  }
}

// Singleton router instance
export const router = new Router();
