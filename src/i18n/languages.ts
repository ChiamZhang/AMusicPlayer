// 语言配置文件 - 集中管理语言相关的配置

// 语言显示名称映射
export const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  'zh-CN': '简体中文',
  'en-US': 'English',
};

// 默认语言
export const DEFAULT_LANGUAGE = 'zh-CN';

// 回退语言
export const FALLBACK_LANGUAGE = 'en-US';

// 语言排序优先级（用于在UI中的显示顺序）
export const LANGUAGE_PRIORITY: Record<string, number> = {
  'zh-CN': 1,

  'en-US': 3,
 
};
