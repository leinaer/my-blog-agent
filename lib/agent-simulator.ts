// ==================== 类型定义 ====================

export interface Tool {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface LogEntry {
  id: string;
  message: string;
  timestamp: Date;
  type: "info" | "success" | "warning" | "error";
  detail?: string; // JSON格式的详细数据
}

export interface ProcessStep {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "error";
  description?: string;
}

export type AgentState = "idle" | "thinking" | "executing" | "completed" | "error";

export interface SimulationState {
  logs: LogEntry[];
  steps: ProcessStep[];
  agentState: AgentState;
  progress: number; // 0-100
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultInput: string;
  exampleData?: string; // 示例代码或数据（可选）
  exampleDataType?: "code" | "data" | "text"; // 示例数据类型
  tools: Tool[];
  steps: ProcessStep[];
  simulate: (input: string, enabledTools: Tool[]) => AsyncGenerator<SimulationState>;
}

// ==================== 工具函数 ====================

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createLog(message: string, type: LogEntry["type"], detail?: string): LogEntry {
  return {
    id: Math.random().toString(36).substring(7),
    message,
    timestamp: new Date(),
    type,
    detail,
  };
}

// ==================== 旅游规划Agent ====================

const ATTRACTIONS_DB: Record<string, Array<{ name: string; category: string; duration: number; cost: number }>> = {
  "上海": [
    { name: "外滩", category: "地标", duration: 2, cost: 0 },
    { name: "豫园", category: "文化", duration: 3, cost: 40 },
    { name: "东方明珠", category: "地标", duration: 3, cost: 220 },
    { name: "南京路步行街", category: "购物", duration: 2, cost: 0 },
    { name: "上海科技馆", category: "科普", duration: 4, cost: 60 },
    { name: "田子坊", category: "文创", duration: 2, cost: 0 },
    { name: "新天地", category: "休闲", duration: 3, cost: 0 },
    { name: "陆家嘴", category: "金融", duration: 2, cost: 0 },
  ],
  "北京": [
    { name: "故宫", category: "文化", duration: 4, cost: 60 },
    { name: "长城", category: "历史", duration: 6, cost: 45 },
    { name: "天坛", category: "文化", duration: 3, cost: 34 },
    { name: "颐和园", category: "园林", duration: 4, cost: 30 },
    { name: "鸟巢", category: "体育", duration: 2, cost: 80 },
  ],
  "广州": [
    { name: "广州塔", category: "地标", duration: 3, cost: 150 },
    { name: "长隆野生动物世界", category: "娱乐", duration: 6, cost: 300 },
    { name: "沙面岛", category: "文化", duration: 2, cost: 0 },
    { name: "北京路步行街", category: "购物", duration: 2, cost: 0 },
  ],
  "深圳": [
    { name: "世界之窗", category: "主题乐园", duration: 6, cost: 220 },
    { name: "东部华侨城", category: "度假", duration: 8, cost: 200 },
    { name: "欢乐谷", category: "娱乐", duration: 6, cost: 230 },
  ],
  "杭州": [
    { name: "西湖", category: "自然", duration: 4, cost: 0 },
    { name: "灵隐寺", category: "文化", duration: 3, cost: 45 },
    { name: "宋城", category: "主题乐园", duration: 5, cost: 320 },
  ],
  "成都": [
    { name: "大熊猫基地", category: "动物", duration: 4, cost: 55 },
    { name: "宽窄巷子", category: "文化", duration: 2, cost: 0 },
    { name: "锦里", category: "文化", duration: 3, cost: 0 },
  ],
  "西安": [
    { name: "兵马俑", category: "历史", duration: 4, cost: 120 },
    { name: "大雁塔", category: "文化", duration: 3, cost: 50 },
    { name: "回民街", category: "美食", duration: 2, cost: 0 },
  ],
};

function generateItinerary(location: string, days: number): string[] {
  const attractions = ATTRACTIONS_DB[location];

  // 如果有预设数据，使用预设；否则生成通用行程
  if (attractions) {
    const itinerary: string[] = [];
    let currentIndex = 0;

    for (let day = 1; day <= days; day++) {
      const dayPlan: string[] = [];
      let dayTime = 0;

      while (dayTime < 8 && currentIndex < attractions.length) {
        const attraction = attractions[currentIndex];
        if (dayTime + attraction.duration <= 8) {
          dayPlan.push(attraction.name);
          dayTime += attraction.duration;
          currentIndex++;
        } else {
          break;
        }
      }

      if (dayPlan.length > 0) {
        itinerary.push(`Day ${day}: ${dayPlan.join(" - ")}`);
      }
    }

    return itinerary;
  } else {
    // 对于未知城市，生成通用建议
    const genericSuggestions = [
      `Day 1: 探索${location}市中心 - 参观主要景点 - 品尝当地美食`,
      `Day 2: ${location}历史文化区 - 博物馆游览 - 特色街区漫步`,
      `Day 3: ${location}自然风光 - 公园或郊游 - 购买纪念品`,
    ];

    return genericSuggestions.slice(0, days);
  }
}

async function* simulateTravelAgent(
  userInput: string,
  enabledTools: Tool[]
): AsyncGenerator<SimulationState> {
  const logs: LogEntry[] = [];
  const steps: ProcessStep[] = [
    { id: "1", name: "分析用户意图", status: "pending", description: "理解用户的旅行需求" },
    { id: "2", name: "提取关键信息", status: "pending", description: "识别地点、时间等要素" },
    { id: "3", name: "调用工具", status: "pending", description: "搜索景点、查询天气" },
    { id: "4", name: "生成旅游计划", status: "pending", description: "智能规划每日行程" },
    { id: "5", name: "输出结果", status: "pending", description: "展示完整方案" },
  ];

  const totalSteps = 5;
  let completedSteps = 0;

  // Step 1: Analyze user intent
  steps[0].status = "running";
  yield { logs: [...logs], steps: [...steps], agentState: "thinking", progress: 0 };

  await sleep(1000);
  logs.push(createLog("接收到用户输入", "info"));
  yield { logs: [...logs], steps: [...steps], agentState: "thinking", progress: 10 };

  await sleep(800);
  logs.push(createLog(`分析意图: ${userInput.substring(0, 50)}...`, "info"));
  steps[0].status = "completed";
  completedSteps++;
  yield { logs: [...logs], steps: [...steps], agentState: "thinking", progress: 20 };

  // Step 2: Extract key information
  steps[1].status = "running";
  yield { logs: [...logs], steps: [...steps], agentState: "thinking", progress: 25 };

  await sleep(1000);
  const location = extractLocation(userInput) || "上海";
  const days = extractDays(userInput) || 3;
  logs.push(createLog(`检测到地点: ${location}`, "success"));
  logs.push(createLog(`检测到天数: ${days}天`, "success"));
  steps[1].status = "completed";
  completedSteps++;
  yield { logs: [...logs], steps: [...steps], agentState: "thinking", progress: 40 };

  // Step 3: Call tools
  steps[2].status = "running";
  yield { logs: [...logs], steps: [...steps], agentState: "executing", progress: 45 };

  const searchTool = enabledTools.find((t) => t.id === "search");
  if (searchTool) {
    await sleep(800);
    logs.push(createLog(`调用搜索工具: 搜索"${location}旅游景点"`, "info"));
    yield { logs: [...logs], steps: [...steps], agentState: "executing", progress: 50 };

    await sleep(1200);
    // 根据城市动态显示搜索结果
    const topAttractions = ATTRACTIONS_DB[location] 
      ? ATTRACTIONS_DB[location].slice(0, 3).map(a => a.name)
      : ["市中心景点", "历史文化区", "当地美食街"];
    logs.push(createLog(`搜索结果: 找到${location}相关景点`, "success", JSON.stringify({ total: 156, top: topAttractions })));
  }

  const calendarTool = enabledTools.find((t) => t.id === "calendar");
  if (calendarTool) {
    await sleep(800);
    logs.push(createLog("调用日历工具: 检查可用日期", "info"));
    yield { logs: [...logs], steps: [...steps], agentState: "executing", progress: 55 };

    await sleep(600);
    logs.push(createLog("日历查询: 未来7天有空闲时间", "success"));
  }

  steps[2].status = "completed";
  completedSteps++;
  yield { logs: [...logs], steps: [...steps], agentState: "executing", progress: 65 };

  // Step 4: Generate travel plan
  steps[3].status = "running";
  yield { logs: [...logs], steps: [...steps], agentState: "executing", progress: 70 };

  await sleep(1500);
  logs.push(createLog("正在生成个性化旅游计划...", "info"));
  yield { logs: [...logs], steps: [...steps], agentState: "executing", progress: 75 };

  await sleep(1000);
  const itinerary = generateItinerary(location, days);
  logs.push(createLog("计划生成完成!", "success"));
  steps[3].status = "completed";
  completedSteps++;
  yield { logs: [...logs], steps: [...steps], agentState: "completed", progress: 85 };

  // Step 5: Output result
  steps[4].status = "running";
  yield { logs: [...logs], steps: [...steps], agentState: "completed", progress: 90 };

  await sleep(800);
  logs.push(createLog("========== 旅游计划 ==========", "success"));
  logs.push(createLog(`📍 目的地: ${location}`, "info"));
  logs.push(createLog(`📅 行程: ${days}天`, "info"));
  logs.push(createLog("", "info"));

  itinerary.forEach(day => {
    logs.push(createLog(day, "info"));
  });

  logs.push(createLog("", "info"));
  
  // 根据城市和天数动态计算预算
  const budgetPerDay = ATTRACTIONS_DB[location] ? 800 : 600; // 有数据的城市稍贵
  const totalBudget = budgetPerDay * days;
  logs.push(createLog(`💰 预估预算: ${totalBudget}-${totalBudget + 2000}元/人`, "info"));
  logs.push(createLog("================================", "success"));

  steps[4].status = "completed";
  completedSteps++;
  yield { logs: [...logs], steps: [...steps], agentState: "completed", progress: 100 };
}

function extractLocation(input: string): string | null {
  // 扩展城市列表，包含更多中国主要城市
  const locations = [
    "上海", "北京", "广州", "深圳", "杭州", "成都", "西安",
    "重庆", "南京", "武汉", "天津", "苏州", "青岛", "厦门",
    "昆明", "长沙", "郑州", "济南", "合肥", "南昌", "福州",
    "贵阳", "南宁", "哈尔滨", "长春", "沈阳", "大连", "宁波"
  ];

  for (const loc of locations) {
    if (input.includes(loc)) return loc;
  }

  // 尝试匹配更通用的地点模式
  const match = input.match(/去(\S+?)(玩|旅游|旅行|游)/);
  if (match && match[1]) {
    return match[1];
  }

  return null;
}

function extractDays(input: string): number | null {
  const match = input.match(/(\d+)\s*天/);
  return match ? parseInt(match[1]) : null;
}

// ==================== 代码审查Agent ====================

async function* simulateCodeReviewAgent(
  userInput: string,
  enabledTools: Tool[]
): AsyncGenerator<SimulationState> {
  const logs: LogEntry[] = [];
  const steps: ProcessStep[] = [
    { id: "1", name: "解析代码结构", status: "pending", description: "AST语法树分析" },
    { id: "2", name: "静态分析", status: "pending", description: "语法、类型检查" },
    { id: "3", name: "安全扫描", status: "pending", description: "检测潜在漏洞" },
    { id: "4", name: "性能分析", status: "pending", description: "识别性能瓶颈" },
    { id: "5", name: "生成建议", status: "pending", description: "输出改进方案" },
  ];

  steps[0].status = "running";
  yield { logs, steps, agentState: "thinking", progress: 0 };

  await sleep(1000);
  
  // 从用户输入中提取代码（如果有）
  const codeBlock = extractCodeFromInput(userInput);
  if (codeBlock) {
    logs.push(createLog("接收到代码片段", "info"));
    logs.push(createLog(`代码长度: ${codeBlock.length} 字符`, "info"));
    logs.push(createLog("检测到语言: Python", "success"));
  } else {
    logs.push(createLog("⚠️ 未检测到有效代码，使用示例代码进行分析", "warning"));
    logs.push(createLog("加载示例Python代码...", "info"));
  }
  
  steps[0].status = "completed";
  yield { logs, steps, agentState: "thinking", progress: 20 };

  steps[1].status = "running";
  yield { logs, steps, agentState: "thinking", progress: 25 };

  await sleep(1200);
  logs.push(createLog("执行语法检查...", "info"));
  await sleep(800);
  logs.push(createLog("✓ 语法检查通过", "success"));

  const typeChecker = enabledTools.find((t) => t.id === "type-checker");
  if (typeChecker) {
    await sleep(1000);
    logs.push(createLog("执行类型检查...", "info"));
    await sleep(800);
    logs.push(createLog("⚠ 发现2处类型注解缺失", "warning"));
    logs.push(createLog("  • query_user() 函数缺少参数和返回值类型", "warning"));
    logs.push(createLog("  • process_data() 函数缺少参数和返回值类型", "warning"));
  }

  steps[1].status = "completed";
  yield { logs, steps, agentState: "thinking", progress: 40 };

  steps[2].status = "running";
  yield { logs, steps, agentState: "executing", progress: 45 };

  const securityScanner = enabledTools.find((t) => t.id === "security-scanner");
  if (securityScanner) {
    await sleep(1000);
    logs.push(createLog("运行安全扫描...", "info"));
    await sleep(1200);
    logs.push(createLog("🔴 发现SQL注入风险（高优先级）", "error"));
    logs.push(createLog("  位置: query_user() 函数第7行", "error"));
    logs.push(createLog("  问题: 使用字符串拼接构建SQL查询", "error"));
    logs.push(createLog("  建议: 使用参数化查询防止SQL注入", "info"));
    logs.push(createLog("  修复示例: cursor.execute('SELECT * FROM users WHERE username=? AND password=?', (username, password))", "info"));
  }

  steps[2].status = "completed";
  yield { logs, steps, agentState: "executing", progress: 60 };

  steps[3].status = "running";
  yield { logs, steps, agentState: "executing", progress: 65 };

  const perfAnalyzer = enabledTools.find((t) => t.id === "perf-analyzer");
  if (perfAnalyzer) {
    await sleep(1000);
    logs.push(createLog("分析代码复杂度...", "info"));
    await sleep(800);
    logs.push(createLog("⚡ 循环嵌套过深 (层级: 3)", "warning"));
    logs.push(createLog("  位置: process_data() 函数", "warning"));
    logs.push(createLog("  Cyclomatic Complexity: 8 (建议 < 5)", "warning"));
    logs.push(createLog("💡 建议: 提取为独立函数或使用列表推导式", "info"));
  }

  steps[3].status = "completed";
  yield { logs, steps, agentState: "executing", progress: 80 };

  steps[4].status = "running";
  yield { logs, steps, agentState: "completed", progress: 85 };

  await sleep(1500);
  logs.push(createLog("========== 代码审查报告 ==========", "success"));
  logs.push(createLog("", "info"));
  logs.push(createLog("✅ 优点:", "success"));
  logs.push(createLog("  • 代码结构清晰，命名规范", "info"));
  logs.push(createLog("  • 有适当的错误处理", "info"));
  logs.push(createLog("  • 包含文档字符串", "info"));
  logs.push(createLog("", "info"));
  logs.push(createLog("⚠️ 需要改进:", "warning"));
  logs.push(createLog("  🔴 [高] 修复SQL注入漏洞（立即处理）", "error"));
  logs.push(createLog("  🟡 [中] 添加类型注解提高可维护性", "warning"));
  logs.push(createLog("  🟡 [中] 优化process_data()的循环结构", "warning"));
  logs.push(createLog("  🟢 [低] 考虑添加单元测试", "info"));
  logs.push(createLog("", "info"));
  logs.push(createLog("===================================", "success"));

  steps[4].status = "completed";
  yield { logs, steps, agentState: "completed", progress: 100 };
}

// 辅助函数：从输入中提取代码块
function extractCodeFromInput(input: string): string | null {
  // 尝试匹配 ```python ... ``` 格式的的代码块
  const codeBlockMatch = input.match(/```(?:python)?\s*([\s\S]*?)```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1].trim();
  }
  
  // 如果没有代码块标记，尝试检测是否包含Python代码特征
  const pythonKeywords = ['def ', 'import ', 'class ', 'for ', 'if ', 'return ', 'print('];
  const hasPythonCode = pythonKeywords.some(keyword => input.includes(keyword));
  
  if (hasPythonCode) {
    return input;
  }
  
  return null;
}

// ==================== 数据分析Agent ====================

async function* simulateDataAnalysisAgent(
  userInput: string,
  enabledTools: Tool[]
): AsyncGenerator<SimulationState> {
  const logs: LogEntry[] = [];
  const steps: ProcessStep[] = [
    { id: "1", name: "数据预处理", status: "pending", description: "清洗、格式化数据" },
    { id: "2", name: "探索性分析", status: "pending", description: "统计指标计算" },
    { id: "3", name: "趋势识别", status: "pending", description: "时间序列、相关性分析" },
    { id: "4", name: "可视化生成", status: "pending", description: "创建图表" },
    { id: "5", name: "洞察总结", status: "pending", description: "生成分析报告" },
  ];

  steps[0].status = "running";
  yield { logs, steps, agentState: "thinking", progress: 0 };

  await sleep(1000);
  
  // 从用户输入中提取数据（如果有）
  const dataContent = extractDataFromInput(userInput);
  if (dataContent) {
    const lines = dataContent.trim().split('\n');
    const rowCount = lines.length - 1; // 减去表头
    logs.push(createLog("加载数据集...", "info"));
    logs.push(createLog(`数据形状: ${rowCount}行 × ${lines[0]?.split(',').length || 0}列`, "success"));
    logs.push(createLog("检测到格式: CSV", "success"));
  } else {
    logs.push(createLog("⚠️ 未检测到有效数据，使用示例销售数据进行分析", "warning"));
    logs.push(createLog("加载示例销售数据...", "info"));
    logs.push(createLog("数据形状: 15行 × 6列", "success"));
  }

  const dataLoader = enabledTools.find((t) => t.id === "data-loader");
  if (dataLoader) {
    await sleep(800);
    logs.push(createLog("检查缺失值...", "info"));
    await sleep(600);
    logs.push(createLog("✓ 缺失值比例: 0%", "success"));
    logs.push(createLog("✓ 数据类型验证通过", "success"));
  }

  steps[0].status = "completed";
  yield { logs, steps, agentState: "thinking", progress: 20 };

  steps[1].status = "running";
  yield { logs, steps, agentState: "thinking", progress: 25 };

  await sleep(1200);
  logs.push(createLog("计算描述性统计...", "info"));
  await sleep(800);
  logs.push(createLog("📊 销售额统计:", "info"));
  logs.push(createLog("  • 均值: ¥45,733", "success"));
  logs.push(createLog("  • 中位数: ¥42,000", "success"));
  logs.push(createLog("  • 最大值: ¥68,000 (2025-05, 华东, 电子产品)", "info"));
  logs.push(createLog("  • 最小值: ¥28,000 (2025-01, 华北, 家居)", "info"));
  logs.push(createLog("  • 标准差: ¥12,890", "info"));

  steps[1].status = "completed";
  yield { logs, steps, agentState: "thinking", progress: 40 };

  steps[2].status = "running";
  yield { logs, steps, agentState: "executing", progress: 45 };

  const statsEngine = enabledTools.find((t) => t.id === "stats-engine");
  if (statsEngine) {
    await sleep(1000);
    logs.push(createLog("执行时间序列分析...", "info"));
    await sleep(1200);
    logs.push(createLog("📈 检测到稳定上升趋势", "success"));
    logs.push(createLog("  • 月均增长率: 12.5%", "info"));
    logs.push(createLog("  • R² = 0.94 (拟合度良好)", "info"));
    logs.push(createLog("", "info"));
    logs.push(createLog("📊 地区表现对比:", "info"));
    logs.push(createLog("  • 华东: ¥57,000 (最佳)", "success"));
    logs.push(createLog("  • 华南: ¥38,400", "info"));
    logs.push(createLog("  • 华北: ¥33,400", "info"));
    logs.push(createLog("", "info"));
    logs.push(createLog("🏆 产品类别排名:", "info"));
    logs.push(createLog("  1. 电子产品: ¥57,000", "success"));
    logs.push(createLog("  2. 服装: ¥38,400", "info"));
    logs.push(createLog("  3. 家居: ¥33,400", "info"));
  }

  steps[2].status = "completed";
  yield { logs, steps, agentState: "executing", progress: 60 };

  steps[3].status = "running";
  yield { logs, steps, agentState: "executing", progress: 65 };

  const vizGenerator = enabledTools.find((t) => t.id === "viz-generator");
  if (vizGenerator) {
    await sleep(1000);
    logs.push(createLog("生成可视化图表...", "info"));
    await sleep(1000);
    logs.push(createLog("📉 已生成: 月度销售趋势折线图", "success"));
    logs.push(createLog("📊 已生成: 地区销售额对比柱状图", "success"));
    logs.push(createLog("🥧 已生成: 产品类别占比饼图", "success"));
  }

  steps[3].status = "completed";
  yield { logs, steps, agentState: "executing", progress: 80 };

  steps[4].status = "running";
  yield { logs, steps, agentState: "completed", progress: 85 };

  await sleep(1500);
  logs.push(createLog("========== 数据分析报告 ==========", "success"));
  logs.push(createLog("", "info"));
  logs.push(createLog("📊 核心发现:", "success"));
  logs.push(createLog("  1. ✅ 销售额呈稳定增长趋势（月均+12.5%）", "info"));
  logs.push(createLog("  2. 🏆 华东地区表现最佳，贡献45%总销售额", "info"));
  logs.push(createLog("  3. 📱 电子产品是最畅销品类，建议加大投入", "info"));
  logs.push(createLog("  4. ⚠️ 华北地区增长较慢，需关注", "warning"));
  logs.push(createLog("", "info"));
  logs.push(createLog("💡 行动建议:", "success"));
  logs.push(createLog("  • 短期: Q2前为华东地区备货充足", "info"));
  logs.push(createLog("  • 中期: 分析华北地区增长瓶颈", "info"));
  logs.push(createLog("  • 长期: 考虑拓展西南、西北市场", "info"));
  logs.push(createLog("", "info"));
  logs.push(createLog("====================================", "success"));

  steps[4].status = "completed";
  yield { logs, steps, agentState: "completed", progress: 100 };
}

// 辅助函数：从输入中提取CSV数据
function extractDataFromInput(input: string): string | null {
  // 尝试匹配 ```csv ... ``` 或 ```data ... ``` 格式的数据块
  const dataBlockMatch = input.match(/```(?:csv|data)?\s*([\s\S]*?)```/);
  if (dataBlockMatch && dataBlockMatch[1]) {
    return dataBlockMatch[1].trim();
  }
  
  // 如果没有代码块标记，尝试检测是否包含CSV特征（有逗号分隔的多行数据）
  const lines = input.split('\n').filter(line => line.trim());
  if (lines.length >= 2) {
    const hasCommas = lines.some(line => line.includes(','));
    const hasHeader = lines[0]?.includes(',') && !lines[0]?.match(/^\d+/); // 表头通常不包含纯数字开头
    if (hasCommas && hasHeader) {
      return input;
    }
  }
  
  return null;
}

// ==================== 客服对话Agent ====================

async function* simulateCustomerServiceAgent(
  userInput: string,
  enabledTools: Tool[]
): AsyncGenerator<SimulationState> {
  const logs: LogEntry[] = [];
  const steps: ProcessStep[] = [
    { id: "1", name: "情感分析", status: "pending", description: "识别用户情绪状态" },
    { id: "2", name: "意图分类", status: "pending", description: "判断问题类型" },
    { id: "3", name: "实体提取", status: "pending", description: "提取订单号等关键信息" },
    { id: "4", name: "知识检索", status: "pending", description: "查询相关政策和解决方案" },
    { id: "5", name: "生成回复", status: "pending", description: "组织个性化响应" },
  ];

  steps[0].status = "running";
  yield { logs, steps, agentState: "thinking", progress: 0 };

  await sleep(1000);
  logs.push(createLog("分析用户情绪...", "info"));
  await sleep(800);
  logs.push(createLog("😟 检测到焦虑情绪", "warning"));
  logs.push(createLog("紧急程度: 中等", "info"));

  steps[0].status = "completed";
  yield { logs, steps, agentState: "thinking", progress: 20 };

  steps[1].status = "running";
  yield { logs, steps, agentState: "thinking", progress: 25 };

  await sleep(1000);
  logs.push(createLog("分类问题类型...", "info"));
  await sleep(600);
  logs.push(createLog("📦 问题类型: 物流延迟", "success"));
  logs.push(createLog("置信度: 92%", "info"));

  steps[1].status = "completed";
  yield { logs, steps, agentState: "thinking", progress: 40 };

  steps[2].status = "running";
  yield { logs, steps, agentState: "executing", progress: 45 };

  const orderExtractor = enabledTools.find((t) => t.id === "order-extractor");
  if (orderExtractor) {
    await sleep(800);
    logs.push(createLog("提取订单信息...", "info"));
    await sleep(600);
    logs.push(createLog("订单号: ORD20260516001", "success"));
    logs.push(createLog("下单时间: 2026-05-10", "info"));
  }

  steps[2].status = "completed";
  yield { logs, steps, agentState: "executing", progress: 60 };

  steps[3].status = "running";
  yield { logs, steps, agentState: "executing", progress: 65 };

  const kbSearch = enabledTools.find((t) => t.id === "kb-search");
  if (kbSearch) {
    await sleep(1000);
    logs.push(createLog("检索知识库...", "info"));
    await sleep(1000);
    logs.push(createLog("找到相关政策: 延迟补偿方案", "success"));
    logs.push(createLog("物流状态: 运输中，预计明日送达", "info"));
  }

  steps[3].status = "completed";
  yield { logs, steps, agentState: "executing", progress: 80 };

  steps[4].status = "running";
  yield { logs, steps, agentState: "completed", progress: 85 };

  await sleep(1500);
  logs.push(createLog("========== 客服回复 ==========", "success"));
  logs.push(createLog("", "info"));
  logs.push(createLog("您好！非常理解您等待包裹的心情。", "info"));
  logs.push(createLog("", "info"));
  logs.push(createLog("我帮您查询了订单 ORD20260516001 的状态：", "info"));
  logs.push(createLog("• 当前状态: 运输中", "info"));
  logs.push(createLog("• 预计送达: 明天（5月17日）下午6点前", "info"));
  logs.push(createLog("", "info"));
  logs.push(createLog("为表歉意，我们为您提供了一张20元优惠券：", "info"));
  logs.push(createLog("优惠码: SORRY20（有效期30天）", "success"));
  logs.push(createLog("", "info"));
  logs.push(createLog("如果明天仍未收到，请随时联系我们！", "info"));
  logs.push(createLog("", "info"));
  logs.push(createLog("===============================", "success"));

  steps[4].status = "completed";
  yield { logs, steps, agentState: "completed", progress: 100 };
}

// ==================== 场景注册表 ====================

export const scenarios: Scenario[] = [
  {
    id: "travel",
    name: "旅游规划",
    description: "智能规划旅行行程",
    icon: "✈️",
    defaultInput: "我想去上海玩3天",
    tools: [
      { id: "search", name: "搜索引擎", description: "搜索网络信息，获取最新数据", enabled: true },
      { id: "calendar", name: "日历读取", description: "查看用户日程安排，规划时间", enabled: true },
      { id: "booking", name: "机票预订", description: "查询和预订机票酒店", enabled: false },
    ],
    steps: [
      { id: "1", name: "分析用户意图", status: "pending" },
      { id: "2", name: "提取关键信息", status: "pending" },
      { id: "3", name: "调用工具", status: "pending" },
      { id: "4", name: "生成旅游计划", status: "pending" },
      { id: "5", name: "输出结果", status: "pending" },
    ],
    simulate: simulateTravelAgent,
  },
  {
    id: "code-review",
    name: "代码审查",
    description: "自动审查代码质量",
    icon: "🔍",
    defaultInput: "请帮我审查以下Python代码的质量，重点关注安全性和性能问题：",
    exampleData: `import sqlite3

def query_user(username, password):
    """查询用户信息"""
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # 构建SQL查询
    query = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'"
    result = cursor.execute(query)
    
    for row in result:
        print(f"User: {row[0]}, Email: {row[1]}")
    
    return result

def process_data(items):
    """处理数据列表"""
    results = []
    for item in items:
        for sub_item in item.get('children', []):
            for detail in sub_item.get('details', []):
                if detail['value'] > 100:
                    results.append(detail)
    return results

# 主程序
if __name__ == "__main__":
    user = query_user("admin", "password123")
    data = process_data([{'children': [{'details': [{'value': 150}]}]}])`,
    exampleDataType: "code",
    tools: [
      { id: "type-checker", name: "类型检查器", description: "检查类型注解和一致性", enabled: true },
      { id: "security-scanner", name: "安全扫描器", description: "检测潜在安全漏洞", enabled: true },
      { id: "perf-analyzer", name: "性能分析器", description: "分析代码复杂度和性能", enabled: true },
    ],
    steps: [
      { id: "1", name: "解析代码结构", status: "pending" },
      { id: "2", name: "静态分析", status: "pending" },
      { id: "3", name: "安全扫描", status: "pending" },
      { id: "4", name: "性能分析", status: "pending" },
      { id: "5", name: "生成建议", status: "pending" },
    ],
    simulate: simulateCodeReviewAgent,
  },
  {
    id: "data-analysis",
    name: "数据分析",
    description: "分析数据并生成报告",
    icon: "📊",
    defaultInput: "请分析以下销售数据，找出趋势、问题和改进建议：",
    exampleData: `月份,地区,产品类别,销售额,订单数,客户数
2025-01,华东,电子产品,45000,120,85
2025-01,华南,服装,32000,95,70
2025-01,华北,家居,28000,80,60
2025-02,华东,电子产品,52000,135,92
2025-02,华南,服装,35000,100,75
2025-02,华北,家居,30000,85,65
2025-03,华东,电子产品,58000,145,98
2025-03,华南,服装,38000,110,80
2025-03,华北,家居,33000,90,70
2025-04,华东,电子产品,62000,155,105
2025-04,华南,服装,42000,120,88
2025-04,华北,家居,36000,95,75
2025-05,华东,电子产品,68000,165,112
2025-05,华南,服装,45000,125,92
2025-05,华北,家居,40000,100,80`,
    exampleDataType: "data",
    tools: [
      { id: "data-loader", name: "数据加载器", description: "加载和预处理数据", enabled: true },
      { id: "stats-engine", name: "统计分析引擎", description: "执行统计分析", enabled: true },
      { id: "viz-generator", name: "可视化生成器", description: "创建数据图表", enabled: true },
    ],
    steps: [
      { id: "1", name: "数据预处理", status: "pending" },
      { id: "2", name: "探索性分析", status: "pending" },
      { id: "3", name: "趋势识别", status: "pending" },
      { id: "4", name: "可视化生成", status: "pending" },
      { id: "5", name: "洞察总结", status: "pending" },
    ],
    simulate: simulateDataAnalysisAgent,
  },
];

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find(s => s.id === id);
}
