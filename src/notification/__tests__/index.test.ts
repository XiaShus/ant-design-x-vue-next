import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

class MockNotification {
  title: string;
  options?: NotificationOptions;
  close: ReturnType<typeof vi.fn>;
  onclick: ((this: MockNotification, ev: Event) => any) | null = null;
  private _onclose: ((this: MockNotification, ev: Event) => any) | null = null;
  private _onshow: ((this: Notification, ev: Event) => any) | null = null;
  private _onerror: ((this: Notification, ev: Event) => any) | null = null;
  static permission: NotificationPermission = 'default';

  constructor(title: string, options?: NotificationOptions) {
    this.title = title;
    this.options = options;
    this.close = vi.fn(() => {
      const event = new Event('close');
      this.onclose?.(event);
    });
  }

  get onshow(): (this: Notification, ev: Event) => any {
    return this._onshow ?? (() => {});
  }

  set onshow(callback: (this: Notification, ev: Event) => any) {
    this._onshow = callback;
    if (this._onshow) {
      this._onshow.call(this as unknown as Notification, new Event('show'));
    }
  }

  get onclose(): (this: any, ev: Event) => any {
    return this._onclose ?? (() => {});
  }

  set onclose(callback: (this: MockNotification, ev: Event) => any) {
    this._onclose = callback;
  }

  get onerror(): (this: Notification, ev: Event) => any {
    return this._onerror ?? (() => {});
  }

  set onerror(callback: (this: Notification, ev: Event) => any) {
    this._onerror = callback;
  }

  static requestPermission() {
    MockNotification.permission = 'granted';
    return Promise.resolve('granted' as NotificationPermission);
  }
}

describe('XNotification', () => {
  let notification: typeof import('../notification').default;
  let XNotification: typeof import('../notification').XNotification;

  beforeEach(async () => {
    vi.resetModules();
    (globalThis as any).Notification = MockNotification;
    MockNotification.permission = 'default';
    const mod = await import('../notification');
    notification = mod.default;
    XNotification = mod.XNotification;
    XNotification.permissionMap = new Map();
    XNotification.permissible = true;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('open', () => {
    it('creates notification with title', () => {
      const ctor = vi.fn((title: string, options?: NotificationOptions) => {
        return new MockNotification(title, options);
      });
      (globalThis as any).Notification = ctor;
      XNotification.permissible = true;

      notification.open({ title: 'Test' });
      expect(ctor).toHaveBeenCalledWith('Test', {});
    });

    it('does not create duplicate notification with same tag', () => {
      const ctor = vi.fn((title: string, options?: NotificationOptions) => {
        return new MockNotification(title, options);
      });
      (globalThis as any).Notification = ctor;
      XNotification.permissible = true;

      notification.open({ title: 'Test', tag: 'test-tag' });
      notification.open({ title: 'Test', tag: 'test-tag' });
      expect(ctor).toHaveBeenCalledTimes(1);
    });

    it('calls onClick callback', () => {
      const ctor = vi.fn((title: string, options?: NotificationOptions) => {
        return new MockNotification(title, options);
      });
      (globalThis as any).Notification = ctor;
      XNotification.permissible = true;

      const onClick = vi.fn();
      notification.open({ title: 'Test', onClick });
      const instance = ctor.mock.results[0].value as MockNotification;
      instance.onclick?.({} as any);
      expect(onClick).toHaveBeenCalled();
    });

    it('auto closes after duration', () => {
      vi.useFakeTimers();
      const ctor = vi.fn((title: string, options?: NotificationOptions) => {
        return new MockNotification(title, options);
      });
      (globalThis as any).Notification = ctor;
      XNotification.permissible = true;

      notification.open({ title: 'Test', duration: 5 });
      const instance = ctor.mock.results[0].value as MockNotification;
      vi.advanceTimersByTime(5000);
      expect(instance.close).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('closes all notifications', () => {
      const ctor = vi.fn((title: string, options?: NotificationOptions) => {
        return new MockNotification(title, options);
      });
      (globalThis as any).Notification = ctor;
      XNotification.permissible = true;

      notification.open({ title: 'Test1', tag: 'key1' });
      notification.open({ title: 'Test2', tag: 'key2' });
      expect(XNotification.permissionMap.size).toBe(2);
      notification.close();
      expect(XNotification.permissionMap.size).toBe(0);
    });

    it('closes by tag', () => {
      const ctor = vi.fn((title: string, options?: NotificationOptions) => {
        return new MockNotification(title, options);
      });
      (globalThis as any).Notification = ctor;
      XNotification.permissible = true;

      notification.open({ title: 'Test1', tag: 'key1' });
      notification.open({ title: 'Test2', tag: 'key2' });
      notification.close(['key1']);
      expect(XNotification.permissionMap.has('key1')).toBe(false);
      expect(XNotification.permissionMap.has('key2')).toBe(true);
    });
  });

  describe('requestPermission', () => {
    it('updates permission state', async () => {
      const permission = await notification.requestPermission();
      expect(permission).toEqual('granted');
      expect(notification.permission).toEqual('granted');
    });
  });

  describe('useNotification', () => {
    it('returns permission state and methods', () => {
      MockNotification.permission = 'default';
      const [{ permission }, { open, close, requestPermission }] = notification.useNotification();
      expect(permission).toBe('default');
      expect(typeof open).toBe('function');
      expect(typeof close).toBe('function');
      expect(typeof requestPermission).toBe('function');
    });

    it('updates permission after requestPermission', async () => {
      MockNotification.permission = 'default';
      const holder = notification.useNotification();
      const result = await holder[1].requestPermission();
      expect(result).toBe('granted');
      expect(holder[0].permission).toBe('granted');
    });
  });
});
