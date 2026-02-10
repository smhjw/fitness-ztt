import type { User, ExerciseRecord, KnowledgeArticle, UserPreferences } from '@/types';

// Storage Keys
const STORAGE_KEYS = {
  USER: 'fittrack_user',
  RECORDS: 'fittrack_records',
  ARTICLES: 'fittrack_articles',
  TOKEN: 'fittrack_token',
} as const;

// User Storage
export const userStorage = {
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  updatePreferences: (preferences: Partial<UserPreferences>): void => {
    const user = userStorage.getUser();
    if (user) {
      user.preferences = { ...user.preferences, ...preferences };
      userStorage.setUser(user);
    }
  },
};

// Exercise Records Storage
export const recordsStorage = {
  getAll: (): ExerciseRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  },

  getByUserId: (userId: string): ExerciseRecord[] => {
    const records = recordsStorage.getAll();
    return records.filter(r => r.userId === userId).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  getById: (id: string): ExerciseRecord | null => {
    const records = recordsStorage.getAll();
    return records.find(r => r.id === id) || null;
  },

  create: (record: Omit<ExerciseRecord, 'id' | 'createdAt' | 'updatedAt'>): ExerciseRecord => {
    const records = recordsStorage.getAll();
    const newRecord: ExerciseRecord = {
      ...record,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    records.push(newRecord);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    return newRecord;
  },

  update: (id: string, updates: Partial<ExerciseRecord>): ExerciseRecord | null => {
    const records = recordsStorage.getAll();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    records[index] = {
      ...records[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    return records[index];
  },

  delete: (id: string): boolean => {
    const records = recordsStorage.getAll();
    const filtered = records.filter(r => r.id !== id);
    if (filtered.length === records.length) return false;
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(filtered));
    return true;
  },

  filter: (userId: string, filters: {
    dateRange?: { start: string; end: string };
    types?: string[];
    moods?: number[];
    intensity?: string[];
  }): ExerciseRecord[] => {
    let records = recordsStorage.getByUserId(userId);
    
    if (filters.dateRange) {
      records = records.filter(r => 
        r.date >= filters.dateRange!.start && r.date <= filters.dateRange!.end
      );
    }
    
    if (filters.types?.length) {
      records = records.filter(r => filters.types!.includes(r.type));
    }
    
    if (filters.moods?.length) {
      records = records.filter(r => filters.moods!.includes(r.mood));
    }
    
    if (filters.intensity?.length) {
      records = records.filter(r => filters.intensity!.includes(r.intensity));
    }
    
    return records;
  },
};

// Knowledge Articles Storage
export const articlesStorage = {
  getAll: (): KnowledgeArticle[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    if (data) return JSON.parse(data);
    
    // Initialize with default articles
    const defaultArticles = getDefaultArticles();
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(defaultArticles));
    return defaultArticles;
  },

  getById: (id: string): KnowledgeArticle | null => {
    const articles = articlesStorage.getAll();
    return articles.find(a => a.id === id) || null;
  },

  search: (query: string, categories?: string[]): KnowledgeArticle[] => {
    let articles = articlesStorage.getAll();
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      articles = articles.filter(a => 
        a.title.toLowerCase().includes(lowerQuery) ||
        a.summary.toLowerCase().includes(lowerQuery) ||
        a.keywords.some(k => k.toLowerCase().includes(lowerQuery)) ||
        a.tags.some(t => t.toLowerCase().includes(lowerQuery))
      );
    }
    
    if (categories?.length) {
      articles = articles.filter(a => 
        a.category.some(c => categories!.includes(c))
      );
    }
    
    return articles;
  },

  getByCategory: (category: string): KnowledgeArticle[] => {
    const articles = articlesStorage.getAll();
    return articles.filter(a => a.category.includes(category as any));
  },
};

// Auth Token Storage
export const tokenStorage = {
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  setToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },
};

// Helper Functions
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getDefaultArticles(): KnowledgeArticle[] {
  return [
    {
      id: '1',
      title: '营养指南：健身饮食的基础',
      summary: '了解蛋白质、碳水化合物和脂肪如何支持你的健身目标，学习如何制定适合自己的饮食计划。',
      content: `
## 蛋白质：肌肉建设的基石

蛋白质是肌肉修复和生长的关键营养素。对于经常锻炼的人来说，建议每天摄入 1.6-2.2 克蛋白质/公斤体重。

**优质蛋白质来源：**
- 鸡胸肉、鱼类、瘦牛肉
- 鸡蛋、希腊酸奶
- 豆类、豆腐、藜麦

## 碳水化合物：能量之源

碳水化合物是身体的主要能量来源，特别是对于高强度训练。

**推荐碳水化合物：**
- 全谷物（燕麦、糙米、全麦面包）
- 水果（香蕉、浆果、苹果）
- 蔬菜（红薯、南瓜）

## 健康脂肪：激素平衡

健康的脂肪对于激素生产和整体健康至关重要。

**健康脂肪来源：**
- 牛油果
- 坚果和种子
- 橄榄油
- 深海鱼类

## 水分补充

保持充足的水分对于运动表现和恢复至关重要。建议每天至少饮用 2-3 升水，运动期间额外补充。
      `,
      category: ['nutrition', 'beginner-guide'],
      tags: ['饮食', '营养', '蛋白质', '碳水化合物'],
      keywords: ['营养', '饮食', '健身餐', '蛋白质', '碳水'],
      author: 'FitTrack 专家团队',
      publishedAt: '2024-01-15',
      readTime: 8,
      likes: 256,
    },
    {
      id: '2',
      title: '力量训练完全指南',
      summary: '从基础动作到进阶技巧，全面掌握力量训练的方法，安全有效地增强肌肉力量。',
      content: `
## 基础复合动作

复合动作是力量训练的核心，它们同时锻炼多个肌肉群。

**五大基础动作：**
1. **深蹲** - 腿部和臀部
2. **硬拉** - 背部和腿部
3. **卧推** - 胸部和手臂
4. **推举** - 肩部和手臂
5. **划船** - 背部和手臂

## 训练计划设计

**初学者计划（每周3次）：**
- 周一：深蹲、卧推、划船
- 周三：硬拉、推举、辅助动作
- 周五：全身循环训练

**进阶计划（每周4-5次）：**
- 可以采用分化训练，如推/拉/腿分化

## 渐进超负荷原则

要持续进步，需要逐渐增加训练强度：
- 增加重量
- 增加次数
- 增加组数
- 缩短休息时间

## 恢复的重要性

肌肉在休息时生长，确保：
- 每晚 7-9 小时睡眠
- 训练间隔 48 小时
- 适当的营养补充
      `,
      category: ['strength', 'beginner-guide'],
      tags: ['力量训练', '增肌', '复合动作', '训练计划'],
      keywords: ['力量', '增肌', '深蹲', '硬拉', '卧推'],
      author: 'FitTrack 专家团队',
      publishedAt: '2024-01-20',
      readTime: 12,
      likes: 342,
    },
    {
      id: '3',
      title: '有氧运动的科学与艺术',
      summary: '探索不同类型的有氧运动，找到最适合你的 cardio 训练方式，提升心肺功能。',
      content: `
## 有氧运动类型

**低强度稳态有氧（LISS）：**
- 快走、慢跑
- 骑行
- 游泳
- 持续时间：30-60 分钟

**高强度间歇训练（HIIT）：**
- 冲刺间歇
- 跳绳
- 波比跳
- 持续时间：15-25 分钟

## 心率区间训练

**最大心率计算：** 220 - 年龄

- **恢复区（50-60%）：** 热身和恢复
- **燃脂区（60-70%）：** 脂肪燃烧
- **有氧区（70-80%）：** 心肺提升
- **无氧区（80-90%）：** 性能提升

## 有氧与力量的结合

**建议安排：**
- 力量训练后做有氧（20-30分钟）
- 或分开在不同时间
- HIIT 与力量训练间隔至少 6 小时

## 常见误区

❌ 只做有氧就能减脂
✅ 需要结合饮食控制和力量训练

❌ 有氧越多越好
✅ 过度有氧可能导致肌肉流失

❌ 空腹有氧效果更好
✅ 效果因人而异，注意低血糖风险
      `,
      category: ['cardio', 'beginner-guide'],
      tags: ['有氧', 'HIIT', '心肺训练', '减脂'],
      keywords: ['有氧', '跑步', 'HIIT', '心率', '燃脂'],
      author: 'FitTrack 专家团队',
      publishedAt: '2024-02-01',
      readTime: 10,
      likes: 189,
    },
    {
      id: '4',
      title: '瑜伽与柔韧性训练',
      summary: '通过瑜伽和拉伸提升身体柔韧性，预防运动损伤，改善身体姿态。',
      content: `
## 柔韧性的重要性

良好的柔韧性可以：
- 预防运动损伤
- 改善运动表现
- 缓解肌肉紧张
- 改善身体姿态

## 基础拉伸动作

**全身拉伸序列：**
1. **颈部拉伸** - 缓解颈部紧张
2. **肩部拉伸** - 改善上肢活动度
3. **猫牛式** - 脊柱灵活性
4. **下犬式** - 全身拉伸
5. **鸽子式** - 臀部和髋部
6. **坐姿前屈** - 腿后侧肌群

## 瑜伽流派选择

**哈他瑜伽：** 适合初学者，节奏缓慢
**流瑜伽：** 动态连贯，有一定强度
**阴瑜伽：** 长时间保持，深度拉伸
**力量瑜伽：** 结合力量训练元素

## 拉伸时机

**运动前：** 动态拉伸，激活肌肉
**运动后：** 静态拉伸，放松恢复
**日常：** 随时可以进行简短拉伸

## 注意事项

- 不要强迫拉伸，感到轻微张力即可
- 保持呼吸平稳，不要憋气
- 每个动作保持 15-30 秒
- 对称拉伸，两侧都要做
      `,
      category: ['flexibility', 'recovery'],
      tags: ['瑜伽', '拉伸', '柔韧性', '恢复'],
      keywords: ['瑜伽', '拉伸', '柔韧性', '放松', '恢复'],
      author: 'FitTrack 专家团队',
      publishedAt: '2024-02-10',
      readTime: 8,
      likes: 234,
    },
    {
      id: '5',
      title: '运动恢复与休息策略',
      summary: '了解恢复的重要性，掌握主动恢复技巧，让身体更好地适应训练刺激。',
      content: `
## 为什么恢复很重要

训练只是刺激，恢复才是进步发生的时候：
- 肌肉在休息时修复和生长
- 神经系统需要恢复
- 预防过度训练综合征

## 主动恢复方法

**轻度活动：**
- 散步
- 轻松游泳
- 瑜伽
- 泡沫轴放松

**睡眠优化：**
- 保持规律作息
- 创造黑暗安静的睡眠环境
- 睡前避免蓝光
- 室温保持在 18-22°C

## 营养与恢复

**训练后 30 分钟内：**
- 蛋白质：20-40 克
- 碳水化合物：补充糖原
- 水分：补充流失

**抗炎食物：**
- 浆果
- 深海鱼类
- 坚果
- 绿叶蔬菜

## 恢复信号监测

**需要更多休息的迹象：**
- 持续疲劳
- 运动表现下降
- 睡眠质量差
- 易怒或情绪低落
- 静息心率升高

## 休息日安排

**初学者：** 每周 3-4 天训练，3-4 天休息
**中级：** 每周 4-5 天训练，2-3 天休息
**高级：** 每周 5-6 天训练，1-2 天休息
      `,
      category: ['recovery', 'mental-health'],
      tags: ['恢复', '休息', '睡眠', '过度训练'],
      keywords: ['恢复', '休息', '睡眠', '放松', '按摩'],
      author: 'FitTrack 专家团队',
      publishedAt: '2024-02-15',
      readTime: 7,
      likes: 178,
    },
    {
      id: '6',
      title: '家庭健身：无器械训练指南',
      summary: '无需健身房，在家也能进行高效训练。学习利用自重进行全身锻炼。',
      content: `
## 自重训练的优势

- 随时随地可以进行
- 零成本
- 功能性训练
- 降低受伤风险

## 基础动作库

**上肢：**
- 俯卧撑（标准、宽距、窄距）
- 三头肌撑体
- 超人式（背部）

**核心：**
- 平板支撑
- 卷腹
- 登山者
- 死虫式

**下肢：**
- 深蹲
- 弓步蹲
- 臀桥
- 单腿硬拉

## 初学者家庭计划

**周一 - 全身：**
- 深蹲 3×15
- 俯卧撑 3×10
- 平板支撑 3×30秒

**周三 - 核心：**
- 卷腹 3×20
- 登山者 3×30秒
- 臀桥 3×15

**周五 - 全身：**
- 弓步蹲 3×12/腿
- 三头肌撑体 3×12
- 超人式 3×15

## 进阶技巧

**增加难度：**
- 放慢动作速度
- 增加次数
- 减少休息时间
- 尝试变式动作

**创造阻力：**
- 使用背包装书
- 装满水的瓶子
- 弹力带（低成本投资）
      `,
      category: ['strength', 'equipment', 'beginner-guide'],
      tags: ['家庭健身', '自重训练', '无器械', '初学者'],
      keywords: ['家庭', '自重', '无器械', '居家', '室内'],
      author: 'FitTrack 专家团队',
      publishedAt: '2024-02-20',
      readTime: 9,
      likes: 445,
    },
  ];
}

// Clear all data (for testing)
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Export all storage methods
export const storage = {
  user: userStorage,
  records: recordsStorage,
  articles: articlesStorage,
  token: tokenStorage,
  clearAll: clearAllData,
};

export default storage;
