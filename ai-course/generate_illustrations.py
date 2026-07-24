#!/usr/bin/env python3
"""
Generate complete SVG illustrations for all 40 episodes
Each illustration should have meaningful content related to the episode topic
"""

import re
import json

# Episode topics and key concepts
EPISODES = {
    1: {"title": "AI 就在你身边", "concepts": ["输入", "处理", "输出", "手机", "家", "出行", "学校"]},
    2: {"title": "AI 怎么'学会'的", "concepts": ["数据", "规律", "预测", "监督学习", "非监督学习"]},
    3: {"title": "AI 的眼睛", "concepts": ["图像识别", "像素", "特征", "卷积神经网络", "CNN"]},
    4: {"title": "AI 的耳朵", "concepts": ["语音识别", "声波", "频率", "语音转文字", "自然语言处理"]},
    5: {"title": "AI 怎么说话", "concepts": ["自然语言处理", "NLP", "分词", "语义理解", "文本生成"]},
    6: {"title": "大语言模型", "concepts": ["GPT", "Transformer", "注意力机制", "预训练", "微调"]},
    7: {"title": "AI 也会犯错", "concepts": ["幻觉", "偏见", "过拟合", "欠拟合", "评估指标"]},
    8: {"title": "数据的力量", "concepts": ["大数据", "数据采集", "数据清洗", "数据标注", "数据增强"]},
    9: {"title": "AI 是怎么'看'图的", "concepts": ["计算机视觉", "目标检测", "图像分割", "图像生成"]},
    10: {"title": "AI 是怎么'听'话的", "concepts": ["语音合成", "TTS", "语音克隆", "情感识别"]},
    11: {"title": "AI 的'记忆'", "concepts": ["知识图谱", "向量数据库", "检索增强生成", "RAG"]},
    12: {"title": "算法是什么", "concepts": ["算法", "步骤", "排序", "搜索", "复杂度"]},
    13: {"title": "数据的质量", "concepts": ["数据质量", "准确性", "完整性", "一致性", "时效性"]},
    14: {"title": "AI 的'大脑'", "concepts": ["神经网络", "神经元", "权重", "激活函数", "反向传播"]},
    15: {"title": "提示词工程", "concepts": ["提示词", "Prompt", "上下文", "示例", "格式"]},
    16: {"title": "计算机之父", "concepts": ["图灵", "冯·诺依曼", "计算机历史", "人工智能起源"]},
    17: {"title": "AI 的发展历程", "concepts": ["达特茅斯会议", "专家系统", "机器学习", "深度学习"]},
    18: {"title": "AI 在生活中", "concepts": ["推荐系统", "智能家居", "自动驾驶", "医疗AI"]},
    19: {"title": "AI 在工作中", "concepts": ["办公助手", "代码生成", "设计工具", "数据分析"]},
    20: {"title": "中国 AI", "concepts": ["百度", "阿里巴巴", "腾讯", "华为", "DeepSeek"]},
    21: {"title": "AI 伦理", "concepts": ["隐私", "公平性", "透明度", "责任", "监管"]},
    22: {"title": "AI 安全", "concepts": ["对抗攻击", "鲁棒性", "可解释性", "对齐"]},
    23: {"title": "AI 创作", "concepts": ["AIGC", "图像生成", "音乐生成", "视频生成", "创意工具"]},
    24: {"title": "AI 游戏", "concepts": ["游戏AI", "强化学习", "AlphaGo", "决策树", "蒙特卡洛"]},
    25: {"title": "AI 教育", "concepts": ["个性化学习", "智能辅导", "自适应测试", "学习分析"]},
    26: {"title": "AI 医疗", "concepts": ["医学影像", "药物研发", "基因分析", "智能诊断"]},
    27: {"title": "AI 交通", "concepts": ["自动驾驶", "车路协同", "交通预测", "路径规划"]},
    28: {"title": "AI 金融", "concepts": ["量化交易", "风险控制", "反欺诈", "智能客服"]},
    29: {"title": "AI 创业", "concepts": ["AI产品", "商业模式", "市场需求", "技术选型"]},
    30: {"title": "AI 未来趋势", "concepts": ["AGI", "多模态", "具身智能", "脑机接口"]},
    31: {"title": "动手做 AI", "concepts": ["Python", "机器学习库", "数据集", "模型训练"]},
    32: {"title": "第一个 AI 项目", "concepts": ["问题定义", "数据收集", "模型选择", "评估优化"]},
    33: {"title": "图像识别项目", "concepts": ["CNN", "数据增强", "迁移学习", "模型部署"]},
    34: {"title": "文本分类项目", "concepts": ["NLP", "词向量", "文本预处理", "分类器"]},
    35: {"title": "推荐系统项目", "concepts": ["协同过滤", "内容推荐", "混合推荐", "评估指标"]},
    36: {"title": "AI 挑战赛", "concepts": ["Kaggle", "数据竞赛", "模型优化", "团队协作"]},
    37: {"title": "AI 作品集", "concepts": ["项目展示", "技术文档", "演示", "反思"]},
    38: {"title": "AI 学习路线", "concepts": ["基础知识", "进阶学习", "实践项目", "持续学习"]},
    39: {"title": "AI 职业探索", "concepts": ["机器学习工程师", "数据科学家", "AI产品经理", "伦理专家"]},
    40: {"title": "AI 改变世界", "concepts": ["技术革命", "社会影响", "人机协作", "未来展望"]}
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
    concepts = episode_info["concepts"]

    # Create meaningful SVG based on episode content
    svg = f'<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">'
    svg += f'<rect width="800" height="300" fill="#1e293b" rx="8"/>'

    # Title
    svg += f'<text x="400" y="35" text-anchor="middle" fill="{color1}" font-size="14" font-family="sans-serif" font-weight="bold">{title}</text>'

    # Add concept boxes based on episode
    if episode_id == 12:  # Algorithm episode - special layout
        # Central algorithm concept
        svg += f'<rect x="300" y="60" width="200" height="80" rx="10" fill="{color1}" opacity="0.2" stroke="{color1}" stroke-width="2"/>'
        svg += f'<text x="400" y="95" text-anchor="middle" fill="{color1}" font-size="12" font-family="sans-serif" font-weight="bold">算法</text>'
        svg += f'<text x="400" y="115" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="sans-serif">解决问题的步骤</text>'

        # Input/Process/Output flow
        svg += f'<rect x="50" y="160" width="120" height="60" rx="8" fill="none" stroke="#06b6d4" stroke-width="2"/>'
        svg += f'<text x="110" y="185" text-anchor="middle" fill="#06b6d4" font-size="10" font-family="sans-serif" font-weight="bold">输入</text>'
        svg += f'<text x="110" y="205" text-anchor="middle" fill="#94a3b8" font-size="8" font-family="sans-serif">问题/数据</text>'

        svg += f'<line x1="170" y1="190" x2="250" y2="190" stroke="#334155" stroke-width="2" marker-end="url(#arrow)"/>'

        svg += f'<rect x="250" y="160" width="120" height="60" rx="8" fill="none" stroke="{color1}" stroke-width="2"/>'
        svg += f'<text x="310" y="185" text-anchor="middle" fill="{color1}" font-size="10" font-family="sans-serif" font-weight="bold">算法</text>'
        svg += f'<text x="310" y="205" text-anchor="middle" fill="#94a3b8" font-size="8" font-family="sans-serif">处理步骤</text>'

        svg += f'<line x1="370" y1="190" x2="450" y2="190" stroke="#334155" stroke-width="2" marker-end="url(#arrow)"/>'

        svg += f'<rect x="450" y="160" width="120" height="60" rx="8" fill="none" stroke="#10b981" stroke-width="2"/>'
        svg += f'<text x="510" y="185" text-anchor="middle" fill="#10b981" font-size="10" font-family="sans-serif" font-weight="bold">输出</text>'
        svg += f'<text x="510" y="205" text-anchor="middle" fill="#94a3b8" font-size="8" font-family="sans-serif">结果/答案</text>'

        # Algorithm examples
        svg += f'<rect x="600" y="160" width="150" height="60" rx="8" fill="none" stroke="#f59e0b" stroke-width="2"/>'
        svg += f'<text x="675" y="185" text-anchor="middle" fill="#f59e0b" font-size="10" font-family="sans-serif" font-weight="bold">排序算法</text>'
        svg += f'<text x="675" y="205" text-anchor="middle" fill="#94a3b8" font-size="8" font-family="sans-serif">冒泡/快排/归并</text>'

        # Key insight
        svg += f'<rect x="100" y="240" width="600" height="40" rx="8" fill="none" stroke="{color1}" stroke-width="1" opacity="0.5"/>'
        svg += f'<text x="400" y="265" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="sans-serif">好算法 = 高效率 + 高准确性 + 可扩展</text>'

    else:  # Default layout for other episodes
        # Central concept
        svg += f'<circle cx="400" cy="120" r="40" fill="{color1}" opacity="0.2" stroke="{color1}" stroke-width="2"/>'
        svg += f'<text x="400" y="115" text-anchor="middle" fill="{color1}" font-size="11" font-family="sans-serif" font-weight="bold">核心</text>'
        svg += f'<text x="400" y="135" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="sans-serif">{concepts[0]}</text>'

        # Surrounding concepts
        positions = [(150, 120), (650, 120), (400, 220)]
        for i, (x, y) in enumerate(positions[:len(concepts)-1]):
            svg += f'<circle cx="{x}" cy="{y}" r="25" fill="{color2}" opacity="0.3" stroke="{color2}" stroke-width="1.5"/>'
            svg += f'<text x="{x}" y="{y+4}" text-anchor="middle" fill="{color2}" font-size="9" font-family="sans-serif">{concepts[i+1]}</text>'

        # Bottom label
        svg += f'<text x="400" y="280" text-anchor="middle" fill="#475569" font-size="10" font-family="sans-serif">第 {episode_id} 集</text>'

    svg += '</svg>'
    return svg

# Generate all SVGs
print("Generating illustrations...")
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

with open("/Users/dandan/Her工作间/AI课程网站/js/illustrations_new.js", "w", encoding="utf-8") as f:
    f.write(output)

print(f"\nGenerated {len(illustrations)} illustrations")
print("Saved to illustrations_new.js")
