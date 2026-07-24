#!/usr/bin/env python3
"""
Generate comprehensive SVG illustrations for all 40 episodes
Each illustration should have detailed, educational content
"""

# Episode topics and key concepts with detailed descriptions
EPISODES = {
    1: {
        "title": "AI 就在你身边",
        "main": "AI 无处不在",
        "concepts": [
            {"name": "手机", "desc": "语音助手/拍照/推荐"},
            {"name": "家中", "desc": "音箱/电视/扫地机"},
            {"name": "出行", "desc": "导航/打车/公交"},
            {"name": "学校", "desc": "作业批改/翻译"}
        ],
        "insight": "AI 已经渗透到生活的每个角落"
    },
    2: {
        "title": "AI 怎么'学会'的",
        "main": "机器学习三步曲",
        "concepts": [
            {"name": "看数据", "desc": "接收大量例子"},
            {"name": "找规律", "desc": "分析共同特征"},
            {"name": "做判断", "desc": "识别新东西"}
        ],
        "insight": "机器学习 = 从数据中自动发现规律"
    },
    3: {
        "title": "AI 的眼睛",
        "main": "图像识别原理",
        "concepts": [
            {"name": "像素", "desc": "图片的基本单元"},
            {"name": "特征", "desc": "边缘/纹理/形状"},
            {"name": "卷积", "desc": "提取关键信息"},
            {"name": "分类", "desc": "判断是什么"}
        ],
        "insight": "CNN 就像人眼：先看到边缘，再看到形状，最后认出物体"
    },
    4: {
        "title": "AI 的耳朵",
        "main": "语音识别过程",
        "concepts": [
            {"name": "声波", "desc": "声音的物理形式"},
            {"name": "频率", "desc": "声音的高低变化"},
            {"name": "特征", "desc": "提取语音特征"},
            {"name": "文字", "desc": "转换成文本"}
        ],
        "insight": "语音识别 = 把声波变成文字的过程"
    },
    5: {
        "title": "AI 怎么说话",
        "main": "自然语言处理",
        "concepts": [
            {"name": "分词", "desc": "切分句子成分"},
            {"name": "语义", "desc": "理解含义"},
            {"name": "生成", "desc": "组织语言回复"},
            {"name": "NLP", "desc": "自然语言处理"}
        ],
        "insight": "NLP 让 AI 能听懂人话、说人话"
    },
    6: {
        "title": "大语言模型",
        "main": "GPT 工作原理",
        "concepts": [
            {"name": "Transformer", "desc": "核心架构"},
            {"name": "注意力", "desc": "关注重点信息"},
            {"name": "预训练", "desc": "海量数据学习"},
            {"name": "微调", "desc": "针对性优化"}
        ],
        "insight": "大语言模型 = 超大规模的文本预测器"
    },
    7: {
        "title": "AI 也会犯错",
        "main": "AI 的局限性",
        "concepts": [
            {"name": "幻觉", "desc": "编造不存在的信息"},
            {"name": "偏见", "desc": "数据偏差导致"},
            {"name": "过拟合", "desc": "死记硬背"},
            {"name": "欠拟合", "desc": "学得不够"}
        ],
        "insight": "AI 不是万能的，需要人类监督和纠正"
    },
    8: {
        "title": "数据的力量",
        "main": "大数据处理流程",
        "concepts": [
            {"name": "采集", "desc": "收集原始数据"},
            {"name": "清洗", "desc": "去除噪声"},
            {"name": "标注", "desc": "添加标签"},
            {"name": "增强", "desc": "扩充数据集"}
        ],
        "insight": "数据是 AI 的燃料，质量决定 AI 水平"
    },
    9: {
        "title": "AI 是怎么'看'图的",
        "main": "计算机视觉技术",
        "concepts": [
            {"name": "检测", "desc": "找到物体位置"},
            {"name": "分割", "desc": "区分不同物体"},
            {"name": "识别", "desc": "判断是什么"},
            {"name": "生成", "desc": "创造新图像"}
        ],
        "insight": "计算机视觉让 AI 拥有了'眼睛'"
    },
    10: {
        "title": "AI 是怎么'听'话的",
        "main": "语音技术全览",
        "concepts": [
            {"name": "识别", "desc": "语音转文字"},
            {"name": "合成", "desc": "文字转语音"},
            {"name": "克隆", "desc": "模仿特定声音"},
            {"name": "情感", "desc": "识别情绪状态"}
        ],
        "insight": "语音技术让 AI 能听会说"
    },
    11: {
        "title": "AI 的'记忆'",
        "main": "知识存储与检索",
        "concepts": [
            {"name": "知识图谱", "desc": "结构化知识"},
            {"name": "向量库", "desc": "相似性搜索"},
            {"name": "RAG", "desc": "检索增强生成"},
            {"name": "上下文", "desc": "对话历史"}
        ],
        "insight": "RAG 让 AI 能引用最新、最准确的信息"
    },
    12: {
        "title": "算法是什么",
        "main": "算法核心概念",
        "concepts": [
            {"name": "步骤", "desc": "解决问题的流程"},
            {"name": "效率", "desc": "完成速度"},
            {"name": "准确性", "desc": "结果质量"},
            {"name": "可扩展", "desc": "处理大数据"}
        ],
        "insight": "好算法 = 高效率 + 高准确性 + 可扩展"
    },
    13: {
        "title": "数据的质量",
        "main": "数据质量四要素",
        "concepts": [
            {"name": "准确性", "desc": "数据正确无误"},
            {"name": "完整性", "desc": "信息齐全"},
            {"name": "一致性", "desc": "格式统一"},
            {"name": "时效性", "desc": "数据新鲜"}
        ],
        "insight": "垃圾进，垃圾出 —— 数据质量决定 AI 水平"
    },
    14: {
        "title": "AI 的'大脑'",
        "main": "神经网络原理",
        "concepts": [
            {"name": "神经元", "desc": "基本计算单元"},
            {"name": "权重", "desc": "连接强度"},
            {"name": "激活", "desc": "非线性变换"},
            {"name": "反向传播", "desc": "学习算法"}
        ],
        "insight": "神经网络模拟人脑，通过调整权重来学习"
    },
    15: {
        "title": "提示词工程",
        "main": "Prompt 设计技巧",
        "concepts": [
            {"name": "明确", "desc": "说清楚需求"},
            {"name": "上下文", "desc": "提供背景信息"},
            {"name": "示例", "desc": "给参考案例"},
            {"name": "格式", "desc": "指定输出格式"}
        ],
        "insight": "好的提示词 = 清晰 + 具体 + 有上下文"
    },
    16: {
        "title": "计算机之父",
        "main": "计算机历史",
        "concepts": [
            {"name": "图灵", "desc": "人工智能之父"},
            {"name": "冯·诺依曼", "desc": "计算机之父"},
            {"name": "ENIAC", "desc": "第一台计算机"},
            {"name": "图灵测试", "desc": "智能判断标准"}
        ],
        "insight": "计算机和 AI 的发展离不开这些先驱"
    },
    17: {
        "title": "AI 的发展历程",
        "main": "AI 发展时间线",
        "concepts": [
            {"name": "1956", "desc": "达特茅斯会议"},
            {"name": "1980s", "desc": "专家系统"},
            {"name": "2000s", "desc": "机器学习"},
            {"name": "2010s", "desc": "深度学习"}
        ],
        "insight": "AI 经历了多次起伏，现在正处于黄金时代"
    },
    18: {
        "title": "AI 在生活中",
        "main": "AI 生活应用",
        "concepts": [
            {"name": "推荐", "desc": "个性化内容"},
            {"name": "家居", "desc": "智能设备"},
            {"name": "出行", "desc": "自动驾驶"},
            {"name": "医疗", "desc": "辅助诊断"}
        ],
        "insight": "AI 正在改变我们的生活方式"
    },
    19: {
        "title": "AI 在工作中",
        "main": "AI 工作助手",
        "concepts": [
            {"name": "办公", "desc": "文档/表格/演示"},
            {"name": "代码", "desc": "编程辅助"},
            {"name": "设计", "desc": "创意工具"},
            {"name": "分析", "desc": "数据洞察"}
        ],
        "insight": "AI 是提高工作效率的得力助手"
    },
    20: {
        "title": "中国 AI",
        "main": "中国 AI 发展",
        "concepts": [
            {"name": "百度", "desc": "文心一言"},
            {"name": "阿里", "desc": "通义千问"},
            {"name": "华为", "desc": "盘古大模型"},
            {"name": "DeepSeek", "desc": "开源先锋"}
        ],
        "insight": "中国 AI 歅速发展，在多个领域达到世界先进水平"
    },
    21: {
        "title": "AI 伦理",
        "main": "AI 伦理问题",
        "concepts": [
            {"name": "隐私", "desc": "数据保护"},
            {"name": "公平", "desc": "避免歧视"},
            {"name": "透明", "desc": "可解释性"},
            {"name": "责任", "desc": "谁负责"}
        ],
        "insight": "技术发展必须与伦理规范同步"
    },
    22: {
        "title": "AI 安全",
        "main": "AI 安全挑战",
        "concepts": [
            {"name": "对抗", "desc": "恶意攻击"},
            {"name": "鲁棒", "desc": "抗干扰能力"},
            {"name": "可解释", "desc": "理解决策"},
            {"name": "对齐", "desc": "符合人类价值观"}
        ],
        "insight": "AI 安全是技术发展的底线"
    },
    23: {
        "title": "AI 创作",
        "main": "AIGC 内容生成",
        "concepts": [
            {"name": "图像", "desc": "Midjourney/DALL-E"},
            {"name": "音乐", "desc": "AI 作曲"},
            {"name": "视频", "desc": "AI 生成视频"},
            {"name": "文本", "desc": "AI 写作"}
        ],
        "insight": "AIGC 正在重塑内容创作行业"
    },
    24: {
        "title": "AI 游戏",
        "main": "游戏 AI 技术",
        "concepts": [
            {"name": "强化学习", "desc": "试错学习"},
            {"name": "AlphaGo", "desc": "围棋 AI"},
            {"name": "决策树", "desc": "策略规划"},
            {"name": "蒙特卡洛", "desc": "随机模拟"}
        ],
        "insight": "游戏是 AI 研究的重要试验场"
    },
    25: {
        "title": "AI 教育",
        "main": "AI 教育应用",
        "concepts": [
            {"name": "个性化", "desc": "因材施教"},
            {"name": "辅导", "desc": "智能答疑"},
            {"name": "自适应", "desc": "难度调整"},
            {"name": "分析", "desc": "学习诊断"}
        ],
        "insight": "AI 让教育更加个性化和高效"
    },
    26: {
        "title": "AI 医疗",
        "main": "AI 医疗应用",
        "concepts": [
            {"name": "影像", "desc": "CT/MRI 分析"},
            {"name": "药物", "desc": "新药研发"},
            {"name": "基因", "desc": "基因分析"},
            {"name": "诊断", "desc": "辅助诊断"}
        ],
        "insight": "AI 正在改变医疗行业，提高诊断准确率"
    },
    27: {
        "title": "AI 交通",
        "main": "智能交通系统",
        "concepts": [
            {"name": "自动驾驶", "desc": "无人驾驶"},
            {"name": "车路协同", "desc": "V2X 通信"},
            {"name": "预测", "desc": "交通流量"},
            {"name": "规划", "desc": "路径优化"}
        ],
        "insight": "AI 让交通更安全、更高效"
    },
    28: {
        "title": "AI 金融",
        "main": "AI 金融应用",
        "concepts": [
            {"name": "量化", "desc": "算法交易"},
            {"name": "风控", "desc": "风险管理"},
            {"name": "反欺诈", "desc": "异常检测"},
            {"name": "客服", "desc": "智能服务"}
        ],
        "insight": "AI 正在重塑金融行业"
    },
    29: {
        "title": "AI 创业",
        "main": "AI 创业要素",
        "concepts": [
            {"name": "产品", "desc": "解决真问题"},
            {"name": "数据", "desc": "核心竞争力"},
            {"name": "技术", "desc": "选型与实现"},
            {"name": "市场", "desc": "需求验证"}
        ],
        "insight": "AI 创业需要技术、数据和商业的结合"
    },
    30: {
        "title": "AI 未来趋势",
        "main": "AI 未来展望",
        "concepts": [
            {"name": "AGI", "desc": "通用人工智能"},
            {"name": "多模态", "desc": "多种感知融合"},
            {"name": "具身", "desc": "机器人智能"},
            {"name": "脑机", "desc": "人机融合"}
        ],
        "insight": "AI 的未来充满想象空间"
    },
    31: {
        "title": "动手做 AI",
        "main": "AI 开发入门",
        "concepts": [
            {"name": "Python", "desc": "编程语言"},
            {"name": "库", "desc": "TensorFlow/PyTorch"},
            {"name": "数据集", "desc": "训练数据"},
            {"name": "模型", "desc": "训练与部署"}
        ],
        "insight": "动手实践是学习 AI 的最好方式"
    },
    32: {
        "title": "第一个 AI 项目",
        "main": "项目开发流程",
        "concepts": [
            {"name": "定义", "desc": "明确问题"},
            {"name": "数据", "desc": "收集整理"},
            {"name": "模型", "desc": "选择训练"},
            {"name": "评估", "desc": "测试优化"}
        ],
        "insight": "完整的项目经验比碎片化学习更有价值"
    },
    33: {
        "title": "图像识别项目",
        "main": "CNN 实战",
        "concepts": [
            {"name": "数据增强", "desc": "扩充数据集"},
            {"name": "迁移学习", "desc": "利用预训练模型"},
            {"name": "调参", "desc": "优化超参数"},
            {"name": "部署", "desc": "上线运行"}
        ],
        "insight": "图像识别是 AI 入门的最佳实践"
    },
    34: {
        "title": "文本分类项目",
        "main": "NLP 实战",
        "concepts": [
            {"name": "预处理", "desc": "分词/去停用词"},
            {"name": "向量化", "desc": "文本转数字"},
            {"name": "分类器", "desc": "模型选择"},
            {"name": "评估", "desc": "准确率/F1"}
        ],
        "insight": "文本分类是 NLP 的基础应用"
    },
    35: {
        "title": "推荐系统项目",
        "main": "推荐算法",
        "concepts": [
            {"name": "协同过滤", "desc": "用户行为相似"},
            {"name": "内容推荐", "desc": "物品特征匹配"},
            {"name": "混合", "desc": "结合多种方法"},
            {"name": "评估", "desc": "点击率/转化率"}
        ],
        "insight": "推荐系统是 AI 商业化最成功的应用"
    },
    36: {
        "title": "AI 挑战赛",
        "main": "竞赛参与",
        "concepts": [
            {"name": "Kaggle", "desc": "数据科学竞赛"},
            {"name": "策略", "desc": "解题思路"},
            {"name": "优化", "desc": "模型调优"},
            {"name": "团队", "desc": "协作学习"}
        ],
        "insight": "竞赛是快速提升 AI 技能的有效途径"
    },
    37: {
        "title": "AI 作品集",
        "main": "项目展示",
        "concepts": [
            {"name": "文档", "desc": "技术文档"},
            {"name": "演示", "desc": "效果展示"},
            {"name": "代码", "desc": "开源分享"},
            {"name": "反思", "desc": "总结经验"}
        ],
        "insight": "好的作品集是 AI 能力的最佳证明"
    },
    38: {
        "title": "AI 学习路线",
        "main": "学习路径",
        "concepts": [
            {"name": "基础", "desc": "数学/编程"},
            {"name": "进阶", "desc": "机器学习/深度学习"},
            {"name": "实践", "desc": "项目经验"},
            {"name": "持续", "desc": "跟进前沿"}
        ],
        "insight": "AI 学习是一个持续的过程"
    },
    39: {
        "title": "AI 职业探索",
        "main": "AI 职业方向",
        "concepts": [
            {"name": "工程师", "desc": "模型开发"},
            {"name": "科学家", "desc": "算法研究"},
            {"name": "产品经理", "desc": "AI 产品"},
            {"name": "伦理专家", "desc": "AI 治理"}
        ],
        "insight": "AI 时代需要多元化的人才"
    },
    40: {
        "title": "AI 改变世界",
        "main": "AI 与未来",
        "concepts": [
            {"name": "技术革命", "desc": "第四次工业革命"},
            {"name": "社会影响", "desc": "就业与教育"},
            {"name": "人机协作", "desc": "增强人类能力"},
            {"name": "可持续", "desc": "绿色发展"}
        ],
        "insight": "AI 的未来由我们共同塑造"
    }
}

# Color schemes for different modules
MODULE_COLORS = {
    1: ("#06b6d4", "#22d3ee"),   # Cyan - AI通识
    2: ("#f59e0b", "#fbbf24"),   # Amber - 技术原理
    3: ("#a855f7", "#c084fc"),   # Purple - 发展历史
    4: ("#10b981", "#34d399"),   # Green - 应用领域
    5: ("#ec4899", "#f472b6"),   # Pink - 动手实践
    6: ("#3b82f6", "#60a5fa"),   # Blue - 综合提升
}

def get_module(episode_id):
    if episode_id <= 10: return 1
    elif episode_id <= 20: return 2
    elif episode_id <= 25: return 3
    elif episode_id <= 30: return 4
    elif episode_id <= 35: return 5
    else: return 6

def generate_svg(episode_id, episode_info):
    mod = get_module(episode_id)
    color1, color2 = MODULE_COLORS[mod]
    title = episode_info["title"]
    main_concept = episode_info["main"]
    concepts = episode_info["concepts"]
    insight = episode_info["insight"]

    svg = f'<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">'
    svg += f'<rect width="800" height="300" fill="#1e293b" rx="8"/>'

    # Title
    svg += f'<text x="400" y="35" text-anchor="middle" fill="{color1}" font-size="14" font-family="sans-serif" font-weight="bold">{title}</text>'

    # Main concept - central box
    svg += f'<rect x="300" y="60" width="200" height="80" rx="10" fill="{color1}" opacity="0.2" stroke="{color1}" stroke-width="2"/>'
    svg += f'<text x="400" y="95" text-anchor="middle" fill="{color1}" font-size="12" font-family="sans-serif" font-weight="bold">{main_concept}</text>'
    svg += f'<text x="400" y="115" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="sans-serif">核心概念</text>'

    # Arrow marker definition
    svg += '<defs><marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#334155"/></marker></defs>'

    # Surrounding concepts - 4 boxes
    positions = [(50, 160), (215, 160), (380, 160), (545, 160)]
    for i, (x, y) in enumerate(positions[:len(concepts)]):
        concept = concepts[i]
        svg += f'<rect x="{x}" y="{y}" width="150" height="60" rx="8" fill="none" stroke="{color2}" stroke-width="1.5"/>'
        svg += f'<text x="{x+75}" y="{y+25}" text-anchor="middle" fill="{color2}" font-size="10" font-family="sans-serif" font-weight="bold">{concept["name"]}</text>'
        svg += f'<text x="{x+75}" y="{y+45}" text-anchor="middle" fill="#94a3b8" font-size="8" font-family="sans-serif">{concept["desc"]}</text>'

    # Insight box at bottom
    svg += f'<rect x="100" y="240" width="600" height="40" rx="8" fill="none" stroke="{color1}" stroke-width="1" opacity="0.5"/>'
    svg += f'<text x="400" y="265" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="sans-serif">{insight}</text>'

    svg += '</svg>'
    return svg

# Generate all SVGs
print("Generating comprehensive illustrations...")
illustrations = {}

for ep_id in range(1, 41):
    if ep_id in EPISODES:
        illustrations[str(ep_id)] = generate_svg(ep_id, EPISODES[ep_id])
        print(f"  Generated episode {ep_id}: {EPISODES[ep_id]['title']}")

# Write to file
output = "var ILLUSTRATIONS = {\n"
for key, svg in illustrations.items():
    escaped = svg.replace('"', '\\"')
    output += f'  {key}: "{escaped}",\n'
output += "};\n"

with open("/Users/dandan/Her工作间/AI课程网站/js/illustrations_v2.js", "w", encoding="utf-8") as f:
    f.write(output)

print(f"\nGenerated {len(illustrations)} illustrations")
print("Saved to illustrations_v2.js")
