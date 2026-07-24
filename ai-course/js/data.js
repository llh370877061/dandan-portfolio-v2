const COURSE_DATA = {
  "modules": [
    {
      "id": 1,
      "title": "AI 通识与兴趣入口",
      "description": "让孩子看见 AI 无处不在，建立好奇心。从日常场景出发，拆解 AI 的能力，理解它的好与坏。",
      "color": "#06b6d4",
      "icon": "🔍",
      "episodes": [
        {
          "id": 1,
          "number": "01",
          "title": "AI 就在你身边",
          "duration": "5-8分钟",
          "objective": "意识到 AI 已经融入日常生活的方方面面",
          "sections": [
            {
              "type": "text",
              "title": "什么是 AI？",
              "content": "AI（人工智能）就是让机器变得“聪明”的技术。它不是一个机器人，而是一种能力——让机器能看、能听、能说、能判断。<br><br>你每天都在用 AI，只是没意识到而已。"
            },
            {
              "type": "image",
              "title": "AI 无处不在",
              "content": "ai-everywhere"
            },
            {
              "type": "table",
              "title": "你身边的 AI",
              "content": [
                [
                  "场景",
                  "AI 在做什么"
                ],
                [
                  "手机语音助手",
                  "听懂你的话，找到答案"
                ],
                [
                  "短视频推荐",
                  "猜你喜欢什么，推给你看"
                ],
                [
                  "人脸识别解锁",
                  "认出这是你的脸"
                ],
                [
                  "导航软件",
                  "预测哪条路最快"
                ],
                [
                  "拍照美颜",
                  "识别五官，自动美化"
                ],
                [
                  "扫码支付",
                  "识别二维码完成交易"
                ],
                [
                  "智能手表",
                  "监测心率、步数、睡眠"
                ]
              ]
            },
            {
              "type": "highlight",
              "content": "AI 不是科幻电影里的机器人，它是一种技术能力，已经融入了我们生活的每个角落。"
            },
            {
              "type": "image",
              "title": "AI工作原理",
              "content": "ai-how-it-works"
            }
          ],
          "quiz": [
            {
              "question": "以下哪个场景用到了 AI？",
              "options": [
                "用纸笔写字",
                "手机语音助手帮你设闹钟",
                "用计算器算数学题",
                "用钥匙开门"
              ],
              "correct": 1,
              "explanation": "手机语音助手需要听懂你的话（语音识别）并做出回应（自然语言处理），这是典型的 AI 应用。"
            },
            {
              "question": "AI 是什么？",
              "options": [
                "一种机器人",
                "让机器变聪明的技术",
                "一种新的手机",
                "一种游戏"
              ],
              "correct": 1,
              "explanation": "AI（人工智能）是让机器变得“聪明”的技术，它是一种能力，而不是某个具体的产品。"
            },
            {
              "question": "短视频平台为什么总能推荐你喜欢的内容？",
              "options": [
                "平台工作人员手动挑选的",
                "AI 分析了你的观看习惯",
                "随机推荐的",
                "你的朋友帮你选的"
              ],
              "correct": 1,
              "explanation": "AI 通过分析你的观看历史、点赞、停留时间等数据，预测你可能喜欢的内容，这就是推荐算法。"
            }
          ],
          "discussion": [
            "在家里走一圈，你能找到多少个用到 AI 的东西？",
            "如果没有 AI，你的生活会有什么变化？"
          ],
            "guides": ["试试看：手机里的语音助手、智能推荐、拍照美颜都是 AI 在帮忙哦。电视的语音遥控、扫地机器人也是！", "想想看：没有 AI 的话，查资料要翻书、导航要看地图、拍照不能美颜……我们的生活会慢很多，但也更手动。"],
          "activity": {
            "title": "AI 大搜查",
            "description": "和家人一起在家里找 AI",
            "steps": [
              "拿一张纸和一支笔",
              "在家里走一圈，每找到一个用到 AI 的东西就画下来",
              "数一数你一共找到了多少个",
              "和家人比一比，谁找得多"
            ]
          ,
            "resources": [{"icon": "🔍", "title": "AI 搜查清单模板", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>位置</b>客厅、卧室、厨房</div><div class=\"template-item\"><b>物品</b>扫地机器人、智能音箱</div><div class=\"template-item\"><b>APP</b>语音助手、拍照美颜</div><div class=\"template-item\"><b>发现</b>原来这个也是 AI</div></div>"}, {"icon": "📝", "title": "笔记模板：我的 AI 发现", "content": "<div class=\"note-lines\"><div class=\"note-line\">日期：____年____月____日</div><div class=\"note-line\">我找到了 ____ 个 AI 物品</div><div class=\"note-line\">最让我惊讶的是：________________</div><div class=\"note-line\">画一画你找到的 AI</div><div class=\"note-line\" style=\"min-height:3rem\"></div></div>"}]}
        },
        {
          "id": 2,
          "number": "02",
          "title": "AI 怎么“学会”的",
          "duration": "8-10分钟",
          "objective": "理解机器学习的基本逻辑：从大量例子中找到规律",
          "sections": [
            {
              "type": "text",
              "title": "人类学习 vs 机器学习",
              "content": "小朋友看几张猫的照片就能认出猫，但 AI 需要看几万张甚至几百万张。<br><br>不过本质是一样的：都是从大量例子中找到规律。"
            },
            {
              "type": "image",
              "title": "AI 怎么“学会”的",
              "content": "learning-process"
            },
            {
              "type": "analogy",
              "title": "比喻：教小朋友认动物",
              "content": "你给小朋友看 100 张猫的照片，告诉他“这是猫”。再看 100 张狗的照片，告诉他“这是狗”。慢慢他就学会了区分。<br><br>AI 也是这样。只不过它看的不是 100 张，而是几百万张。"
            },
            {
              "type": "highlight",
              "title": "三个关键步骤",
              "content": "<b>看数据</b> → AI 接收大量例子<br><b>找规律</b> → AI 分析例子中的共同特征<br><b>做判断</b> → AI 用找到的规律来识别新东西"
            },
            {
              "type": "text",
              "title": "核心概念",
              "content": "<b>训练数据</b>：用来教 AI 的材料<br><b>模型</b>：AI 学完之后的“脑子”<br><b>预测</b>：AI 看到新东西时做出的判断"
            },
            {
              "type": "image",
              "title": "机器学习流程",
              "content": "ml-workflow"
            },
            {
              "type": "image",
              "title": "监督学习与非监督学习",
              "content": "supervised-unsupervised"
            }
          ],
          "quiz": [
            {
              "question": "AI 学习的方式最像什么？",
              "options": [
                "背课文",
                "从大量例子中找规律",
                "查字典",
                "抄作业"
              ],
              "correct": 1,
              "explanation": "AI 的学习本质上是从大量数据中找到规律和模式，就像小朋友看很多猫的照片后学会认猫一样。"
            },
            {
              "question": "为什么 AI 认猫需要看几万张照片？",
              "options": [
                "AI 看得慢",
                "AI 不如人聪明",
                "AI 需要足够多的样本来找到规律",
                "这是规定"
              ],
              "correct": 2,
              "explanation": "AI 没有人类的直觉和经验，它需要大量的样本来统计和分析，才能找到“猫”的特征规律。"
            },
            {
              "question": "“训练数据”是什么？",
              "options": [
                "AI 的电源",
                "用来教 AI 的材料",
                "AI 做出的判断",
                "电脑的内存"
              ],
              "correct": 1,
              "explanation": "训练数据就是用来教 AI 的材料——大量的图片、文字、声音等，AI 通过学习这些数据来获得能力。"
            }
          ],
          "discussion": [
            "你觉得 AI 学习和人学习最大的不同是什么？",
            "如果只给 AI 看白猫的照片，它能认出黑猫吗？为什么？"
          ],
            "guides": ["AI 学习是看数据找规律，就像你做数学题找解题方法。但 AI 是靠大量数据练出来的，而人可以通过很少的例子就学会，还能举一反三。", "当然不能！AI 只见过白猫，它不知道世界上还有黑猫。这就像你只见过苹果，突然给你一个橘子，你可能认不出来。这就是为什么训练数据要多样。"],
          "activity": {
            "title": "我是小老师",
            "description": "教“AI”认动物",
            "steps": [
              "准备10张不同动物的图片",
              "你来扮演 AI，让家人当“小老师”教你看图认动物",
              "家人出示图片并告诉你动物名字",
              "过一会儿再出示图片，看你还记不记得",
              "讨论：AI 也是这样学习的，只是它需要看更多次"
            ]
          ,
            "resources": [{"icon": "🧠", "title": "AI 学习流程图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>1. 看数据</b>AI 接收大量例子</div><div class=\"template-item\"><b>2. 找规律</b>分析共同特征</div><div class=\"template-item\"><b>3. 做判断</b>用规律识别新东西</div><div class=\"template-item\"><b>4. 调整</b>做错了就调整参数</div></div>"}, {"icon": "📝", "title": "笔记模板：教 AI 认动物", "content": "<div class=\"note-lines\"><div class=\"note-line\">我教 AI 认的动物：________________</div><div class=\"note-line\">给 AI 看了 ____ 次</div><div class=\"note-line\">AI 第几次认对了？第 ____ 次</div><div class=\"note-line\">我的发现：________________</div></div>"}]}
        },
        {
          "id": 3,
          "number": "03",
          "title": "AI 的眼睛",
          "duration": "8-10分钟",
          "objective": "理解计算机视觉——AI 怎么“看”东西",
          "sections": [
            {
              "type": "text",
              "title": "AI 的“看”",
              "content": "AI 的“看”不是真的用眼睛，而是用数学。它把图片变成数字，通过分析数字来理解图片内容。"
            },
            {
              "type": "image",
              "title": "AI 的眼睛",
              "content": "ai-vision"
            },
            {
              "type": "analogy",
              "title": "比喻：照片变数字",
              "content": "想象一张照片被分成几百万个小格子（像素），每个格子有一个颜色编号。AI 就是通过分析这些编号的排列规律，来“理解”照片里有什么。<br><br>就像你看一幅画，远看是一片色块，走近了能看到每个笔触。"
            },
            {
              "type": "highlight",
              "title": "计算机视觉能做什么",
              "content": "• <b>认人脸</b>：手机相册自动按人脸分类<br>• <b>读文字</b>：拍照翻译、扫描文档<br>• <b>找物体</b>：自动驾驶识别行人和车辆<br>• <b>识表情</b>：判断人的心情<br>• <b>看片子</b>：帮医生分析X光片"
            },
            {
              "type": "case",
              "title": "案例：手机怎么认出你的脸",
              "content": "你有没有想过，手机怎么知道照片里是你？它不是“认出”你的脸，而是测量你五官之间的距离、角度、比例，把这些变成一串数字，然后和数据库里的数字做比较。如果数字足够接近，就认为是同一个人。"
            },
            {
              "type": "image",
              "title": "图像识别过程",
              "content": "image-recognition-process"
            },
            {
              "type": "image",
              "title": "卷积神经网络",
              "content": "cnn-layers"
            }
          ],
          "quiz": [
            {
              "question": "AI 是怎么“看”图片的？",
              "options": [
                "用摄像头当眼睛",
                "把图片变成数字来分析",
                "和人一样用眼睛看",
                "闻图片的味道"
              ],
              "correct": 1,
              "explanation": "AI 把图片转换成数字（像素值），然后通过数学分析来理解图片中的内容。"
            },
            {
              "question": "手机人脸识别解锁的原理是什么？",
              "options": [
                "手机认识你这个人",
                "测量五官特征变成数字来比对",
                "手机有记忆功能",
                "手机问了别人"
              ],
              "correct": 1,
              "explanation": "人脸识别是通过测量五官的距离、角度等特征，转换成数字数据，再和存储的数据进行比对。"
            },
            {
              "question": "以下哪个不是计算机视觉的应用？",
              "options": [
                "自动驾驶识别行人",
                "AI 帮医生看X光片",
                "AI 语音助手回答问题",
                "拍照翻译文字"
              ],
              "correct": 2,
              "explanation": "语音助手属于语音识别和自然语言处理，不是计算机视觉。计算机视觉是让机器“看”和理解图像的技术。"
            }
          ],
          "discussion": [
            "你觉得 AI 用数学“看”图片和人用眼睛看图片，有什么不同？",
            "计算机视觉还能用在哪些你想到的地方？"
          ],
            "guides": ["AI 看图片是把图片变成数字（像素值），然后用数学方法找规律。比如边缘、颜色、形状。人眼是看，AI 是算。虽然方式不同，但结果可以很接近。", "想想看：车牌识别、人脸支付、医学影像分析、自动驾驶看路标、拍照自动对焦……其实计算机视觉已经用在我们身边很多地方了！"],
          "activity": {
            "title": "AI 眼睛挑战",
            "description": "测试 AI 的图像识别能力",
            "steps": [
              "找几张不同的照片（家人、宠物、风景等）",
              "先自己猜：AI 能从这张照片里“看到”什么？",
              "用手机的图片识别功能试试（比如 Google 相册的搜索）",
              "对比你的猜测和 AI 的结果",
              "讨论：AI 猜对了什么，猜错了什么？为什么？"
            ]
          ,
            "resources": [{"icon": "👁️", "title": "计算机视觉应用图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>人脸识别</b>手机解锁、刷脸支付</div><div class=\"template-item\"><b>文字识别</b>拍照翻译、扫描文档</div><div class=\"template-item\"><b>物体识别</b>自动驾驶看路标</div><div class=\"template-item\"><b>医学影像</b>帮医生看 X 光片</div></div>"}, {"icon": "📝", "title": "笔记模板：AI 眼睛观察", "content": "<div class=\"note-lines\"><div class=\"note-line\">我给 AI 看的照片是：________________</div><div class=\"note-line\">AI 说照片里有：________________</div><div class=\"note-line\">AI 说对了吗？对/错</div><div class=\"note-line\">我觉得 AI 看得准不准？________________</div></div>"}]}
        },
        {
          "id": 4,
          "number": "04",
          "title": "AI 的耳朵",
          "duration": "8-10分钟",
          "objective": "理解语音识别——AI 怎么听懂人说话",
          "sections": [
            {
              "type": "text",
              "title": "声音怎么变成文字",
              "content": "声音是波。AI 把声波变成数字，然后把数字拆成小片段，和学过的发音做对比，猜出你说了什么字。"
            },
            {
              "type": "image",
              "title": "AI 的耳朵",
              "content": "ai-speech-recognition"
            },
            {
              "type": "analogy",
              "title": "比喻：听力考试",
              "content": "想象你在做英语听力考试。你听到一段声音，大脑会把它和你学过的单词做比较，然后猜出是什么意思。<br><br>AI 也是这样——它先“听过”无数人的声音，学会了各种发音，然后当你说话时，它把你的声音和学过的发音做比较。"
            },
            {
              "type": "highlight",
              "title": "AI 听不懂的时候",
              "content": "• <b>口音</b>：不同地方的人发音不同<br>• <b>噪音</b>：背景声音干扰<br>• <b>语速</b>：说得太快 AI 跟不上<br>• <b>专业术语</b>：没学过的词汇<br>• <b>情绪</b>：哭着说、笑着说、喊着说"
            },
            {
              "type": "text",
              "title": "语音识别的应用",
              "content": "• 语音助手（Siri、小爱同学、天猫精灵）<br>• 会议记录自动转文字<br>• 电话客服的语音导航<br>• 无障碍功能：帮视障人士“听”屏幕<br>• 视频自动字幕"
            },
            {
              "type": "image",
              "title": "语音到文字",
              "content": "speech-to-text-flow"
            },
            {
              "type": "image",
              "title": "语音识别应用",
              "content": "speech-apps"
            }
          ],
          "quiz": [
            {
              "question": "AI 是怎么把声音变成文字的？",
              "options": [
                "直接复制粘贴",
                "把声波变成数字，和学过的发音做对比",
                "问旁边的人",
                "猜的"
              ],
              "correct": 1,
              "explanation": "AI 先把声音信号转换成数字，然后拆成小片段，和训练时学过的发音模式做对比，找出最匹配的文字。"
            },
            {
              "question": "以下哪种情况 AI 最容易听不懂？",
              "options": [
                "标准普通话",
                "带方言口音的话",
                "新闻联播的播音",
                "字正腔圆的朗读"
              ],
              "correct": 1,
              "explanation": "AI 主要用普通话训练，方言发音和普通话差别大，所以 AI 更容易听不懂。"
            },
            {
              "question": "语音识别技术可以用来做什么？",
              "options": [
                "让手机自动充电",
                "帮视障人士“听”屏幕内容",
                "让手机变得更轻",
                "自动打扫房间"
              ],
              "correct": 1,
              "explanation": "语音识别可以把屏幕上的文字转换成语音，帮助视力不好的人“听”到手机上的内容，这是无障碍功能的重要应用。"
            }
          ],
          "discussion": [
            "你用过语音助手吗？什么时候它能听懂你，什么时候听不懂？",
            "如果你能教 AI 学一种方言，你想教什么？"
          ],
            "guides": ["语音助手有时候听不懂，可能是因为：你说的话有方言口音、周围太吵、它没学过你说的那个词、或者你说得太快太模糊。", "这是个好主意！中国有很多方言，比如粤语、四川话、上海话。如果 AI 能学会方言，老人们用手机就方便多了！现在已经有一些方言语音识别在开发中。"],
          "activity": {
            "title": "和 AI 对话",
            "description": "测试语音助手的能力",
            "steps": [
              "打开手机的语音助手",
              "用正常语速说一句话，看它能不能听懂",
              "用很快的语速说同一句话",
              "用小声说、大声说、带口音说",
              "记录：什么时候听得懂，什么时候听不懂",
              "讨论：为什么会这样？"
            ]
          ,
            "resources": [{"icon": "🎙️", "title": "语音识别流程图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>1. 声音输入</b>你对着麦克风说话</div><div class=\"template-item\"><b>2. 声波转数字</b>把声波变成数字信号</div><div class=\"template-item\"><b>3. 分析发音</b>拆成小片段对比</div><div class=\"template-item\"><b>4. 输出文字</b>猜出你说了什么</div></div>"}, {"icon": "📝", "title": "笔记模板：语音助手测试", "content": "<div class=\"note-lines\"><div class=\"note-line\">我测试的语音助手：________________</div><div class=\"note-line\">我说的话：________________</div><div class=\"note-line\">它听懂了吗？听懂/没听懂</div><div class=\"note-line\">没听懂的原因：________________</div></div>"}]}
        },
        {
          "id": 5,
          "number": "05",
          "title": "AI 的嘴巴",
          "duration": "8-10分钟",
          "objective": "理解语音合成和聊天机器人——AI 怎么“说话”",
          "sections": [
            {
              "type": "text",
              "title": "AI 怎么说话",
              "content": "语音合成：把文字变成声音，听起来像真人。<br><br>聊天机器人：不只是回答问题，而是在“生成”语言。它的秘密是——预测下一个最可能出现的词。"
            },
            {
              "type": "image",
              "title": "AI 的嘴巴",
              "content": "ai-speech-synthesis"
            },
            {
              "type": "analogy",
              "title": "比喻：文字接龙",
              "content": "你玩过文字接龙吗？你说“今天天气”，AI 就接“真好”。它学过无数篇文章，所以能接得很自然。<br><br>但它不是真的“知道”天气好不好，只是知道人们通常怎么说。这就是 AI 说话的本质——基于统计的预测。"
            },
            {
              "type": "highlight",
              "title": "AI 说话的应用",
              "content": "• <b>有声书</b>：AI 朗读电子书<br>• <b>短视频配音</b>：各种AI声音<br>• <b>客服机器人</b>：自动回复电话<br>• <b>AI 写作</b>：写文章、写故事<br>• <b>翻译</b>：实时语音翻译"
            },
            {
              "type": "text",
              "title": "大语言模型的魔法",
              "content": "ChatGPT、Kimi 这些工具背后是“大语言模型”。它们读了互联网上海量的文字，学会了语言的规律。<br><br>当你给它一个问题，它不是在“搜索”答案，而是一个字一个字地“生成”最可能的回答。"
            },
            {
              "type": "image",
              "title": "语音合成技术",
              "content": "tts-tech"
            },
            {
              "type": "image",
              "title": "AI配音应用场景",
              "content": "tts-scenarios"
            }
          ],
          "quiz": [
            {
              "question": "AI 说话的本质是什么？",
              "options": [
                "真的理解了意思",
                "基于统计预测下一个最可能的词",
                "从数据库里复制",
                "随便猜的"
              ],
              "correct": 1,
              "explanation": "AI 说话是基于大量文本学到的语言规律，预测下一个最可能出现的词。它并不真正“理解”含义。"
            },
            {
              "question": "为什么 AI 有时候说的话听起来很奇怪？",
              "options": [
                "AI 故意搞笑",
                "它预测的词不符合人类的说话习惯",
                "它不识字",
                "网络不好"
              ],
              "correct": 1,
              "explanation": "AI 有时候会生成不符合常理的组合，因为它只是在做概率预测，没有真正理解意思。"
            },
            {
              "question": "ChatGPT 回答问题时在做什么？",
              "options": [
                "从答案库里查找",
                "一个字一个字生成最可能的回答",
                "问其他AI",
                "复制网上的文章"
              ],
              "correct": 1,
              "explanation": "大语言模型是生成式的——它根据你的问题，一个字一个字地生成回答，而不是从数据库里查找现成的答案。"
            }
          ],
          "discussion": [
            "如果 AI 说的话和真人说的一模一样，你怎么分辨？",
            "你觉得 AI 写的故事和人写的有什么不同？"
          ],
            "guides": ["有几个小技巧：1.说清楚你要什么；2.给具体的例子；3.说明格式和风格；4.分步骤说。比如不要只说写个故事，而是说写一个300字的关于小狗的冒险故事，要有趣，适合小朋友读。", "提示词工程师确实是一个新职业！他们专门设计让 AI 听懂人类需求的指令。这个职业需要创造力、逻辑思维和对 AI 能力的理解。"],
          "activity": {
            "title": "AI 故事接龙",
            "description": "和 AI 一起编故事",
            "steps": [
              "打开一个 AI 对话工具（如 ChatGPT、Kimi）",
              "你先说一句话开头，比如“从前有一只猫”",
              "让 AI 接着说下一句",
              "你再说一句，AI 再接",
              "来回几次，看看故事会被带到哪里去",
              "讨论：AI 的“想象力”和人的有什么不同？"
            ]
          ,
            "resources": [{"icon": "💡", "title": "好提示词模板", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>角色</b>你是一个...</b></div><div class=\"template-item\"><b>任务</b>请帮我...</b></div><div class=\"template-item\"><b>要求</b>要...（长度、风格）</div><div class=\"template-item\"><b>例子</b>比如...</b></div></div>"}, {"icon": "📝", "title": "笔记模板：提示词实验", "content": "<div class=\"note-lines\"><div class=\"note-line\">我的任务：________________</div><div class=\"note-line\">第一次提示词：________________</div><div class=\"note-line\">AI 回答效果：________________</div><div class=\"note-line\">改进后的提示词：________________</div></div>"}]}
        },
        {
          "id": 6,
          "number": "06",
          "title": "AI 的记忆力",
          "duration": "10-12分钟",
          "objective": "理解大语言模型的基本原理和“涌现”现象",
          "sections": [
            {
              "type": "text",
              "title": "两种不同的“聪明”",
              "content": "传统程序：你告诉它每一步怎么做，它照做。<br>AI 大模型：你给它海量数据，它自己找出规律。<br><br>这就像图书馆和大脑的区别。"
            },
            {
              "type": "image",
              "title": "AI 的记忆力",
              "content": "ai-memory"
            },
            {
              "type": "analogy",
              "title": "比喻：图书馆 vs 大脑",
              "content": "传统程序像图书馆——你告诉它书放在哪，它帮你找。<br><br>大模型像大脑——它读了所有的书，然后用自己的方式理解这些知识。你问它问题，它不是去“翻书”，而是用自己“理解”的知识来回答。"
            },
            {
              "type": "highlight",
              "title": "什么是“涌现”",
              "content": "当模型大到一定程度，突然展现出你没教过它的能力。<br><br>就像水加热到100度突然沸腾——在到达临界点之前，看不出什么变化；一旦到了，质变就发生了。"
            },
            {
              "type": "text",
              "title": "AI 的“记忆”藏在哪里",
              "content": "AI 的知识不是存在硬盘里供查询的，而是“压缩”在参数里的。<br><br>GPT-3 有 1750 亿个参数，每个参数都存储着一些微小的知识碎片。当你问问题时，这些参数一起“工作”，生成回答。<br><br>这就是为什么 AI 有时会“忘记”或“记错”——它的记忆是压缩的，不是精确的。"
            },
            {
              "type": "image",
              "title": "注意力机制",
              "content": "attention-mechanism"
            },
            {
              "type": "image",
              "title": "上下文窗口",
              "content": "context-window"
            }
          ],
          "quiz": [
            {
              "question": "大模型和传统程序最大的区别是什么？",
              "options": [
                "大模型更新",
                "大模型能自己从数据中找规律",
                "大模型更大",
                "大模型更贵"
              ],
              "correct": 1,
              "explanation": "传统程序需要人写好每一步的规则，而大模型是通过海量数据自己学习规律，这是根本性的区别。"
            },
            {
              "question": "“涌现”是什么意思？",
              "options": [
                "AI 突然出现",
                "模型大到一定程度后突然展现出新能力",
                "AI 从水里冒出来",
                "一种新的编程语言"
              ],
              "correct": 1,
              "explanation": "涌现是指当模型规模大到一定程度时，突然展现出之前没有明确教过它的能力，就像水到100度突然沸腾一样。"
            },
            {
              "question": "AI 的知识存在哪里？",
              "options": [
                "硬盘里的文件夹",
                "压缩在模型的参数里",
                "互联网上",
                "U盘里"
              ],
              "correct": 1,
              "explanation": "AI 的知识是“压缩”存储在模型参数中的，不是像文件一样存放在硬盘里。所以 AI 有时会“记错”，因为它的记忆是压缩的、不精确的。"
            }
          ],
          "discussion": [
            "AI 的记忆和人的记忆有什么相同和不同？",
            "如果 AI 的知识是“压缩”的，你觉得这有什么好处和坏处？"
          ],
            "guides": ["AI 的记忆和人的记忆很不同：AI 的记忆存在硬盘里，可以永久保存，不会遗忘；人的记忆会模糊、会出错、会忘记。但人的记忆有情感，AI 的记忆只是数据。", "好处是：AI 可以记住海量知识，随时调用。坏处是：AI 不能像人一样理解和感受记忆，它只是存储和检索。而且如果存储的数据有问题，AI 也会记错。"],
          "activity": {
            "title": "AI 知识大考验",
            "description": "测试 AI 的“记忆”",
            "steps": [
              "问 AI 三个你知道答案的事实性问题",
              "问 AI 两个你不确定的问题",
              "问 AI 一个你怀疑它可能编造的问题",
              "自己验证 AI 的回答是否正确",
              "讨论：哪些回答可靠，哪些需要核实？为什么？"
            ]
          ,
            "resources": [{"icon": "🧠", "title": "AI 记忆 vs 人类记忆", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>AI 记忆</b>存在硬盘里、不会遗忘、没有情感</div><div class=\"template-item\"><b>人类记忆</b>存在大脑里、会模糊出错、有情感</div></div>"}, {"icon": "📝", "title": "笔记模板：记忆大对比", "content": "<div class=\"note-lines\"><div class=\"note-line\">我今天学到了：________________</div><div class=\"note-line\">AI 记忆最厉害的地方：________________</div><div class=\"note-line\">人类记忆最厉害的地方：________________</div></div>"}]}
        },
        {
          "id": 7,
          "number": "07",
          "title": "AI 会犯错吗",
          "duration": "8-10分钟",
          "objective": "理解 AI 的局限性：幻觉、偏见和错误",
          "sections": [
            {
              "type": "highlight",
              "title": "AI 会犯三种错",
              "content": "<b>幻觉</b>：AI 会一本正经地编造事实<br><b>偏见</b>：AI 的训练数据有偏见，AI 就会有偏见<br><b>错误</b>：AI 也会认错字、听错话、理解错意思"
            },
            {
              "type": "image",
              "title": "AI 会犯错吗",
              "content": "ai-errors"
            },
            {
              "type": "case",
              "title": "案例：AI 幻觉",
              "content": "你问 AI “世界上最高的山是什么？”它可能回答“珠穆朗玛峰”——这是对的。<br><br>但你问一个不存在的问题，比如“谁发明了时间机器？”，AI 可能编一个听起来很真的答案，甚至编出一个不存在的人名和年份。<br><br>这种“一本正经地胡说八道”就叫 AI 幻觉。"
            },
            {
              "type": "case",
              "title": "案例：AI 偏见",
              "content": "如果 AI 学的主要是英文资料，它对中国的事情可能不太了解。如果训练数据里男性照片多于女性，AI 认人脸时对女性可能不够准确。<br><br>数据决定 AI 的视野——数据有什么偏见，AI 就有什么偏见。"
            },
            {
              "type": "text",
              "title": "如何应对 AI 的错误",
              "content": "<b>验证</b>：AI 说的话需要人来核实<br><b>多源</b>：不要只听 AI 一个“人”的<br><b>批判</b>：保持思考，不盲目相信<br><b>反馈</b>：发现错误要告诉 AI，帮助它改进"
            },
            {
              "type": "image",
              "title": "幻觉产生原因",
              "content": "hallucination-cause"
            },
            {
              "type": "image",
              "title": "如何识别幻觉",
              "content": "detect-hallucination"
            }
          ],
          "quiz": [
            {
              "question": "什么是 AI “幻觉”？",
              "options": [
                "AI 做梦了",
                "AI 一本正经地编造事实",
                "AI 看到了幻象",
                "AI 的屏幕花了"
              ],
              "correct": 1,
              "explanation": "AI 幻觉是指 AI 生成了看似合理但实际上不正确或完全虚构的内容，而且它自己并不知道这是错的。"
            },
            {
              "question": "AI 为什么会有偏见？",
              "options": [
                "AI 自己有偏见",
                "训练数据有偏见",
                "电脑有偏见",
                "网络有偏见"
              ],
              "correct": 1,
              "explanation": "AI 的偏见来自训练数据。如果数据不全面或有偏向性，AI 学到的也会有偏见。"
            },
            {
              "question": "发现 AI 给了错误答案，你应该怎么做？",
              "options": [
                "相信 AI 是对的",
                "去其他来源验证一下",
                "骂 AI 一顿",
                "不用 AI 了"
              ],
              "correct": 1,
              "explanation": "AI 会犯错，所以需要通过其他可靠来源来验证。保持批判性思维，不盲目相信 AI。"
            }
          ],
          "discussion": [
            "你有没有被 AI “骗”过？它说了什么不正确的话？",
            "你觉得 AI 幻觉和人类说谎有什么区别？"
          ],
            "guides": ["有几个识别技巧：1.查时间——AI 可能编造最近的事实；2.查细节——AI 常常编造具体数字、人名、日期；3.查逻辑——看回答前后是否矛盾；4.查来源——AI 说的话不一定有可靠出处。", "说谎是明知不对还故意说，AI 幻觉是以为是对的就说出来。AI 不知道自己在编造，它只是根据概率生成最可能的文字。这就像你做梦时说的梦话，自己不知道在说什么。"],
          "activity": {
            "title": "真假大挑战",
            "description": "测试 AI 的可靠性",
            "steps": [
              "准备3个问题：一个你知道答案的，一个你不确定的，一个你怀疑 AI 会编的",
              "把这三个问题都问 AI",
              "自己验证每个回答的准确性",
              "记录：答对了几个，答错了几个",
              "讨论：AI 在什么情况下更容易出错？"
            ]
          ,
            "resources": [{"icon": "🕵️", "title": "识别 AI 幻觉小技巧", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>1. 查时间</b>AI 可能编造最近的事实</div><div class=\"template-item\"><b>2. 查细节</b>AI 常编造数字、人名</div><div class=\"template-item\"><b>3. 查逻辑</b>看前后是否矛盾</div><div class=\"template-item\"><b>4. 查来源</b>AI 的话不一定可靠</div></div>"}, {"icon": "📝", "title": "笔记模板：真假大挑战", "content": "<div class=\"note-lines\"><div class=\"note-line\">我问 AI 的问题：________________</div><div class=\"note-line\">AI 的回答：________________</div><div class=\"note-line\">我验证后发现：真的/假的/部分对</div><div class=\"note-line\">我的判断技巧：________________</div></div>"}]}
        },
        {
          "id": 8,
          "number": "08",
          "title": "AI 的好与坏",
          "duration": "10-15分钟",
          "objective": "培养批判性思维，理解 AI 是双刃剑",
          "sections": [
            {
              "type": "highlight",
              "title": "AI 的好处",
              "content": "• 帮助医生更准确地看病<br>• 让学习更个性化<br>• 自动化重复劳动，解放人力<br>• 帮助解决气候变化、疾病等大问题<br>• 让信息获取更容易"
            },
            {
              "type": "image",
              "title": "AI 的好与坏",
              "content": "ai-ethics"
            },
            {
              "type": "highlight",
              "title": "AI 的风险",
              "content": "• <b>隐私泄露</b>：AI 知道你太多<br>• <b>工作替代</b>：有些工作可能会消失<br>• <b>信息真假难辨</b>：深度伪造<br>• <b>过度依赖</b>：如果 AI 出错怎么办？<br>• <b>不平等</b>：有 AI 的人和没有的人差距拉大"
            },
            {
              "type": "text",
              "title": "关键认知",
              "content": "技术本身没有好坏，关键是谁在用、怎么用。<br><br>就像一把刀：厨师用它做美食，坏人用它伤人。刀没有错，错的是用它的方式。<br><br>AI 也是一样——重要的是我们选择怎么使用它。"
            },
            {
              "type": "text",
              "title": "你能做什么",
              "content": "• 保持学习，了解 AI 的能力边界<br>• 保护个人隐私，谨慎分享数据<br>• 用 AI 做有价值的事，而不是偷懒<br>• 关注 AI 伦理，参与公共讨论<br>• 培养 AI 替代不了的能力：创造力、同理心、批判性思维"
            },
            {
              "type": "image",
              "title": "AI偏见来源",
              "content": "ai-bias-source"
            },
            {
              "type": "image",
              "title": "负责任的AI",
              "content": "responsible-ai"
            }
          ],
          "quiz": [
            {
              "question": "关于 AI，以下哪个说法最准确？",
              "options": [
                "AI 完全是好的",
                "AI 完全是坏的",
                "AI 是双刃剑，关键看怎么用",
                "AI 跟我没关系"
              ],
              "correct": 2,
              "explanation": "AI 既有好处也有风险，就像一把双刃剑。关键在于我们选择怎么使用它，以及建立什么规则来约束它。"
            },
            {
              "question": "以下哪个是 AI 带来的真正风险？",
              "options": [
                "AI 太贵了",
                "深度伪造导致真假难辨",
                "AI 太重了",
                "AI 颜色不好看"
              ],
              "correct": 1,
              "explanation": "深度伪造是 AI 带来的真实风险——它可以生成逼真的假视频、假音频，让人难以分辨真假。"
            },
            {
              "question": "面对 AI，最重要的态度是什么？",
              "options": [
                "完全拒绝",
                "完全依赖",
                "保持学习和批判性思考",
                "不关心"
              ],
              "correct": 2,
              "explanation": "最好的态度是保持学习和批判性思考——了解 AI 的能力，也知道它的局限，用它而不依赖它。"
            }
          ],
          "discussion": [
            "如果 AI 能帮你写作业，你觉得好不好？为什么？",
            "如果你的老师是 AI，你喜欢吗？和真人老师有什么不同？"
          ],
            "guides": ["AI 帮我们做重复、危险、枯燥的工作，让人类有时间做更有创意的事。但挑战也很明显：某些工作会被替代，需要学新技能；隐私可能被泄露；AI 的决策可能有偏见。", "比如：自动驾驶可能出事故谁负责？AI 给出错误的医疗建议怎么办？AI 学习的数据如果有偏见，会不会歧视某些人？这些都是现在社会在讨论的伦理问题。"],
          "activity": {
            "title": "AI 辩论赛",
            "description": "就 AI 话题展开辩论",
            "steps": [
              "选一个辩题，比如“AI 做作业是好事”",
              "分成正方和反方",
              "每方想3个论点",
              "进行5分钟的辩论",
              "讨论：谁的论点更有说服力？为什么？"
            ]
          ,
            "resources": [{"icon": "⚖️", "title": "AI 好与坏对比图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>好处</b>代替重复工作、帮人类做更聪明的事</div><div class=\"template-item\"><b>挑战</b>某些工作被替代、隐私可能泄露</div></div>"}, {"icon": "📝", "title": "笔记模板：AI 辩论赛", "content": "<div class=\"note-lines\"><div class=\"note-line\">辩题：AI 帮你写作业是好事吗？</div><div class=\"note-line\">正方观点（支持）：________________</div><div class=\"note-line\">反方观点（反对）：________________</div><div class=\"note-line\">我的立场：________________</div></div>"}]}
        },
        {
          "id": 9,
          "number": "09",
          "title": "AI 的前世今生",
          "duration": "10-12分钟",
          "objective": "建立 AI 发展的时间线，理解技术演进的规律",
          "sections": [
            {
              "type": "table",
              "title": "AI 发展时间线",
              "content": [
                [
                  "年代",
                  "事件",
                  "意义"
                ],
                [
                  "1950",
                  "图灵提出“机器能思考吗？”",
                  "AI 的起点"
                ],
                [
                  "1956",
                  "达特茅斯会议",
                  "“人工智能”正式命名"
                ],
                [
                  "1960-70s",
                  "AI 第一个冬天",
                  "技术不成熟，资金撤退"
                ],
                [
                  "1980-90s",
                  "专家系统兴起又衰落",
                  "规则驱动的 AI 有局限"
                ],
                [
                  "2012",
                  "深度学习突破",
                  "神经网络改变一切"
                ],
                [
                  "2016",
                  "AlphaGo 击败李世石",
                  "AI 进入公众视野"
                ],
                [
                  "2022",
                  "ChatGPT 发布",
                  "AI 进入每个人的生活"
                ]
              ]
            },
            {
              "type": "image",
              "title": "AI 的前世今生",
              "content": "ai-history"
            },
            {
              "type": "text",
              "title": "图灵的传奇",
              "content": "1950年，英国数学家艾伦·图灵问了一个问题：“机器能思考吗？”<br><br>这个问题开启了 AI 的时代。图灵还是二战中破解德国密码的英雄，可惜他的人生以悲剧告终。"
            },
            {
              "type": "text",
              "title": "AI 为什么经历过寒冬",
              "content": "1960-70年代，人们对 AI 期望太高，但计算机太慢、内存太小，什么都做不了。<br><br>就像你第一次骑自行车，期望自己能立刻骑10公里，结果摔了一跤就放弃了。<br><br>但真正热爱的人没有放弃，他们在寒冬中坚持研究。"
            },
            {
              "type": "highlight",
              "title": "深度学习的崛起",
              "content": "2012年，深度学习在图像识别比赛中大获全胜，证明了这条路是对的。<br><br>2016年，AlphaGo 击败围棋世界冠军李世石。<br><br>2022年，ChatGPT 发布，两个月用户破亿。<br><br>AI 终于从实验室走进了每个人的生活。"
            },
            {
              "type": "image",
              "title": "AI发展里程碑",
              "content": "ai-milestones"
            },
            {
              "type": "image",
              "title": "三次AI浪潮",
              "content": "ai-three-waves"
            }
          ],
          "quiz": [
            {
              "question": "AI 这个概念最早是什么时候提出的？",
              "options": [
                "2000年",
                "1980年",
                "1950年",
                "2020年"
              ],
              "correct": 2,
              "explanation": "1950年，图灵发表了著名论文《计算机器与智能》，提出了“机器能思考吗？”这个问题，标志着 AI 概念的诞生。"
            },
            {
              "question": "AI 经历过“寒冬”是因为什么？",
              "options": [
                "天气太冷",
                "期望太高但技术跟不上",
                "没有人感兴趣",
                "AI 太聪明了"
              ],
              "correct": 1,
              "explanation": "AI 寒冬是因为人们对 AI 的期望远超当时的技术能力，导致资金和兴趣减退。"
            },
            {
              "question": "ChatGPT 是哪一年发布的？",
              "options": [
                "2016年",
                "2020年",
                "2022年",
                "2024年"
              ],
              "correct": 2,
              "explanation": "ChatGPT 于2022年11月发布，两个月内用户就突破了一亿，成为历史上增长最快的应用之一。"
            }
          ],
          "discussion": [
            "技术的发展有起有落，这像不像你学骑自行车或学弹琴的过程？",
            "如果你在 AI 寒冬那个年代做研究，你会放弃吗？为什么？"
          ],
            "guides": ["AI 发展就像坐过山车：有高峰（技术突破时大家很兴奋），也有低谷（发现技术不够用时大家很失望）。但每次低谷之后，技术都会变得更强。", "放弃很容易，但坚持下去可能会改变世界。很多伟大的发明都是在别人不看好时诞生的。比如互联网刚出来时很多人觉得没用，现在呢？"],
          "activity": {
            "title": "AI 时间线绘制",
            "description": "画出 AI 发展的历史",
            "steps": [
              "在一张长纸上画一条横线",
              "在横线上标注 AI 发展的关键年份和事件",
              "用不同颜色标注“上升期”和“寒冬期”",
              "在旁边写上你的感想",
              "讨论：技术的发展有什么规律？"
            ]
          ,
            "resources": [{"icon": "📈", "title": "AI 发展时间线模板", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>1950s</b>AI 概念诞生</div><div class=\"template-item\"><b>1960-70s</b>第一次高峰</div><div class=\"template-item\"><b>1980-90s</b>AI 寒冬期</div><div class=\"template-item\"><b>2010s</b>深度学习突破</div></div>"}, {"icon": "📝", "title": "笔记模板：AI 时间线", "content": "<div class=\"note-lines\"><div class=\"note-line\">画一条时间线：（在下面画）</div><div class=\"note-line\" style=\"min-height:2rem\"></div><div class=\"note-line\">最重要的事件：________________</div></div>"}]}
        },
        {
          "id": 10,
          "number": "10",
          "title": "你和 AI 的关系",
          "duration": "10-12分钟",
          "objective": "建立学习目标和期待，从“了解 AI”过渡到“使用 AI”",
          "sections": [
            {
              "type": "text",
              "title": "回顾与展望",
              "content": "恭喜你完成了模块一！在这10集里，你了解了：<br><br>• AI 是什么，它在哪里<br>• AI 怎么学习、怎么看、怎么听、怎么说<br>• AI 的记忆力和局限性<br>• AI 的历史和未来<br>• AI 的好处和风险"
            },
            {
              "type": "image",
              "title": "你和 AI 的关系",
              "content": "human-ai"
            },
            {
              "type": "highlight",
              "title": "你和 AI 的关系",
              "content": "你不是 AI 的奴隶，也不是 AI 的主人。<br><br>你是 AI 的<b>使用者</b>和<b>创造者</b>。<br><br>学会和 AI 合作，它就能帮你做到以前做不到的事。"
            },
            {
              "type": "text",
              "title": "接下来要做什么",
              "content": "在接下来的课程里，你将：<br><br>• 深入理解 AI 的核心概念（模块二）<br>• 听 AI 领域的传奇故事（模块三）<br>• 看 AI 在各行业的应用（模块四）<br>• 认识用 AI 做事的同龄人（模块五）<br>• 动手做一个自己的 AI 项目（模块六）"
            },
            {
              "type": "text",
              "title": "学习建议",
              "content": "• <b>保持好奇</b>：不懂就问，问 AI、问家长、问老师<br>• <b>动手尝试</b>：看100遍不如做1遍<br>• <b>不怕犯错</b>：错误是最好的老师<br>• <b>学会分享</b>：把学到的教给别人"
            },
            {
              "type": "image",
              "title": "AI助手与人类",
              "content": "ai-assistant-human"
            },
            {
              "type": "image",
              "title": "学会使用AI",
              "content": "learn-to-use-ai"
            }
          ],
          "quiz": [
            {
              "question": "你和 AI 的关系应该是？",
              "options": [
                "完全依赖 AI",
                "完全拒绝 AI",
                "学会和 AI 合作",
                "和 AI 竞争"
              ],
              "correct": 2,
              "explanation": "最好的关系是合作——学会利用 AI 的能力来帮助你做到更多事情，同时保持自己的判断力。"
            },
            {
              "question": "接下来的课程中，最重要的是什么？",
              "options": [
                "背诵所有知识点",
                "动手尝试和实践",
                "只看不练",
                "只学不用"
              ],
              "correct": 1,
              "explanation": "实践是最好的学习方式。看100遍不如做1遍，动手尝试才能真正理解和掌握。"
            },
            {
              "question": "遇到不懂的问题，最好的做法是？",
              "options": [
                "假装懂了",
                "放弃不学",
                "问 AI、问家长、问老师",
                "抄别人的答案"
              ],
              "correct": 2,
              "explanation": "保持好奇心，遇到不懂的就问。AI、家长、老师都是很好的学习资源。"
            }
          ],
          "discussion": [
            "回顾这10集，你学到了什么最让你惊讶的事情？",
            "你想用 AI 做什么？写下你的“AI 学习宣言”"
          ],
            "guides": ["回顾这10集，你可能会惊讶于：AI 居然会编故事（幻觉）、AI 需要那么多数据来学习、AI 和人脑的工作方式完全不同、AI 已经渗透到生活的方方面面……", "这是一个很棒的思考！你可以写下来：我想用 AI 做什么，但不想用 AI 做什么。比如：我想用 AI 帮我查资料，但不想用 AI 帮我写作业。"],
          "activity": {
            "title": "我的 AI 学习宣言",
            "description": "写下你和 AI 的约定",
            "steps": [
              "拿出一张纸和笔",
              "写下你想用 AI 做什么（至少3件事）",
              "写下你不想用 AI 做什么（至少1件事）",
              "写下你接下来最想学习的 AI 知识",
              "把这张纸贴在书桌上，提醒自己"
            ]
          ,
            "resources": [{"icon": "🎯", "title": "我的 AI 宣言模板", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>我想用 AI 做</b>1.________ 2.________</div><div class=\"template-item\"><b>我不想用 AI 做</b>1.________ 2.________</div></div>"}, {"icon": "📝", "title": "笔记模板：学习总结", "content": "<div class=\"note-lines\"><div class=\"note-line\">这10集我学到了：________________</div><div class=\"note-line\">最让我惊讶的是：________________</div><div class=\"note-line\">我最想探索的是：________________</div></div>"}]}
        }
      ]
    },
    {
      "id": 2,
      "title": "核心概念与底层理解",
      "description": "用简单例子讲清楚 AI 背后的关键原理，为动手实践打基础。",
      "color": "#f59e0b",
      "icon": "🧠",
      "episodes": [
        {
          "id": 11,
          "number": "11",
          "title": "数据是什么",
          "duration": "8-10分钟",
          "objective": "理解训练数据的重要性——AI 的“食物”",
          "sections": [
            {
              "type": "text",
              "title": "数据就是信息",
              "content": "文字、图片、声音、视频，都是数据。<br><br>AI 的学习靠数据——数据的质量决定了 AI 的能力。就像做饭，食材新鲜、种类丰富，菜就好吃。"
            },
            {
              "type": "image",
              "title": "数据是什么",
              "content": "data-types"
            },
            {
              "type": "analogy",
              "title": "比喻：做饭的食材",
              "content": "你做一道菜，食材新鲜、种类丰富，菜就好吃。如果食材不新鲜、只有一种，菜就难吃。<br><br>AI 也一样——数据就是它的食材。好数据训练出好 AI，坏数据训练出坏 AI。"
            },
            {
              "type": "case",
              "title": "案例：AI 学认猫的数据问题",
              "content": "假设你用100万张猫的照片来训练 AI 认猫。但如果照片里全是白猫，AI 可能认不出黑猫。<br><br>如果照片都是室内拍的，AI 可能认不出外面的猫。<br><br>如果照片里只有成年猫，AI 可能认不出小猫。<br><br>所以，数据要<b>多样</b>，AI 才能处理各种情况。"
            },
            {
              "type": "highlight",
              "title": "好数据的三个特征",
              "content": "<b>准确性</b>：数据是对的，不是乱标的<br><b>多样性</b>：覆盖各种情况和场景<br><b>代表性</b>：能代表真实世界的复杂性"
            },
            {
              "type": "image",
              "title": "数据质量",
              "content": "data-quality"
            },
            {
              "type": "image",
              "title": "数据标注",
              "content": "data-labeling"
            }
          ],
          "quiz": [
            {
              "question": "AI 的数据就像什么？",
              "options": [
                "AI 的衣服",
                "AI 的食物",
                "AI 的玩具",
                "AI 的家"
              ],
              "correct": 1,
              "explanation": "数据是 AI 学习的“食物”——AI 需要大量高质量的数据来“喂养”自己，才能变得聪明。"
            },
            {
              "question": "为什么数据的多样性很重要？",
              "options": [
                "数据越多越好看",
                "覆盖各种情况才能处理真实世界的问题",
                "多样数据更贵",
                "这是规定"
              ],
              "correct": 1,
              "explanation": "真实世界是复杂的，只有用多样的数据训练，AI 才能应对各种不同的情况。"
            },
            {
              "question": "以下哪种情况会导致 AI 认猫出错？",
              "options": [
                "数据里有各种猫的照片",
                "数据里只有白猫的照片",
                "数据量很大",
                "数据来自不同国家"
              ],
              "correct": 1,
              "explanation": "如果训练数据只包含白猫，AI 可能无法正确识别黑猫或花猫，因为它的学习样本不够多样。"
            }
          ],
          "discussion": [
            "如果让你收集“猫”的数据，你会收集什么样的照片？",
            "数据越多越好吗？有没有例外？"
          ],
            "guides": ["收集猫的数据时，要包括：不同品种（橘猫、黑猫、白猫）、不同姿势（趴着、跳着、睡觉）、不同环境（室内、室外、白天、晚上）、不同年龄（小猫、成年猫）。", "数据不是越多越好！如果数据质量差（比如标注错误、重复、无关），反而会教坏 AI。就像你做100道错题，不如认真做10道对的题。质量比数量重要。"],
          "activity": {
            "title": "数据收集员",
            "description": "收集一份小数据集",
            "steps": [
              "选一个主题，比如“我家附近的树”",
              "拍20张不同树的照片",
              "记录每棵树的信息：名字、位置、高度",
              "整理成一份数据表",
              "这就是一份小型数据集！"
            ]
          ,
            "resources": [{"icon": "📊", "title": "数据三要素图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>准确性</b>数据是对的</div><div class=\"template-item\"><b>多样性</b>覆盖各种情况</div><div class=\"template-item\"><b>代表性</b>能代表真实世界</div></div>"}, {"icon": "📝", "title": "笔记模板：数据收集员", "content": "<div class=\"note-lines\"><div class=\"note-line\">我收集的主题：________________</div><div class=\"note-line\">我收集了 ____ 条数据</div><div class=\"note-line\">我的数据够多样吗？够/不够</div></div>"}]}
        },
        {
          "id": 12,
          "number": "12",
          "title": "算法是什么",
          "duration": "8-10分钟",
          "objective": "理解算法——解决问题的“菜谱”",
          "sections": [
            {
              "type": "text",
              "title": "算法就是步骤",
              "content": "算法就是解决问题的步骤。同一个问题可以有不同算法，有的快、有的慢、有的准。<br><br>AI 的算法就是让机器从数据中学习的方法。"
            },
            {
              "type": "image",
              "title": "算法是什么",
              "content": "algorithm"
            },
            {
              "type": "analogy",
              "title": "比喻：做菜的菜谱",
              "content": "菜谱就是算法。你告诉机器“先切菜，再热油，然后炒”，它就按步骤做。<br><br>不同的菜谱（算法）做出来的菜（结果）不一样。好的算法就像好的菜谱——又快又好吃。"
            },
            {
              "type": "text",
              "title": "排序算法的例子",
              "content": "怎么把一列数字从小到大排？<br><br>• <b>冒泡排序</b>：一个一个比，挨个换位——简单但慢<br>• <b>归并排序</b>：分成两半，各排好再合并——聪明但复杂<br><br>AI 用的算法更复杂，但本质都是“找到最优解”。"
            },
            {
              "type": "highlight",
              "title": "算法的关键指标",
              "content": "<b>效率</b>：用最少的步骤完成任务<br><b>准确性</b>：找到最好的答案<br><b>可扩展性</b>：数据量变大时还能用"
            },
            {
              "type": "image",
              "title": "排序算法演示",
              "content": "sorting-algo"
            },
            {
              "type": "image",
              "title": "搜索算法",
              "content": "search-algo"
            }
          ],
          "quiz": [
            {
              "question": "算法是什么？",
              "options": [
                "一种食物",
                "解决问题的步骤",
                "一种程序",
                "一种游戏"
              ],
              "correct": 1,
              "explanation": "算法就是解决问题的步骤和方法，就像做菜的菜谱一样，告诉你先做什么、后做什么。"
            },
            {
              "question": "为什么同一个问题可以有不同算法？",
              "options": [
                "因为程序员水平不同",
                "因为可以用不同的方法和思路来解决",
                "因为计算机不同",
                "因为时间不同"
              ],
              "correct": 1,
              "explanation": "同一个问题可以有多种解决方法，不同的算法就像不同的路线，都能到达目的地，但效率和效果可能不同。"
            },
            {
              "question": "好的算法应该具备什么特点？",
              "options": [
                "步骤越多越好",
                "又快又准确",
                "越复杂越好",
                "和别人一样"
              ],
              "correct": 1,
              "explanation": "好的算法应该既高效（步骤少、速度快）又准确（找到最优解），而不是单纯追求复杂。"
            }
          ],
          "discussion": [
            "你能想到几种方法把10个苹果从大到小排列？哪种最好？",
            "你觉得写算法和写作文有什么相似之处？"
          ],
            "guides": ["排列方法有很多：一个一个比（冒泡排序）、分成两半再合（归并排序）、找一个基准分组（快速排序）……最聪明的方法是根据情况选。", "写算法和写作文都要：1.有清晰的步骤；2.逻辑要通顺；3.要考虑特殊情况；4.要让别人能看懂。不同的是，算法要求每一步都精确无误。"],
          "activity": {
            "title": "排队游戏",
            "description": "用不同方法排序",
            "steps": [
              "准备10张写有数字的扑克牌",
              "用方法1：一个一个比，挨个换位（冒泡排序）",
              "记录用了多少步",
              "用方法2：分成两半，各排好再合并（归并排序）",
              "记录用了多少步",
              "比较两种方法，哪种更高效？"
            ]
          ,
            "resources": [{"icon": "🔢", "title": "排序方法对比", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>冒泡排序</b>一个一个比，简单但慢</div><div class=\"template-item\"><b>快速排序</b>找基准分组，快但复杂</div></div>"}, {"icon": "📝", "title": "笔记模板：排序挑战", "content": "<div class=\"note-lines\"><div class=\"note-line\">我用的排序方法：________________</div><div class=\"note-line\">排了 ____ 次才排好</div><div class=\"note-line\">最难的一步：________________</div></div>"}]}
        },
        {
          "id": 13,
          "number": "13",
          "title": "神经网络是什么",
          "duration": "10-12分钟",
          "objective": "理解神经网络——AI 的“大脑结构”",
          "sections": [
            {
              "type": "text",
              "title": "模仿大脑的结构",
              "content": "人脑有神经元，通过电信号互相连接。神经网络模仿这个结构：很多“节点”互相连接。<br><br>每个节点做简单的计算，连在一起就能做复杂的事。"
            },
            {
              "type": "image",
              "title": "神经网络是什么",
              "content": "neural-network"
            },
            {
              "type": "analogy",
              "title": "比喻：流水线工厂",
              "content": "想象一个工厂，每个工人只做一件简单的事：有人负责剪线头，有人负责缝扣子，有人负责熨烫。<br><br>单独看每个人都很简单，但连在一起就能做出一件衣服。<br><br>神经网络也一样——每个节点只做简单的计算，但连在一起就能识别图片、听懂语音。"
            },
            {
              "type": "text",
              "title": "三层结构",
              "content": "• <b>输入层</b>：接收信息（比如一张图片的像素）<br>• <b>隐藏层</b>：处理信息（找规律）<br>• <b>输出层</b>：给出结果（“这是一只猫”）<br><br>隐藏层越多，AI 能处理的问题越复杂。"
            },
            {
              "type": "highlight",
              "title": "神经网络的核心思想",
              "content": "• 简单的单元组合起来能做复杂的事<br>• 每个单元只需要做好自己的小任务<br>• 通过调整连接的“强度”来学习<br>• 层次越多，能处理的问题越复杂"
            },
            {
              "type": "image",
              "title": "深度学习层级",
              "content": "deep-learning-layers"
            },
            {
              "type": "image",
              "title": "激活函数",
              "content": "activation-function"
            }
          ],
          "quiz": [
            {
              "question": "神经网络模仿的是什么？",
              "options": [
                "电脑的结构",
                "人脑的神经元结构",
                "互联网的结构",
                "工厂的流水线"
              ],
              "correct": 1,
              "explanation": "神经网络模仿人脑中神经元的连接方式——很多简单的单元互相连接，组合起来就能做复杂的事。"
            },
            {
              "question": "神经网络中，哪个层负责“做出最终判断”？",
              "options": [
                "输入层",
                "隐藏层",
                "输出层",
                "所有层一样"
              ],
              "correct": 2,
              "explanation": "输出层负责给出最终结果。输入层接收信息，隐藏层处理信息，输出层做出判断。"
            },
            {
              "question": "为什么说“简单的单元组合起来能做复杂的事”？",
              "options": [
                "因为单元数量多",
                "因为每个单元做好自己的事，组合起来就能完成复杂任务",
                "因为计算机很快",
                "因为有电"
              ],
              "correct": 1,
              "explanation": "就像工厂流水线，每个人只做简单的事，但组合起来就能造出复杂的产品。神经网络也是如此。"
            }
          ],
          "discussion": [
            "你觉得人脑和电脑的神经网络最大的区别是什么？",
            "如果每个工人（节点）都做同一件事，工厂还能运转吗？"
          ],
            "guides": ["最大的区别是：人脑有情感、有创造力、能处理模糊信息；电脑神经网络只是数学运算，没有理解。人脑的神经元是生物细胞，电脑的是数字节点。", "如果每个工人做同一件事，工厂只能生产一种产品，而且如果这个环节出错，整个生产线就坏了。所以神经网络需要不同的节点做不同的事，就像工厂需要不同的工种配合。"],
          "activity": {
            "title": "人体神经网络",
            "description": "用身体模拟神经网络",
            "steps": [
              "找5-6个家人或朋友站成一排",
              "第一个人是“输入层”，收到一个词语",
              "传给中间的人（隐藏层），每人加一个字或改一个字",
              "最后传给“输出层”（最后一个人）",
              "看看一句话经过“神经网络”后变成了什么",
              "讨论：这个过程和 AI 神经网络有什么相似之处？"
            ]
          ,
            "resources": [{"icon": "🧠", "title": "神经网络结构图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>输入层</b>接收信息</div><div class=\"template-item\"><b>隐藏层</b>处理信息</div><div class=\"template-item\"><b>输出层</b>给出结果</div></div>"}, {"icon": "📝", "title": "笔记模板：人体神经网络", "content": "<div class=\"note-lines\"><div class=\"note-line\">我扮演的层：输入层/隐藏层/输出层</div><div class=\"note-line\">我收到的信息：________________</div><div class=\"note-line\">我的发现：________________</div></div>"}]}
        },
        {
          "id": 14,
          "number": "14",
          "title": "模型是怎么训练的",
          "duration": "10-12分钟",
          "objective": "理解模型训练的过程——从错误中学习",
          "sections": [
            {
              "type": "text",
              "title": "训练的本质",
              "content": "训练 = 反复试错 + 调整<br><br>AI 先猜一个答案，看对不对，不对就调整参数。这个过程重复几百万次，直到猜得足够准。"
            },
            {
              "type": "image",
              "title": "模型是怎么训练的",
              "content": "model-training"
            },
            {
              "type": "analogy",
              "title": "比喻：学骑自行车",
              "content": "你刚学骑自行车时，会东倒西歪。每次摔倒，你都会调整：这次往左歪了，下次往右一点。<br><br>摔了几十次后，你终于学会了。<br><br>AI 训练也是这样——每次猜错，就调整参数（就像调整身体平衡），直到猜对为止。"
            },
            {
              "type": "table",
              "title": "训练五步法",
              "content": [
                [
                  "步骤",
                  "做什么",
                  "比喻"
                ],
                [
                  "1. 初始化",
                  "随便猜一个答案",
                  "刚上自行车，完全不会"
                ],
                [
                  "2. 前向传播",
                  "用当前参数算出答案",
                  "尝试骑一段"
                ],
                [
                  "3. 计算损失",
                  "看答案差多远",
                  "摔倒了，差得远"
                ],
                [
                  "4. 反向传播",
                  "调整参数",
                  "调整身体平衡"
                ],
                [
                  "5. 重复",
                  "重复几百万次",
                  "练了几百次终于会了"
                ]
              ]
            },
            {
              "type": "highlight",
              "title": "三个关键概念",
              "content": "<b>损失函数</b>：衡量“猜得有多差”的尺子<br><b>梯度下降</b>：调整参数的方向——往“猜得更准”的方向调<br><b>学习率</b>：每次调整的幅度——太大容易过头，太小学得太慢"
            },
            {
              "type": "image",
              "title": "损失函数",
              "content": "loss-function"
            },
            {
              "type": "image",
              "title": "梯度下降",
              "content": "gradient-descent"
            }
          ],
          "quiz": [
            {
              "question": "AI 训练的过程最像什么？",
              "options": [
                "背课文",
                "学骑自行车——反复试错和调整",
                "查字典",
                "看电视"
              ],
              "correct": 1,
              "explanation": "AI 训练就是反复试错和调整的过程，就像学骑自行车——每次摔倒后调整，直到成功。"
            },
            {
              "question": "“损失函数”的作用是什么？",
              "options": [
                "让 AI 更快",
                "衡量 AI 猜得有多差",
                "存储数据",
                "显示结果"
              ],
              "correct": 1,
              "explanation": "损失函数是衡量 AI 猜测与正确答案之间差距的指标——差距越大，说明猜得越差，需要更多调整。"
            },
            {
              "question": "为什么 AI 需要训练几百万次？",
              "options": [
                "AI 记性不好",
                "每次只能调整一点点，需要多次才能调准",
                "电脑太慢了",
                "这是规定"
              ],
              "correct": 1,
              "explanation": "每次训练 AI 只能微调一点点参数，就像每次只能调整一点点平衡。需要很多次微调才能达到准确的状态。"
            }
          ],
          "discussion": [
            "你觉得 AI 训练和人类学习最像的地方是什么？",
            "如果你来设计一个训练 AI 的方法，你会怎么做？"
          ],
            "guides": ["AI 训练和人类学习最像的地方是：都要练习。做错了要调整（AI 调参数，人改方法），要做很多次才能变好。但 AI 需要的数据量比人多得多。", "如果我来设计训练方法：1.先给简单的例子；2.慢慢增加难度；3.做错了要告诉它为什么错；4.让它有机会反思和总结规律。这其实和人类教学很像！"],
          "activity": {
            "title": "猜数字游戏",
            "description": "体验 AI 训练的过程",
            "steps": [
              "你心里想一个1-100的数字",
              "让家人来猜",
              "每次只说“大了”或“小了”",
              "记录猜了多少次才猜对",
              "讨论：这个过程和 AI 训练有什么相似之处？"
            ]
          ,
            "resources": [{"icon": "🔄", "title": "模型训练步骤图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>1. 准备数据</b>收集训练数据</div><div class=\"template-item\"><b>2. 选择结构</b>设计模型架构</div><div class=\"template-item\"><b>3. 调整参数</b>不断优化模型</div><div class=\"template-item\"><b>4. 评估性能</b>测试准确率</div></div>"}, {"icon": "📝", "title": "笔记模板：猜数字游戏", "content": "<div class=\"note-lines\"><div class=\"note-line\">我想的数字：____</div><div class=\"note-line\">家人猜了 ____ 次才猜对</div><div class=\"note-line\">这就像 AI 训练：不断调整，越来越准</div></div>"}]}
        },
        {
          "id": 15,
          "number": "15",
          "title": "提示词的艺术",
          "duration": "10-15分钟",
          "objective": "学会和 AI 对话的技巧——提示工程入门",
          "sections": [
            {
              "type": "text",
              "title": "什么是提示工程",
              "content": "提示词 = 你对 AI 说的话。<br><br>好的提示词 = 好的结果。<br><br>提示工程就是学会怎么“问”AI，让它给你最好的回答。"
            },
            {
              "type": "image",
              "title": "提示词的艺术",
              "content": "prompt-engineering"
            },
            {
              "type": "highlight",
              "title": "四个提示词技巧",
              "content": "<b>技巧1：说清楚你要什么</b><br>❌ “写个故事”<br>✅ “写一个关于一只害怕水的猫的冒险故事，200字以内，给10岁孩子看”<br><br><b>技巧2：给上下文</b><br>❌ “帮我翻译”<br>✅ “我正在给外国朋友写邮件，要正式但友好，请翻译这段话”<br><br><b>技巧3：指定格式</b><br>❌ “介绍一下太阳系”<br>✅ “用表格介绍太阳系八大行星，包括名称、大小、特点”<br><br><b>技巧4：分步骤来</b><br>❌ “帮我做一个项目”<br>✅ “我想做天气APP。第一步，列出需要的功能”"
            },
            {
              "type": "case",
              "title": "对比实验",
              "content": "同一个任务，不同的提示词：<br><br><b>任务</b>：让 AI 讲一个故事<br><b>提示1</b>：“讲故事” → AI 可能随便讲一个<br><b>提示2</b>：“讲一个关于勇敢小兔子的睡前故事，要温柔，100字以内” → AI 讲一个符合要求的故事<br><br>区别显而易见！"
            },
            {
              "type": "text",
              "title": "提示工程的未来",
              "content": "提示工程是一项越来越重要的技能。<br><br>未来，会“问”AI 的人比不会问的人有明显优势。<br><br>学会提问题，就是学会和 AI 高效合作。"
            },
            {
              "type": "image",
              "title": "提示词结构",
              "content": "prompt-structure"
            },
            {
              "type": "image",
              "title": "Few-shot学习",
              "content": "few-shot"
            }
          ],
          "quiz": [
            {
              "question": "以下哪个提示词最有效？",
              "options": [
                "帮我写作文",
                "帮我写一篇300字的关于春天的作文，要生动有趣",
                "写！",
                "写个东西"
              ],
              "correct": 1,
              "explanation": "最有效的提示词应该具体、明确——说明要写什么、多长、什么风格。越具体，AI 的回答越符合你的需求。"
            },
            {
              "question": "提示工程是什么？",
              "options": [
                "一种编程语言",
                "设计好的提示词来和 AI 高效对话的技术",
                "一种硬件",
                "一种操作系统"
              ],
              "correct": 1,
              "explanation": "提示工程是设计和优化提示词的技术，目的是让 AI 给出更好、更准确的回答。"
            },
            {
              "question": "为什么给上下文很重要？",
              "options": [
                "让回答更长",
                "帮助 AI 理解你的需求和场景",
                "让 AI 更累",
                "没有为什么"
              ],
              "correct": 1,
              "explanation": "上下文帮助 AI 理解你的具体场景和需求，这样它才能给出更贴合你情况的回答。"
            }
          ],
          "discussion": [
            "你觉得好的提示词需要包含什么？",
            "未来“提示工程师”会不会成为一个职业？"
          ],
            "guides": ["好的提示词通常包含：1.明确的任务（做什么）；2.具体的要求（怎么做）；3.背景信息（给谁看、什么场景）；4.格式要求（多长、什么风格）。", "现在已经有提示词工程师这个职业了！有些公司专门聘请人来设计让 AI 更好工作的指令。未来这可能成为一个热门职业。"],
          "activity": {
            "title": "提示词挑战",
            "description": "对比不同提示词的效果",
            "steps": [
              "选一个任务，比如“解释光合作用”",
              "第一次：用最简单的提示词，比如“解释光合作用”",
              "第二次：用详细的提示词，比如“用小学生能懂的话解释光合作用，举一个生活中的例子”",
              "对比两次的回答",
              "讨论：哪个回答更好？为什么？"
            ]
          ,
            "resources": [{"icon": "💡", "title": "进阶提示词模板", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>角色</b>你是...</div><div class=\"template-item\"><b>任务</b>请帮我...</div><div class=\"template-item\"><b>背景</b>因为...</div><div class=\"template-item\"><b>要求</b>要...（格式、风格）</div></div>"}, {"icon": "📝", "title": "笔记模板：提示词实验", "content": "<div class=\"note-lines\"><div class=\"note-line\">我的任务：________________</div><div class=\"note-line\">第一次提示词：________________</div><div class=\"note-line\">改进后的提示词：________________</div></div>"}]}
        }
      ]
    },
    {
      "id": 3,
      "title": "人物、公司与历史转折",
      "description": "通过故事和纪录片视角，让 AI 变得有人情味。了解推动 AI 发展的关键人物和事件。",
      "color": "#a855f7",
      "icon": "📖",
      "episodes": [
        {
          "id": 16,
          "number": "16",
          "title": "艾伦·图灵",
          "duration": "10-12分钟",
          "objective": "了解计算机之父的故事，理解他为什么重要",
          "sections": [
            {
              "type": "text",
              "title": "图灵是谁",
              "content": "艾伦·图灵（1912-1954），英国数学家，计算机科学和人工智能之父。<br><br>他提出了“图灵测试”——如果一台机器能和人对话而人分辨不出来，它就算“智能”。"
            },
            {
              "type": "image",
              "title": "艾伦·图灵",
              "content": "turing"
            },
            {
              "type": "case",
              "title": "故事：破译密码",
              "content": "二战期间，德国使用 Enigma 密码机来加密军事通信。这个密码机有159千万亿种可能的设置，看起来不可能破解。<br><br>但图灵设计了“炸弹机”，大大加速了破译过程。这项工作被认为缩短了二战至少两年，挽救了数百万人的生命。"
            },
            {
              "type": "case",
              "title": "故事：悲剧结局",
              "content": "1952年，图灵因同性恋被判处化学阉割。<br><br>1954年，他被发现死于氰化物中毒，年仅41岁。<br><br>2013年，英国女王追授他皇家赦免。<br><br>一个天才的人生，却以这样的方式结束。"
            },
            {
              "type": "highlight",
              "content": "图灵的贡献：• 提出“机器能思考吗？”这个问题 • 设计了通用图灵机（现代计算机的理论基础） • 二战中破解密码，拯救无数生命"
            },
            {
              "type": "image",
              "title": "图灵机",
              "content": "turing-machine"
            },
            {
              "type": "image",
              "title": "图灵测试",
              "content": "turing-test"
            }
          ],
          "quiz": [
            {
              "question": "图灵测试是什么？",
              "options": [
                "测试电脑速度",
                "测试机器能否像人一样对话",
                "测试网络连接",
                "测试打字速度"
              ],
              "correct": 1,
              "explanation": "图灵测试是判断机器是否具有智能的标准——如果机器能和人对话，而人分辨不出它是机器，就算通过测试。"
            },
            {
              "question": "图灵在二战中做了什么？",
              "options": [
                "制造武器",
                "破解德国密码",
                "开飞机",
                "当医生"
              ],
              "correct": 1,
              "explanation": "图灵设计了“炸弹机”来破解德国的 Enigma 密码机，这对盟军的胜利起到了关键作用。"
            },
            {
              "question": "图灵被称为什么？",
              "options": [
                "物理学之父",
                "计算机科学和人工智能之父",
                "数学之父",
                "化学之父"
              ],
              "correct": 1,
              "explanation": "图灵提出了计算机的理论基础和人工智能的概念，因此被称为计算机科学和人工智能之父。"
            }
          ],
          "discussion": [
            "图灵测试到今天还重要吗？为什么？",
            "如果你能问图灵一个问题，你想问什么？"
          ],
            "guides": ["图灵测试到今天仍然有参考价值，虽然不是完美的标准。它让我们思考：什么是智能？怎样才算像人？这些问题现在比以前更重要了。", "如果我能问图灵一个问题，我会问：你觉得机器能有意识吗？因为这个问题到今天也没有答案，而且随着 AI 发展，越来越值得思考。"],
          "activity": {
            "title": "模仿游戏",
            "description": "体验图灵测试",
            "steps": [
              "找一个朋友，让他在另一个房间",
              "你和 AI 聊天5分钟",
              "然后和朋友聊天5分钟",
              "看看 AI 的回答和朋友的回答有什么不同",
              "讨论：你能在多大程度上分辨 AI 和人？"
            ]
          ,
            "resources": [{"icon": "🧩", "title": "图灵测试流程图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>1. 人和AI聊天</b>通过文字对话</div><div class=\"template-item\"><b>2. 判断对方</b>猜是人还是机器</div><div class=\"template-item\"><b>3. 如果猜不出</b>说明AI通过测试</div></div>"}, {"icon": "📝", "title": "笔记模板：模仿游戏", "content": "<div class=\"note-lines\"><div class=\"note-line\">我和 AI 聊了：________________</div><div class=\"note-line\">我觉得像人吗？像/不像</div><div class=\"note-line\">如果我问图灵一个问题：________________</div></div>"}]}
        },
        {
          "id": 17,
          "number": "17",
          "title": "AI 的寒冬与重生",
          "duration": "10-12分钟",
          "objective": "理解技术发展的波折，培养对挫折的认知",
          "sections": [
            {
              "type": "text",
              "title": "AI 不是一直在进步",
              "content": "AI 经历过两次“寒冬”——研究资金撤退、学者转行、公众兴趣消退。<br><br>但每一次寒冬之后，都有新的突破。"
            },
            {
              "type": "image",
              "title": "AI 的寒冬与重生",
              "content": "ai-winter"
            },
            {
              "type": "case",
              "title": "第一次 AI 寒冬（1966-1974）",
              "content": "1956年达特茅斯会议后，大家对 AI 期望很高。<br><br>但计算机太慢、内存太小，做不了什么。承诺的“20年内机器将能做人能做的任何事”没有实现。<br><br>政府撤资，研究陷入低谷。"
            },
            {
              "type": "case",
              "title": "第二次 AI 寒冬（1987-1993）",
              "content": "专家系统（用规则写 AI）兴起又衰落。日本投入巨资的第五代计算机项目失败。<br><br>又一波资金撤退。AI 再次被认为“不过如此”。"
            },
            {
              "type": "highlight",
              "title": "重生：深度学习的崛起",
              "content": "2006年，辛顿提出深度学习<br>2012年，深度学习在图像识别比赛中大获全胜<br>2016年，AlphaGo 击败李世石<br>2022年，ChatGPT 发布<br><br>AI 终于从寒冬中走出，迎来黄金时代。"
            },
            {
              "type": "image",
              "title": "AI寒冬原因",
              "content": "ai-winter-cause"
            },
            {
              "type": "image",
              "title": "深度学习突破",
              "content": "dl-breakthrough"
            }
          ],
          "quiz": [
            {
              "question": "AI 经历过几次“寒冬”？",
              "options": [
                "一次",
                "两次",
                "三次",
                "没有"
              ],
              "correct": 1,
              "explanation": "AI 经历过两次寒冬：第一次在1960-70年代，第二次在1987-1993年。每次都因为期望过高而技术跟不上。"
            },
            {
              "question": "AI 寒冬的主要原因是什么？",
              "options": [
                "天气太冷",
                "期望太高，技术跟不上",
                "没有人研究",
                "AI 太聪明了"
              ],
              "correct": 1,
              "explanation": "AI 寒冬的根本原因是人们对 AI 的期望远超当时的技术能力，导致失望和资金撤退。"
            },
            {
              "question": "AI 重生的关键突破是什么？",
              "options": [
                "发现了新大陆",
                "深度学习技术的突破",
                "发明了互联网",
                "发现了石油"
              ],
              "correct": 1,
              "explanation": "深度学习的突破是 AI 重生的关键——它让机器能够从大量数据中自动学习复杂模式。"
            }
          ],
          "discussion": [
            "技术的发展有起有落，这像不像你学习中的高点和低点？",
            "如果你是那个时代的科学家，你会放弃吗？"
          ],
            "guides": ["技术发展确实像学骑自行车：刚开始很难，摔很多次（寒冬期），但坚持练习就会越来越好（突破期），最后能骑得很稳（成熟期）。", "在 AI 寒冬放弃是很容易的，因为看不到希望。但那些坚持下来的人最终推动了 AI 的革命。这告诉我们：有价值的事情往往需要耐心和坚持。"],
          "activity": {
            "title": "AI 时间线绘制",
            "description": "画出 AI 的起伏",
            "steps": [
              "在纸上画一条时间线",
              "标注 AI 发展的高峰和低谷",
              "在每个节点写上发生了什么",
              "在旁边写上你的感想",
              "讨论：技术的发展有什么规律？"
            ]
          ,
            "resources": [{"icon": "📉", "title": "AI 寒冬原因分析", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>计算能力不足</b>电脑太慢太小</div><div class=\"template-item\"><b>数据量有限</b>没有互联网</div><div class=\"template-item\"><b>算法不够复杂</b>技术跟不上</div><div class=\"template-item\"><b>应用案例少</b>看不到实际价值</div></div>"}, {"icon": "📝", "title": "笔记模板：坚持的力量", "content": "<div class=\"note-lines\"><div class=\"note-line\">AI 寒冬持续了：____年</div><div class=\"note-line\">坚持下来的科学家：________________</div><div class=\"note-line\">如果我在那个年代：________________</div></div>"}]}
        },
        {
          "id": 18,
          "number": "18",
          "title": "杰弗里·辛顿与深度学习",
          "duration": "10-12分钟",
          "objective": "了解“AI 教父”的故事，理解深度学习为什么重要",
          "sections": [
            {
              "type": "text",
              "title": "谁是辛顿",
              "content": "杰弗里·辛顿，深度学习之父，2024年诺贝尔物理学奖得主。<br><br>在 AI 最冷的寒冬里，他是少数坚持研究神经网络的科学家之一。"
            },
            {
              "type": "image",
              "title": "杰弗里·辛顿与深度学习",
              "content": "deep-learning"
            },
            {
              "type": "case",
              "title": "故事：孤独的研究者",
              "content": "在1980-90年代，几乎所有科学家都放弃了神经网络研究。<br><br>辛顿和少数人坚持。被同事嘲笑“做的是死胡同”。<br><br>但他相信这条路是对的。"
            },
            {
              "type": "case",
              "title": "故事：突破时刻",
              "content": "2012年，辛顿的学生用深度学习赢得 ImageNet 图像识别比赛。<br><br>错误率比第二名低了整整10%！<br><br>这个结果震惊了整个学术界。从此，深度学习成为 AI 的主流方法。"
            },
            {
              "type": "case",
              "title": "故事：后悔的决定",
              "content": "2023年，辛顿从谷歌辞职。<br><br>他说：“我后悔自己做了这些工作。”他对 AI 的风险感到担忧。<br><br>一个创造了历史的人，却对自己的创造感到恐惧。"
            },
            {
              "type": "highlight",
              "content": "辛顿的故事告诉我们：• 坚持正确的方向比跟风更重要 • 科学发现是好的，但用它的人可能做坏事 • 即使是创造者，也无法完全控制自己的创造物"
            },
            {
              "type": "image",
              "title": "反向传播",
              "content": "backpropagation"
            },
            {
              "type": "image",
              "title": "GPU加速训练",
              "content": "gpu-training"
            }
          ],
          "quiz": [
            {
              "question": "辛顿被称为？",
              "options": [
                "AI 之父",
                "AI 教父",
                "深度学习之父",
                "B和C都对"
              ],
              "correct": 3,
              "explanation": "辛顿既是“AI 教父”也是“深度学习之父”，他在深度学习领域的贡献获得了2024年诺贝尔物理学奖。"
            },
            {
              "question": "为什么辛顿在 AI 寒冬中坚持研究？",
              "options": [
                "因为有很多钱",
                "因为他相信这条路是对的",
                "因为没有别的事做",
                "因为政府要求"
              ],
              "correct": 1,
              "explanation": "辛顿相信神经网络是正确的方向，即使在几乎所有人都放弃的时候，他仍然坚持自己的信念。"
            },
            {
              "question": "辛顿为什么从谷歌辞职？",
              "options": [
                "退休了",
                "对 AI 的风险感到担忧",
                "找到了更好的工作",
                "被开除了"
              ],
              "correct": 1,
              "explanation": "辛顿对 AI 的潜在风险感到担忧，他担心自己的研究可能被用来做有害的事情，所以选择辞职。"
            }
          ],
          "discussion": [
            "一个人坚持做别人不看好的事，需要什么品质？",
            "辛顿后悔自己的研究，你怎么看？"
          ],
            "guides": ["深度学习的关键突破是让 AI 学会了看。2012年，一个叫 AlexNet 的程序在图像识别比赛中打败了所有人，证明了深度神经网络的威力。从此 AI 进入了新纪元。", "从 AlphaGo 击败围棋世界冠军，到 ChatGPT 能写文章，AI 的能力在短短几年内突飞猛进。每一次突破都让人们对 AI 更加关注。"],
          "activity": {
            "title": "坚持的力量",
            "description": "讨论坚持的意义",
            "steps": [
              "想一个你坚持做的事情",
              "是什么让你坚持下来的？",
              "有没有想过放弃？为什么没有？",
              "把你的故事讲给家人听",
              "讨论：坚持和固执有什么区别？"
            ]
          ,
            "resources": [{"icon": "🏆", "title": "深度学习突破图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>2012年</b>AlexNet 图像识别冠军</div><div class=\"template-item\"><b>2016年</b>AlphaGo 击败围棋世界冠军</div><div class=\"template-item\"><b>2020年</b>GPT-3 语言能力大幅提升</div><div class=\"template-item\"><b>2022年</b>ChatGPT 发布，人人可用</div></div>"}, {"icon": "📝", "title": "笔记模板：AI 突破记录", "content": "<div class=\"note-lines\"><div class=\"note-line\">最让我惊讶的突破：________________</div><div class=\"note-line\">这个突破的意义：________________</div><div class=\"note-line\">我觉得下一个突破会是：________________</div></div>"}]}
        },
        {
          "id": 19,
          "number": "19",
          "title": "OpenAI 与 ChatGPT",
          "duration": "10-12分钟",
          "objective": "了解 ChatGPT 的诞生过程，理解技术突破的背景",
          "sections": [
            {
              "type": "text",
              "title": "OpenAI 的创立",
              "content": "2015年，一群科技大佬（包括马斯克、阿尔特曼）成立 OpenAI。<br><br>最初是“非营利”组织，目标是“确保 AI 造福全人类”。<br><br>后来变成商业公司，经历了巨大转变。"
            },
            {
              "type": "image",
              "title": "OpenAI 与 ChatGPT",
              "content": "chatgpt"
            },
            {
              "type": "table",
              "title": "GPT 的进化",
              "content": [
                [
                  "版本",
                  "年份",
                  "能力"
                ],
                [
                  "GPT-1",
                  "2018",
                  "能写几句通顺的话"
                ],
                [
                  "GPT-2",
                  "2019",
                  "能写小文章，被认为“太危险”"
                ],
                [
                  "GPT-3",
                  "2020",
                  "能力大幅提升，开始商业化"
                ],
                [
                  "ChatGPT",
                  "2022",
                  "对话能力突破，两个月用户破亿"
                ]
              ]
            },
            {
              "type": "case",
              "title": "改变世界的发布",
              "content": "2022年11月，ChatGPT 发布。<br><br>两个月内，用户数破亿——这是历史上增长最快的应用。<br><br>教育界、科技界、普通人都在讨论它。引发全球 AI 竞赛。"
            },
            {
              "type": "highlight",
              "title": "关键概念",
              "content": "<b>大语言模型（LLM）</b>：用海量文本训练的 AI 模型<br><b>对齐（Alignment）</b>：让 AI 的行为符合人类价值观<br><b>RLHF</b>：用人类反馈来训练 AI，让它更“听话”"
            },
            {
              "type": "image",
              "title": "GPT架构",
              "content": "gpt-architecture"
            },
            {
              "type": "image",
              "title": "RLHF训练",
              "content": "rlhf-training"
            }
          ],
          "quiz": [
            {
              "question": "ChatGPT 发布后多久用户破亿？",
              "options": [
                "一周",
                "一个月",
                "两个月",
                "一年"
              ],
              "correct": 2,
              "explanation": "ChatGPT 于2022年11月发布，仅两个月用户就突破一亿，成为历史上增长最快的应用之一。"
            },
            {
              "question": "OpenAI 最初的目标是什么？",
              "options": [
                "赚很多钱",
                "确保 AI 造福全人类",
                "打败谷歌",
                "造机器人"
              ],
              "correct": 1,
              "explanation": "OpenAI 最初是非营利组织，目标是确保 AI 技术能够造福全人类，而不仅仅是为少数公司服务。"
            },
            {
              "question": "RLHF 是什么？",
              "options": [
                "一种编程语言",
                "用人类反馈来训练 AI 的方法",
                "一种硬件",
                "一种游戏"
              ],
              "correct": 1,
              "explanation": "RLHF（基于人类反馈的强化学习）是用人类的评价和反馈来训练 AI，让它生成更符合人类期望的回答。"
            }
          ],
          "discussion": [
            "一个公司的决定怎么影响了全世界？",
            "AI 应该由谁来控制？公司、政府还是每个人？"
          ],
            "guides": ["GPT 的发展历程：GPT-1（2018年，学会基本语言）→ GPT-2（2019年，能写文章但被担心滥用）→ GPT-3（2020年，能力大幅提升）→ ChatGPT（2022年底，普通人也能用）→ GPT-4（2023年，更聪明更可靠）。", "2022年底 ChatGPT 发布后，全球掀起了 AI 热潮。各国都在加速发展 AI 技术，这可能是一次像互联网一样的技术革命。"],
          "activity": {
            "title": "AI 进化观察",
            "description": "体验 AI 的能力",
            "steps": [
              "用 ChatGPT 或类似工具问同一个问题",
              "让 AI 回答后，要求它“更详细”地回答",
              "再让它“用简单的话”回答",
              "再让它“举个例子”",
              "讨论：AI 的回答有什么变化？"
            ]
          ,
            "resources": [{"icon": "📈", "title": "GPT 发展历程图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>GPT-1 (2018)</b>学会基本语言</div><div class=\"template-item\"><b>GPT-2 (2019)</b>能写文章</div><div class=\"template-item\"><b>GPT-3 (2020)</b>能力大幅提升</div><div class=\"template-item\"><b>ChatGPT (2022)</b>普通人也能用</div></div>"}, {"icon": "📝", "title": "笔记模板：ChatGPT 体验", "content": "<div class=\"note-lines\"><div class=\"note-line\">我问 ChatGPT 的第一个问题：________________</div><div class=\"note-line\">它的回答让我惊讶吗？是/否</div><div class=\"note-line\">我觉得它最厉害的地方：________________</div></div>"}]}
        },
        {
          "id": 20,
          "number": "20",
          "title": "中国的 AI 故事",
          "duration": "10-12分钟",
          "objective": "了解中国在 AI 领域的发展，建立本土视角",
          "sections": [
            {
              "type": "text",
              "title": "中国 AI 的起步",
              "content": "2000年后，百度、阿里、腾讯开始投入 AI 研究。<br><br>大量海归科学家回国，政府出台 AI 发展规划。<br><br>中国 AI 从追赶者逐渐变成领跑者。"
            },
            {
              "type": "image",
              "title": "中国的 AI 故事",
              "content": "china-ai"
            },
            {
              "type": "table",
              "title": "中国 AI 重要事件",
              "content": [
                [
                  "年份",
                  "事件",
                  "意义"
                ],
                [
                  "2016",
                  "百度 Apollo 自动驾驶",
                  "中国自动驾驶起步"
                ],
                [
                  "2017",
                  "国务院 AI 发展规划",
                  "国家战略层面推动"
                ],
                [
                  "2023",
                  "百度文心一言发布",
                  "中国大模型竞赛开始"
                ],
                [
                  "2024-25",
                  "DeepSeek 发布",
                  "性能接近 GPT-4，全球关注"
                ]
              ]
            },
            {
              "type": "highlight",
              "title": "中国 AI 的特色",
              "content": "<b>应用场景丰富</b>：人口多、数据多、场景多<br><b>政府支持强</b>：政策扶持、资金投入<br><b>迭代速度快</b>：从研究到应用的转化很快<br><b>竞争激烈</b>：多家公司互相竞争，推动创新"
            },
            {
              "type": "text",
              "title": "身边的中国 AI",
              "content": "你每天都在用中国 AI：<br>• 手机的语音助手<br>• 购物推荐系统<br>• 地图导航<br>• 短视频推荐<br>• 智能手表的健康监测"
            },
            {
              "type": "image",
              "title": "中国AI产业",
              "content": "china-ai-industry"
            },
            {
              "type": "image",
              "title": "中国AI应用",
              "content": "china-ai-apps"
            }
          ],
          "quiz": [
            {
              "question": "中国 AI 发展的最大优势是什么？",
              "options": [
                "人最多",
                "应用场景丰富，数据量大",
                "天气最好",
                "语言最简单"
              ],
              "correct": 1,
              "explanation": "中国 AI 的最大优势是丰富的应用场景——人口多、数据多、场景多，这为 AI 训练提供了大量素材。"
            },
            {
              "question": "DeepSeek 是什么？",
              "options": [
                "一种搜索引擎",
                "中国开发的高性能大语言模型",
                "一种海底探测器",
                "一个社交平台"
              ],
              "correct": 1,
              "explanation": "DeepSeek 是中国开发的大语言模型，性能接近 GPT-4，用更少的算力实现了更好的效果。"
            },
            {
              "question": "以下哪个是中国 AI 的应用？",
              "options": [
                "火箭发射",
                "短视频推荐算法",
                "种水稻",
                "建房子"
              ],
              "correct": 1,
              "explanation": "短视频推荐算法是中国 AI 的典型应用——通过分析用户行为，智能推荐用户可能感兴趣的内容。"
            }
          ],
          "discussion": [
            "你觉得中国 AI 最厉害的地方是什么？",
            "如果你是 AI 公司的老板，你会重点做什么？"
          ],
            "guides": ["中国 AI 的厉害之处包括：1.应用广泛（移动支付、外卖推荐、人脸识别）；2.数据量大（14亿人口）；3.政策支持；4.在某些领域（如语音识别、图像识别）已经达到世界领先水平。", "中国 AI 公司有很多：百度（文心一言）、阿里（通义千问）、腾讯（混元）、华为（盘古）、字节跳动（豆包）……它们在不同领域都有自己的特色。"],
          "activity": {
            "title": "身边的 AI",
            "description": "找出身边的中国 AI",
            "steps": [
              "列出你今天用过的所有手机 APP",
              "找出哪些用到了 AI 技术",
              "找出哪些是中国公司开发的",
              "讨论：这些 AI 帮你做了什么？"
            ]
          ,
            "resources": [{"icon": "🇨🇳", "title": "中国 AI 版图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>百度</b>文心一言</div><div class=\"template-item\"><b>阿里</b>通义千问</div><div class=\"template-item\"><b>腾讯</b>混元</div><div class=\"template-item\"><b>字节</b>豆包</div></div>"}, {"icon": "📝", "title": "笔记模板：身边 AI 记录", "content": "<div class=\"note-lines\"><div class=\"note-line\">我今天用过的 APP：________________</div><div class=\"note-line\">用到 AI 的有：________________</div><div class=\"note-line\">中国公司开发的有：________________</div></div>"}]}
        }
      ]
    },
    {
      "id": 4,
      "title": "前沿科技、公司与未来职业",
      "description": "看见 AI 在各行业的应用，连接未来可能性。从医疗到艺术，从游戏到环保。",
      "color": "#10b981",
      "icon": "🚀",
      "episodes": [
        {
          "id": 21,
          "number": "21",
          "title": "AI + 医疗",
          "duration": "8-10分钟",
          "objective": "了解 AI 如何改变医疗行业",
          "sections": [
            {
              "type": "text",
              "title": "AI 在医疗中的应用",
              "content": "AI 正在改变医疗行业的方方面面——从辅助诊断到药物研发，从手术机器人到健康管理。"
            },
            {
              "type": "image",
              "title": "AI + 医疗",
              "content": "ai-healthcare"
            },
            {
              "type": "case",
              "title": "案例：AI 看片子",
              "content": "Google 的 AI 系统分析眼底照片，能发现医生漏诊的早期糖尿病眼病。<br><br>AI 分析胸部 CT，能在放射科医生之前发现微小的肿瘤。<br><br>AI 看片子不是要替代医生，而是帮助医生做得更好。"
            },
            {
              "type": "highlight",
              "title": "AI 医疗的四大应用",
              "content": "<b>辅助诊断</b>：分析X光片、CT、核磁共振<br><b>药物研发</b>：预测蛋白质结构，加速新药设计<br><b>手术机器人</b>：更精准、创口更小<br><b>健康管理</b>：智能手表监测健康数据"
            },
            {
              "type": "text",
              "title": "AlphaFold 的突破",
              "content": "2020年，DeepMind 的 AlphaFold 解决了生物学50年来的难题——预测蛋白质结构。<br><br>这能加速新药研发，帮助治疗癌症、阿尔茨海默症等疾病。"
            },
            {
              "type": "image",
              "title": "AI诊断流程",
              "content": "ai-diagnosis"
            },
            {
              "type": "image",
              "title": "医疗影像分析",
              "content": "medical-imaging"
            }
          ],
          "quiz": [
            {
              "question": "AI 在医疗中最大的优势是什么？",
              "options": [
                "比医生便宜",
                "能同时分析大量数据，发现人眼容易忽略的细节",
                "不用休息",
                "比医生聪明"
              ],
              "correct": 1,
              "explanation": "AI 的优势在于能快速分析大量数据，并发现人眼容易忽略的微小异常，帮助医生做出更准确的诊断。"
            },
            {
              "question": "AlphaFold 解决了什么问题？",
              "options": [
                "做手术",
                "预测蛋白质结构",
                "制造药品",
                "照顾病人"
              ],
              "correct": 1,
              "explanation": "AlphaFold 解决了预测蛋白质三维结构的难题，这能加速新药研发，对治疗多种疾病有重大意义。"
            },
            {
              "question": "AI 医疗的目的是什么？",
              "options": [
                "替代医生",
                "帮助医生做得更好",
                "让医院赚钱",
                "减少病人"
              ],
              "correct": 1,
              "explanation": "AI 医疗的目的不是替代医生，而是作为辅助工具，帮助医生更准确、更高效地诊断和治疗。"
            }
          ],
          "discussion": [
            "如果你生病了，你愿意让 AI 帮你看病吗？为什么？",
            "AI 能完全替代医生吗？"
          ],
            "guides": ["AI 医生的好处：1.不会疲劳，24小时在线；2.能同时处理大量病例；3.不会因为情绪影响判断。但挑战也很明显：1.可能漏诊罕见病；2.不能替代医生和患者的沟通；3.出错谁负责？", "AI 不能完全替代医生。看病不只是诊断，还需要：1.了解病人的感受；2.给出心理安慰；3.做出复杂的综合判断；4.承担医疗责任。这些都需要人来做。"],
          "activity": {
            "title": "AI 医生模拟",
            "description": "体验 AI 辅助诊断",
            "steps": [
              "用 AI 工具描述一些常见症状",
              "看看 AI 给出什么建议",
              "对比 AI 建议和真正的医生诊断",
              "讨论：AI 的建议靠谱吗？什么情况下应该去看真正的医生？"
            ]
          ,
            "resources": [{"icon": "🏥", "title": "AI 医疗应用图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>医学影像</b>帮医生看 X 光、CT</div><div class=\"template-item\"><b>辅助诊断</b>分析症状给出建议</div><div class=\"template-item\"><b>药物研发</b>加速新药发现</div><div class=\"template-item\"><b>健康管理</b>监测健康数据</div></div>"}, {"icon": "📝", "title": "笔记模板：AI 医生体验", "content": "<div class=\"note-lines\"><div class=\"note-line\">我描述的症状：________________</div><div class=\"note-line\">AI 给出的建议：________________</div><div class=\"note-line\">我觉得准吗？准/不准</div><div class=\"note-line\">我会相信 AI 的诊断吗？会/不会</div></div>"}]}
        },
        {
          "id": 22,
          "number": "22",
          "title": "AI + 教育",
          "duration": "8-10分钟",
          "objective": "了解 AI 如何改变学习方式",
          "sections": [
            {
              "type": "text",
              "title": "AI 老师来了",
              "content": "AI 正在改变教育的方式——从标准化教学到个性化学习。<br><br>每个学生都能有自己的 AI 学习伙伴。"
            },
            {
              "type": "image",
              "title": "AI + 教育",
              "content": "ai-education"
            },
            {
              "type": "highlight",
              "title": "AI 教育的四大应用",
              "content": "<b>个性化学习</b>：AI 分析学习进度，调整题目难度<br><b>智能辅导</b>：永远在线的 AI 家教<br><b>语言学习</b>：和 AI 用外语对话<br><b>内容生成</b>：AI 自动生成练习题"
            },
            {
              "type": "analogy",
              "title": "比喻：私人教练",
              "content": "传统教育像大班课——老师教同样的内容给所有学生。<br><br>AI 教育像私人教练——根据你的水平和进度，调整训练计划。<br><br>你哪里弱就多练哪里，哪里强就快速通过。"
            },
            {
              "type": "text",
              "title": "AI 教育的局限",
              "content": "• AI 不能完全理解学生的情感需求<br>• AI 不能像真人老师那样激励学生<br>• AI 不能完全替代课堂讨论和社交学习<br>• AI 教育需要学生的自律和主动"
            },
            {
              "type": "image",
              "title": "个性化学习",
              "content": "personalized-learning"
            },
            {
              "type": "image",
              "title": "智能辅导系统",
              "content": "intelligent-tutoring"
            }
          ],
          "quiz": [
            {
              "question": "AI 教育最大的特点是什么？",
              "options": [
                "更便宜",
                "个性化——根据每个学生的情况调整",
                "更快",
                "更简单"
              ],
              "correct": 1,
              "explanation": "AI 教育最大的特点是能够根据每个学生的学习进度、强项和弱项，提供个性化的学习内容和节奏。"
            },
            {
              "question": "AI 老师能完全替代真人老师吗？",
              "options": [
                "能",
                "不能",
                "看情况",
                "不需要"
              ],
              "correct": 1,
              "explanation": "AI 老师不能完全替代真人老师——AI 无法理解学生的情感需求，也无法像真人老师那样激励和引导学生。"
            },
            {
              "question": "AI 教育最适合什么？",
              "options": [
                "替代所有学校",
                "作为辅助工具，补充传统教育",
                "只教数学",
                "只教英语"
              ],
              "correct": 1,
              "explanation": "AI 教育最适合作为辅助工具，补充和增强传统教育，而不是完全替代。"
            }
          ],
          "discussion": [
            "你喜欢 AI 老师还是真人老师？为什么？",
            "如果 AI 能帮你学任何东西，你最想学什么？"
          ],
            "guides": ["自动驾驶的挑战包括：1.极端天气（雨雪雾）怎么识别？2.突然出现的行人或动物怎么反应？3.交通规则各地不同怎么适应？4.出了事故谁负责？", "可以想象：未来路上的车都会互相说话，提前知道前面有事故，自动调整路线。甚至红绿灯都不需要了，因为车会自己协调通行。"],
          "activity": {
            "title": "AI 学习伙伴",
            "description": "用 AI 学习新知识",
            "steps": [
              "选一个你想学的小知识点",
              "用 AI 工具让它用简单的话解释",
              "让 AI 出几道题考你",
              "做错的题让 AI 再解释一遍",
              "讨论：AI 教得好不好？有什么优点和缺点？"
            ]
          ,
            "resources": [{"icon": "🚗", "title": "自动驾驶分级图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>L1</b>辅助驾驶（定速巡航）</div><div class=\"template-item\"><b>L2</b>部分自动（自动泊车）</div><div class=\"template-item\"><b>L3</b>有条件自动（高速自动驾驶）</div><div class=\"template-item\"><b>L4</b>高度自动（限定区域无人驾驶）</div></div>"}, {"icon": "📝", "title": "笔记模板：自动驾驶挑战", "content": "<div class=\"note-lines\"><div class=\"note-line\">自动驾驶最大的挑战：________________</div><div class=\"note-line\">下雨天能开吗？能/不能/不确定</div><div class=\"note-line\">突然有小狗冲出来怎么办？________________</div></div>"}]}
        },
        {
          "id": 23,
          "number": "23",
          "title": "AI + 艺术",
          "duration": "8-10分钟",
          "objective": "了解 AI 在艺术创作中的应用，思考创意的边界",
          "sections": [
            {
              "type": "text",
              "title": "AI 也能搞艺术",
              "content": "AI 画画、写歌、拍电影——创意的边界在哪里？<br><br>AI 艺术正在改变我们对“创作”的理解。"
            },
            {
              "type": "image",
              "title": "AI + 艺术",
              "content": "ai-art"
            },
            {
              "type": "case",
              "title": "案例：AI 画画",
              "content": "Midjourney、DALL-E、Stable Diffusion——这些 AI 工具能根据文字描述生成图片。<br><br>2022年，一幅 AI 生成的画作在美国科罗拉多州博览会美术比赛中获得第一名，引发了巨大争议。"
            },
            {
              "type": "highlight",
              "title": "AI 艺术的应用",
              "content": "<b>AI 生成图片</b>：输入文字，AI 画出图片<br><b>AI 音乐</b>：输入风格和情绪，AI 写旋律<br><b>AI 视频</b>：文字生成视频（Sora、可灵）<br><b>AI 写作</b>：写小说、写诗、写剧本"
            },
            {
              "type": "text",
              "title": "AI 艺术的争议",
              "content": "• AI 画的画算不算艺术？<br>• AI 是否在“抄袭”人类的创意？<br>• AI 艺术的价值归谁？"
            },
            {
              "type": "image",
              "title": "AI创作流程",
              "content": "ai-creation-flow"
            },
            {
              "type": "image",
              "title": "风格迁移",
              "content": "style-transfer"
            }
          ],
          "quiz": [
            {
              "question": "AI 艺术最大的争议是什么？",
              "options": [
                "AI 画得太丑",
                "AI 画的画算不算真正的艺术",
                "AI 画画太慢",
                "AI 不会用颜色"
              ],
              "correct": 1,
              "explanation": "AI 艺术最大的争议在于——AI 生成的作品是否算真正的“艺术”，以及版权和创意归属问题。"
            },
            {
              "question": "AI 音乐是怎么创作的？",
              "options": [
                "复制别人的歌",
                "输入风格和情绪，AI 生成旋律",
                "AI 听了很多歌然后翻唱",
                "随机播放"
              ],
              "correct": 1,
              "explanation": "AI 音乐是根据你指定的风格、情绪、节奏等参数，生成符合要求的旋律和编曲。"
            },
            {
              "question": "如果你用 AI 画了一幅画，那是谁的作品？",
              "options": [
                "AI 的",
                "你的",
                "两者的合作",
                "不知道"
              ],
              "correct": 2,
              "explanation": "这是 AI 艺术的争议之一——你的创意（提示词）和 AI 的执行（生成图片）结合，可以看作两者的合作。"
            }
          ],
          "discussion": [
            "你觉得 AI 画的画算不算艺术？",
            "如果你用 AI 创作，你会用来做什么？"
          ],
            "guides": ["AI 在家里的应用越来越多：扫地机器人、智能音箱、手机语音助手、智能门锁、智能空调……它们让生活更方便，但也让我们越来越依赖科技。", "最大的变化可能是：1.很多家务不用自己做了；2.学习可以更个性化；3.但人与人面对面交流可能变少了。关键是找到平衡。"],
          "activity": {
            "title": "AI 艺术创作",
            "description": "用 AI 画一幅画",
            "steps": [
              "想一个你想画的主题",
              "用文字描述你想画的内容（提示词）",
              "用 AI 画画工具生成图片",
              "修改描述，再生成一次",
              "对比两次的结果",
              "讨论：你的创意和 AI 的执行，哪个更重要？"
            ]
          ,
            "resources": [{"icon": "🏠", "title": "智能家居 AI 应用", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>扫地机器人</b>自动规划路线</div><div class=\"template-item\"><b>智能音箱</b>语音控制家电</div><div class=\"template-item\"><b>智能门锁</b>人脸识别开门</div><div class=\"template-item\"><b>智能空调</b>自动调节温度</div></div>"}, {"icon": "📝", "title": "笔记模板：我家 AI 调查", "content": "<div class=\"note-lines\"><div class=\"note-line\">我家的 AI 设备：________________</div><div class=\"note-line\">最方便的是：________________</div><div class=\"note-line\">最不方便的是：________________</div></div>"}]}
        },
        {
          "id": 24,
          "number": "24",
          "title": "AI + 机器人",
          "duration": "8-10分钟",
          "objective": "了解 AI 如何让机器人变得更聪明",
          "sections": [
            {
              "type": "text",
              "title": "从传统到智能",
              "content": "传统机器人：按程序做事，只能重复固定动作。<br><br>AI 机器人：能感知环境、做出判断、自主行动。"
            },
            {
              "type": "image",
              "title": "AI + 机器人",
              "content": "ai-robotics"
            },
            {
              "type": "table",
              "title": "机器人四大类",
              "content": [["类型","特点","例子"],["工业机器人","重复执行固定任务","焊接机器人、装配机器人"],["服务机器人","与人交互，提供服务","扫地机器人、送餐机器人"],["特种机器人","在危险或特殊环境工作","排爆机器人、水下机器人"],["人形机器人","模仿人类外形和行为","Atlas、Tesla Bot"]]
            },
            {
              "type": "highlight",
              "title": "AI 让机器人变聪明",
              "content": "• <b>感知</b>：用摄像头和传感器“看”周围环境<br>• <b>决策</b>：用 AI 算法分析信息，做出判断<br>• <b>行动</b>：执行动作，完成任务<br>• <b>学习</b>：从经验中不断改进"
            },
            {
              "type": "text",
              "title": "机器人伦理",
              "content": "• 机器人应该有“道德底线”吗？<br>• 如果机器人伤了人，谁负责？<br>• 机器人能拥有“权利”吗？"
            },
            {
              "type": "image",
              "title": "机器人感知系统",
              "content": "robot-perception"
            },
            {
              "type": "image",
              "title": "人形机器人",
              "content": "humanoid-robot"
            }
          ],
          "quiz": [
            {
              "question": "AI 机器人和传统机器人最大的区别是什么？",
              "options": [
                "AI 机器人更贵",
                "AI 机器人能自主感知和决策",
                "AI 机器人更大",
                "AI 机器人更漂亮"
              ],
              "correct": 1,
              "explanation": "AI 机器人能通过传感器感知环境，用 AI 做出判断和决策，而不是只按固定程序执行。"
            },
            {
              "question": "以下哪个是特种机器人的应用场景？",
              "options": [
                "扫地",
                "送餐",
                "进入火灾现场救援",
                "陪老人聊天"
              ],
              "correct": 2,
              "explanation": "特种机器人用于人类难以到达或危险的环境，如火灾现场、深海、太空等。"
            },
            {
              "question": "AI 机器人是怎么感知环境的？",
              "options": [
                "鼻子闻",
                "摄像头和传感器",
                "猜的",
                "问人"
              ],
              "correct": 1,
              "explanation": "AI 机器人通过摄像头（视觉）、麦克风（听觉）和各种传感器来感知周围环境。"
            }
          ],
          "discussion": [
            "你想要一个什么样的机器人？",
            "如果机器人什么都能做，人还能做什么？"
          ],
            "guides": ["如果你的宠物会说话，它可能会说：今天我想吃肉！外面那只狗好讨厌！主人你今天回来好晚……我想出去玩！你摸我的时候好舒服！", "给动物加 AI 是个有趣的设想！比如：自动喂食器根据宠物的体重和活动量调整食量，智能项圈监测健康数据，甚至 AI 翻译器让宠物说话。但目前这些还只是概念。"],
          "activity": {
            "title": "机器人设计师",
            "description": "设计你的梦想机器人",
            "steps": [
              "画一个你梦想中的机器人",
              "它长什么样？",
              "它能做什么？",
              "它用什么 AI 技术？",
              "给它取个名字",
              "向家人介绍你的设计"
            ]
          ,
            "resources": [{"icon": "🐾", "title": "宠物 AI 应用畅想", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>智能喂食器</b>根据体重自动喂食</div><div class=\"template-item\"><b>健康监测</b>追踪运动和心率</div><div class=\"template-item\"><b>AI 翻译器</b>理解宠物说话</div><div class=\"template-item\"><b>自动逗猫器</b>陪宠物玩耍</div></div>"}, {"icon": "📝", "title": "笔记模板：宠物 AI 畅想", "content": "<div class=\"note-lines\"><div class=\"note-line\">我的宠物（或想养的）：________________</div><div class=\"note-line\">如果它会说话，它会说：________________</div><div class=\"note-line\">我想给它设计的 AI 功能：________________</div></div>"}]}
        },
        {
          "id": 25,
          "number": "25",
          "title": "AI + 自动驾驶",
          "duration": "8-10分钟",
          "objective": "了解无人驾驶的原理、进展和挑战",
          "sections": [
            {
              "type": "text",
              "title": "什么是自动驾驶",
              "content": "自动驾驶不是科幻，而是正在发生的技术变革。"
            },
            {
              "type": "image",
              "title": "AI + 自动驾驶",
              "content": "ai-self-driving"
            },
            {
              "type": "text",
              "title": "自动驾驶三步走",
              "content": "<b>感知</b>：摄像头、激光雷达、毫米波雷达——“看”周围环境<br><b>决策</b>：AI 算法分析信息，做出驾驶判断<br><b>控制</b>：执行转向、加速、刹车等操作"
            },
            {
              "type": "case",
              "title": "案例：Waymo 无人驾驶出租车",
              "content": "在旧金山，Waymo 的无人驾驶出租车已经运营了好几年。<br><br>乘客通过手机叫车，一辆没有司机的车会来接你。<br><br>它能识别红绿灯、避让行人、在复杂路口做出正确判断。"
            },
            {
              "type": "text",
              "title": "伦理困境：电车难题",
              "content": "如果自动驾驶汽车必须在撞一个行人和撞一群行人之间选择，它应该怎么选？<br><br>这不是科幻，而是自动驾驶必须面对的真实伦理问题。"
            },
            {
              "type": "image",
              "title": "自动驾驶传感器",
              "content": "self-driving-sensors"
            },
            {
              "type": "image",
              "title": "自动驾驶决策",
              "content": "self-driving-decision"
            }
          ],
          "quiz": [
            {
              "question": "自动驾驶汽车靠什么“看”路？",
              "options": [
                "司机的耳朵",
                "摄像头、激光雷达等传感器",
                "问路人",
                "猜的"
              ],
              "correct": 1,
              "explanation": "自动驾驶汽车通过多种传感器（摄像头、激光雷达、毫米波雷达等）来感知周围环境。"
            },
            {
              "question": "电车难题是什么？",
              "options": [
                "坐电车",
                "自动驾驶的伦理困境",
                "电池技术",
                "交通规则"
              ],
              "correct": 1,
              "explanation": "电车难题是自动驾驶面临的伦理问题——当事故不可避免时，AI 应该选择伤害谁？"
            },
            {
              "question": "自动驾驶目前最大的挑战是什么？",
              "options": [
                "汽车太贵",
                "技术、法规和伦理问题",
                "没有人想坐",
                "道路太窄"
              ],
              "correct": 1,
              "explanation": "自动驾驶面临技术（极端天气、复杂路况）、法规（事故责任）和伦理（电车难题）等多重挑战。"
            }
          ],
          "discussion": [
            "你敢坐无人驾驶的车吗？为什么？",
            "你觉得自动驾驶什么时候会普及？"
          ],
            "guides": ["AI 生成艺术和人类艺术的区别：1.AI 是根据训练数据组合，人类是真正创造；2.AI 没有情感，作品缺少灵魂；3.AI 可以快速大量生成，人类需要时间沉淀。", "争议点包括：1. AI 画的画算不算艺术？2. 如果 AI 能画得和人一样好，画家还有价值吗？3. AI 学习人类画作算不算抄袭？这些问题目前没有标准答案。"],
          "activity": {
            "title": "自动驾驶模拟",
            "description": "思考自动驾驶的决策",
            "steps": [
              "画一个十字路口",
              "画几辆车和几个行人",
              "如果你是 AI，你会怎么决定谁先走？",
              "如果必须选择撞一个人还是撞一群人，你怎么选？",
              "讨论：这个问题有正确答案吗？"
            ]
          ,
            "resources": [{"icon": "🎨", "title": "AI 艺术创作方式", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>文字生成图片</b>描述 - 画作</div><div class=\"template-item\"><b>风格迁移</b>把照片变成名画风格</div><div class=\"template-item\"><b>音乐生成</b>描述情绪 - 音乐</div><div class=\"template-item\"><b>视频生成</b>文字 - 动画</div></div>"}, {"icon": "📝", "title": "笔记模板：AI 艺术思考", "content": "<div class=\"note-lines\"><div class=\"note-line\">我让 AI 画的画：________________</div><div class=\"note-line\">我觉得好看吗？好看/一般/不好看</div><div class=\"note-line\">AI 画的算\"艺术\"吗？算/不算</div></div>"}]}
        },
        {
          "id": 26,
          "number": "26",
          "title": "AI + 游戏",
          "duration": "8-10分钟",
          "objective": "了解 AI 在游戏中的应用，从对手到创造者",
          "sections": [
            {
              "type": "text",
              "title": "AI 打游戏的目的",
              "content": "AI 打游戏不是为了娱乐，而是为了研究和训练。"
            },
            {
              "type": "image",
              "title": "AI + 游戏",
              "content": "ai-games"
            },
            {
              "type": "case",
              "title": "故事：AlphaGo vs 李世石",
              "content": "2016年，DeepMind 的 AlphaGo 击败围棋世界冠军李世石，比分 4:1。<br><br>围棋的可能走法比宇宙中的原子还多，AI 不可能靠穷举来下棋，而是用“直觉”——通过训练学会判断局面好坏。"
            },
            {
              "type": "highlight",
              "title": "AI 在游戏中的角色",
              "content": "<b>智能对手</b>：越来越聪明的 AI 敌人<br><b>内容生成</b>：AI 生成地图、关卡、任务<br><b>玩家分析</b>：分析玩家习惯，优化游戏设计<br><b>反作弊</b>：检测和防止作弊行为"
            },
            {
              "type": "text",
              "title": "从游戏到现实",
              "content": "AI 在游戏中学到的能力，可以应用到现实世界：<br>• 在《星际争霸》中学会的策略思维 → 供应链优化<br>• 在《Minecraft》中学会的建造 → 机器人协作<br>• 在围棋中学会的决策 → 金融交易"
            },
            {
              "type": "image",
              "title": "游戏AI决策树",
              "content": "game-ai-decision"
            },
            {
              "type": "image",
              "title": "强化学习玩游戏",
              "content": "rl-gaming"
            }
          ],
          "quiz": [
            {
              "question": "AlphaGo 击败李世石说明了什么？",
              "options": [
                "AI 比人聪明",
                "AI 能在复杂博弈中做出最优决策",
                "围棋很简单",
                "李世石状态不好"
              ],
              "correct": 1,
              "explanation": "围棋的复杂度极高，AlphaGo 的胜利说明 AI 已经能在非常复杂的决策问题上做出超越人类的判断。"
            },
            {
              "question": "AI 为什么被用来打游戏？",
              "options": [
                "AI 喜欢玩游戏",
                "游戏是测试 AI 能力的好平台",
                "AI 想赢",
                "游戏公司有钱"
              ],
              "correct": 1,
              "explanation": "游戏规则明确、反馈即时、可以反复尝试，是测试和训练 AI 能力的理想环境。"
            },
            {
              "question": "AI 在游戏中的应用不包括哪个？",
              "options": [
                "智能对手",
                "生成游戏内容",
                "帮玩家代打",
                "防止作弊"
              ],
              "correct": 2,
              "explanation": "AI 在游戏中的应用包括智能对手、内容生成、玩家分析和反作弊，但“帮玩家代打”不是正当的应用场景。"
            }
          ],
          "discussion": [
            "AI 打游戏赢了人类，这重要吗？",
            "如果你能设计一个游戏 AI，你想让它做什么？"
          ],
            "guides": ["AI 可以帮你写代码、做网站、画图、写文章、做视频……但最重要的是：你要有想法，AI 帮你实现。就像你有了想法，工具帮你完成。", "未来可能需要的技能：1.提出好问题的能力；2.判断 AI 输出是否正确；3.创造性思维；4.与人沟通协作；5.情感和同理心——这些是 AI 短期内替代不了的。"],
          "activity": {
            "title": "AI 对手挑战",
            "description": "和 AI 对战",
            "steps": [
              "找一个有 AI 对手的游戏（围棋、国际象棋等）",
              "和 AI 对战3-5局",
              "记录你的胜负",
              "分析 AI 有哪些地方比你强",
              "讨论：AI 的优势在哪里？人的优势在哪里？"
            ]
          ,
            "resources": [{"icon": "🤝", "title": "人机协作模式图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>AI 做</b>重复工作、数据分析、快速生成</div><div class=\"template-item\"><b>人做</b>创造决策、情感交流、价值判断</div></div>"}, {"icon": "📝", "title": "笔记模板：未来技能", "content": "<div class=\"note-lines\"><div class=\"note-line\">AI 能做的：________________</div><div class=\"note-line\">AI 做不到的：________________</div><div class=\"note-line\">我需要学的技能：________________</div></div>"}]}
        },
        {
          "id": 27,
          "number": "27",
          "title": "AI + 天气预报",
          "duration": "8-10分钟",
          "objective": "了解 AI 如何改变天气预报",
          "sections": [
            {
              "type": "text",
              "title": "传统天气预报 vs AI 天气预报",
              "content": "传统方法：用物理方程模拟大气运动，需要超级计算机运行几个小时。<br><br>AI 方法：学习历史天气数据的规律，几秒钟就能出结果。"
            },
            {
              "type": "image",
              "title": "AI + 天气预报",
              "content": "ai-weather"
            },
            {
              "type": "highlight",
              "title": "AI 天气预报的优势",
              "content": "• <b>速度</b>：几秒钟出结果，传统方法需要几小时<br>• <b>准确</b>：某些方面比传统方法更准<br>• <b>极端天气</b>：能更好地预测极端天气事件<br>• <b>成本</b>：计算成本更低"
            },
            {
              "type": "case",
              "title": "案例：Google DeepMind 的 GenCast",
              "content": "2024年发布的 GenCast，能预测15天天气，比传统方法更准。<br><br>它特别擅长预测台风路径和极端天气事件。<br><br>这能帮助人们提前做好准备，减少灾害损失。"
            },
            {
              "type": "text",
              "title": "天气预报对生活的影响",
              "content": "• 农民知道什么时候种、什么时候收<br>• 航空公司决定航班是否起飞<br>• 城市提前准备暴雨、台风<br>• 普通人决定带不带伞"
            },
            {
              "type": "image",
              "title": "气象数据采集",
              "content": "weather-data"
            },
            {
              "type": "image",
              "title": "AI天气预测模型",
              "content": "weather-ai-model"
            }
          ],
          "quiz": [
            {
              "question": "AI 天气预报最大的优势是什么？",
              "options": [
                "更便宜",
                "速度快且某些方面更准",
                "更简单",
                "更有趣"
              ],
              "correct": 1,
              "explanation": "AI 天气预报的最大优势是速度快（几秒 vs 几小时）且在某些方面比传统方法更准确。"
            },
            {
              "question": "AI 天气预报是怎么工作的？",
              "options": [
                "问气象局",
                "学习历史天气数据的规律",
                "看云彩",
                "猜的"
              ],
              "correct": 1,
              "explanation": "AI 天气预报通过学习大量历史天气数据，找出天气变化的规律，然后用来预测未来的天气。"
            },
            {
              "question": "准确的天气预报对谁最有帮助？",
              "options": [
                "只对普通人",
                "农民、航空公司、城市管理者等很多人都需要",
                "只对科学家",
                "只对运动员"
              ],
              "correct": 1,
              "explanation": "准确的天气预报对农业、航空、城市管理、防灾减灾等很多领域都有重要价值。"
            }
          ],
          "discussion": [
            "如果 AI 能100%预测天气，世界会怎么变？",
            "你觉得 AI 还能预测什么？"
          ],
            "guides": ["AI 大模型的特点：1.参数量巨大（几十亿甚至几千亿个）；2.训练数据海量（互联网上的文字）；3.能处理多种任务；4.越大不一定越好，还要看训练质量。", "小模型的优势：1.运行更快，手机就能用；2.更省电；3.在特定任务上可能比大模型更专业。未来趋势是大模型做通用，小模型做专用。"],
          "activity": {
            "title": "天气观察员",
            "description": "对比 AI 和实际天气",
            "steps": [
              "用 AI 天气工具预测未来三天的天气",
              "每天记录实际天气",
              "对比 AI 预测和实际天气",
              "计算 AI 预测的准确率",
              "讨论：AI 预测准不准？什么时候不准？"
            ]
          ,
            "resources": [{"icon": "📊", "title": "大模型 vs 小模型", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>大模型</b>参数多（百亿级）、通用能力强</div><div class=\"template-item\"><b>小模型</b>参数少（亿级）、特定任务专用</div></div>"}, {"icon": "📝", "title": "笔记模板：模型大小思考", "content": "<div class=\"note-lines\"><div class=\"note-line\">大模型最厉害的地方：________________</div><div class=\"note-line\">小模型最实用的地方：________________</div><div class=\"note-line\">如果只能选一个，我选：大模型/小模型</div></div>"}]}
        },
        {
          "id": 28,
          "number": "28",
          "title": "AI + 环境保护",
          "duration": "8-10分钟",
          "objective": "了解 AI 如何帮助保护环境",
          "sections": [
            {
              "type": "text",
              "title": "技术向善",
              "content": "AI 不只是商业工具，它也能帮助保护我们的地球。<br><br>从监测森林到保护海洋，AI 正在成为环保的得力助手。"
            },
            {
              "type": "image",
              "title": "AI + 环境保护",
              "content": "ai-environment"
            },
            {
              "type": "table",
              "title": "AI 环保应用",
              "content": [["应用领域","AI 做什么","实际效果"],["森林监测","卫星图像+AI识别","实时发现非法砍伐"],["海洋保护","声呐+AI分析","追踪鲸鱼迁徙路径"],["空气预测","传感器+AI建模","提前48小时预警污染"],["能源优化","智能电网+AI调度","减少20%电力浪费"]]
            },
            {
              "type": "case",
              "title": "案例：AI 帮助保护亚马逊雨林",
              "content": "AI 分析卫星图像，能发现非法砍伐行为。<br><br>实时警报系统让执法部门能及时赶到。<br><br>这项技术帮助减少了森林破坏。"
            },
            {
              "type": "highlight",
              "title": "AI 环保的核心价值",
              "content": "• <b>监测</b>：实时监控环境变化<br>• <b>预测</b>：提前预警灾害<br>• <b>优化</b>：减少资源浪费<br>• <b>分析</b>：找出问题根源"
            },
            {
              "type": "image",
              "title": "环境监测网络",
              "content": "env-monitoring"
            },
            {
              "type": "image",
              "title": "碳排放追踪",
              "content": "carbon-tracking"
            }
          ],
          "quiz": [
            {
              "question": "AI 如何帮助保护森林？",
              "options": [
                "种树",
                "分析卫星图像发现非法砍伐",
                "赶走伐木工",
                "给树浇水"
              ],
              "correct": 1,
              "explanation": "AI 通过分析卫星图像，能实时发现非法砍伐行为，并发出警报让执法部门及时赶到。"
            },
            {
              "question": "AI 在环保中最大的价值是什么？",
              "options": [
                "更便宜",
                "实时监测和预测",
                "更简单",
                "更有趣"
              ],
              "correct": 1,
              "explanation": "AI 在环保中最大的价值是实时监测和预测——它能24小时不间断地监控环境变化，提前预警灾害。"
            },
            {
              "question": "如果你用 AI 做一个环保项目，你会做什么？",
              "options": [
                "用 AI 生成环保海报",
                "用 AI 分析社区的垃圾分类情况",
                "用 AI 替代所有环保工作者",
                "用 AI 制造更多产品"
              ],
              "correct": 1,
              "explanation": "用 AI 分析社区的垃圾分类情况是一个可行的环保项目——通过数据分析找出问题，提出改进建议。"
            }
          ],
          "discussion": [
            "你觉得 AI 对环保最大的贡献是什么？",
            "如果你用 AI 做一个环保项目，你会做什么？"
          ],
            "guides": ["AI 有偏见是因为：1.训练数据有偏见（比如历史数据中女性工程师少，AI 就认为工程师都是男性）；2.设计者的价值观影响；3.数据不均衡。", "比如：1.招聘 AI 可能歧视女性；2.面部识别对深色皮肤准确率低；3.贷款 AI 可能对某些地区的人更严格。解决方法是：更多样化的数据、更透明的算法、更多人的监督。"],
          "activity": {
            "title": "AI 环保侦探",
            "description": "用 AI 分析环境问题",
            "steps": [
              "选一个你关心的环境问题（如垃圾、水资源等）",
              "用 AI 工具搜索相关信息",
              "让 AI 帮你分析这个问题的原因和解决方案",
              "讨论：AI 的分析有道理吗？你能做什么？"
            ]
          ,
            "resources": [{"icon": "⚠️", "title": "AI 偏见来源图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>数据偏见</b>训练数据不均衡</div><div class=\"template-item\"><b>设计偏见</b>设计者价值观影响</div><div class=\"template-item\"><b>历史偏见</b>历史数据反映旧观念</div><div class=\"template-item\"><b>标签偏见</b>标注者主观判断</div></div>"}, {"icon": "📝", "title": "笔记模板：偏见发现", "content": "<div class=\"note-lines\"><div class=\"note-line\">我发现的 AI 偏见：________________</div><div class=\"note-line\">这个偏见可能来自：________________</div><div class=\"note-line\">怎么解决？________________</div></div>"}]}
        },
        {
          "id": 29,
          "number": "29",
          "title": "AI + 安全",
          "duration": "8-10分钟",
          "objective": "了解 AI 时代的安全挑战",
          "sections": [
            {
              "type": "text",
              "title": "AI 带来便利，也带来风险",
              "content": "AI 时代有新的安全挑战——深度伪造、网络攻击、隐私泄露。<br><br>了解这些风险，才能更好地保护自己。"
            },
            {
              "type": "image",
              "title": "AI + 安全",
              "content": "ai-security"
            },
            {
              "type": "case",
              "title": "案例：深度伪造",
              "content": "2024年，有人用 AI 伪装成公司 CEO 的声音，骗走了2500万美元。<br><br>深度伪造可以生成逼真的假视频、假音频，让人难以分辨真假。<br><br>这不是科幻，而是正在发生的真实威胁。"
            },
            {
              "type": "highlight",
              "title": "AI 安全的两大挑战",
              "content": "<b>深度伪造</b>：假视频、假音频、假图片<br>• 假新闻：用 AI 生成假的名人讲话<br>• 诈骗：伪装成亲友的声音<br><b>网络安全</b>：AI 被用于攻击<br>• 自动发现系统漏洞<br>• 生成钓鱼邮件"
            },
            {
              "type": "text",
              "title": "如何保护自己",
              "content": "• 看到视频不要轻易相信，检查细节<br>• 用 AI 检测 AI：技术对抗<br>• 保持怀疑：不轻信陌生信息<br>• 保护隐私：不随意分享个人信息<br>• 多源验证：从多个渠道确认信息"
            },
            {
              "type": "image",
              "title": "网络安全防护",
              "content": "cybersecurity"
            },
            {
              "type": "image",
              "title": "AI防御系统",
              "content": "ai-defense"
            }
          ],
          "quiz": [
            {
              "question": "深度伪造是什么？",
              "options": [
                "很深的假货",
                "用 AI 生成的逼真假视频、假音频",
                "一种加密技术",
                "一种网络协议"
              ],
              "correct": 1,
              "explanation": "深度伪造是用 AI 技术生成的逼真假视频、假音频或假图片，看起来像真的，但其实是伪造的。"
            },
            {
              "question": "如何识别深度伪造？",
              "options": [
                "用肉眼看",
                "检查不自然的细节，用 AI 工具检测",
                "问发布者",
                "不看视频"
              ],
              "correct": 1,
              "explanation": "识别深度伪造需要检查不自然的细节（如眨眼频率、嘴角动作），并使用专门的 AI 检测工具。"
            },
            {
              "question": "面对 AI 时代的安全挑战，最重要的态度是什么？",
              "options": [
                "完全不用 AI",
                "保持怀疑和警惕",
                "相信所有信息",
                "不关心"
              ],
              "correct": 1,
              "explanation": "最重要的态度是保持怀疑和警惕——不轻易相信看到的信息，学会验证，保护好个人隐私。"
            }
          ],
          "discussion": [
            "如果你收到一段视频但不确定是不是真的，你会怎么做？",
            "你觉得应该怎么保护自己的隐私？"
          ],
            "guides": ["AI 伦理的核心问题：1.公平性——AI 不能歧视任何人；2.透明性——AI 的决策要能解释；3.隐私——不能随意收集个人数据；4.责任——出错了谁负责？", "普通人能做的：1.了解 AI 的局限性；2.保护个人隐私；3.对 AI 的决策保持质疑；4.参与公共讨论；5.支持负责任的 AI 发展。"],
          "activity": {
            "title": "真假鉴定师",
            "description": "识别 AI 生成的内容",
            "steps": [
              "找一些 AI 生成的图片或视频案例",
              "尝试判断哪些是真的，哪些是 AI 生成的",
              "记录你的判断依据",
              "讨论：你是怎么判断的？准不准？"
            ]
          ,
            "resources": [{"icon": "⚖️", "title": "AI 伦理四大原则", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>公平性</b>不能歧视任何人</div><div class=\"template-item\"><b>透明性</b>决策要能解释</div><div class=\"template-item\"><b>隐私保护</b>不能随意收集数据</div><div class=\"template-item\"><b>责任明确</b>出错谁负责</div></div>"}, {"icon": "📝", "title": "笔记模板：AI 伦理讨论", "content": "<div class=\"note-lines\"><div class=\"note-line\">最重要的伦理问题：________________</div><div class=\"note-line\">如果我是 AI 公司老板：________________</div><div class=\"note-line\">作为用户，我能做什么：________________</div></div>"}]}
        },
        {
          "id": 30,
          "number": "30",
          "title": "未来的职业",
          "duration": "10-12分钟",
          "objective": "思考 AI 时代的未来职业",
          "sections": [
            {
              "type": "text",
              "title": "AI 会改变工作",
              "content": "AI 不是来抢工作的，而是来改变工作方式的。<br><br>有些工作会消失，有些新工作会出现，所有工作都会改变。"
            },
            {
              "type": "image",
              "title": "未来的职业",
              "content": "future-careers"
            },
            {
              "type": "table",
              "title": "AI 可能替代的工作",
              "content": [["工作类型","被替代的风险","原因"],["数据录入","高","重复、规则明确"],["流水线操作","高","标准化、可编程"],["客服问答","中高","简单问答可自动化"],["翻译校对","中","AI翻译质量提升"],["创意设计","低","需要人类审美和创意"]]
            },
            {
              "type": "highlight",
              "title": "AI 创造的新职业",
              "content": "• <b>AI 训练师</b>：教 AI 学东西<br>• <b>提示工程师</b>：设计和 AI 对话的技巧<br>• <b>AI 伦理专家</b>：确保 AI 用得对<br>• <b>人机协作专家</b>：设计人和 AI 合作的流程<br>• <b>数据标注师</b>：为 AI 准备训练数据"
            },
            {
              "type": "text",
              "title": "AI 时代最重要的能力",
              "content": "• <b>提问能力</b>：能问出好问题，才能用好 AI<br>• <b>批判性思维</b>：AI 说什么都信就完了<br>• <b>创造力</b>：AI 能生成，但创造新东西还是靠人<br>• <b>情感智能</b>：AI 没有情感，人和人的连接更重要<br>• <b>学习能力</b>：技术变化快，要不断学新东西"
            },
            {
              "type": "image",
              "title": "AI新职业",
              "content": "ai-new-jobs"
            },
            {
              "type": "image",
              "title": "人机协作",
              "content": "human-ai-collab"
            }
          ],
          "quiz": [
            {
              "question": "以下哪个是 AI 时代可能出现的新职业？",
              "options": [
                "数据录入员",
                "提示工程师",
                "收银员",
                "流水线工人"
              ],
              "correct": 1,
              "explanation": "提示工程师是 AI 时代的新职业——专门设计和优化与 AI 对话的提示词，让 AI 给出更好的结果。"
            },
            {
              "question": "AI 时代最重要的能力是什么？",
              "options": [
                "打字速度",
                "学习能力和批判性思维",
                "体力",
                "记忆力"
              ],
              "correct": 1,
              "explanation": "AI 时代最重要的能力是学习能力和批判性思维——因为技术变化快，需要不断学习新东西，同时能判断 AI 的输出是否正确。"
            },
            {
              "question": "AI 会完全替代人类工作吗？",
              "options": [
                "会",
                "不会，但会改变工作方式",
                "只替代蓝领",
                "只替代白领"
              ],
              "correct": 1,
              "explanation": "AI 不会完全替代人类工作，但会改变工作方式。有些工作会消失，有些新工作会出现，所有工作都会和 AI 协作。"
            }
          ],
          "discussion": [
            "你觉得你以后的工作会是什么样？",
            "有什么工作是 AI 永远做不了的？"
          ],
            "guides": ["现在能做的：1.学会用 AI 工具（如 ChatGPT）；2.理解 AI 的能力边界；3.培养批判性思维；4.保持好奇心和学习能力。", "未来最需要的能力：1.提出好问题；2.判断信息真伪；3.创造性思维；4.情感交流；5.跨学科整合。这些是 AI 做不好的，也是人类最宝贵的能力。"],
          "activity": {
            "title": "未来职业画像",
            "description": "想象20年后的工作",
            "steps": [
              "想象20年后自己在做什么工作",
              "画出来或写出来",
              "这份工作需要什么技能？",
              "AI 在其中扮演什么角色？",
              "你现在可以学什么来为未来做准备？"
            ]
          ,
            "resources": [{"icon": "🚀", "title": "未来准备清单", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>学会用 AI</b>掌握基本工具</div><div class=\"template-item\"><b>批判思维</b>判断信息真伪</div><div class=\"template-item\"><b>创造力</b>AI 做不到的</div><div class=\"template-item\"><b>持续学习</b>跟上时代变化</div></div>"}, {"icon": "📝", "title": "笔记模板：我的 AI 未来", "content": "<div class=\"note-lines\"><div class=\"note-line\">2030年的我可能会：________________</div><div class=\"note-line\">AI 会改变我的：________________</div><div class=\"note-line\">我最期待的是：________________</div></div>"}]}
        }
      ]
    },
    {
      "id": 5,
      "title": "青少年真实榜样",
      "description": "看看同龄人怎么用 AI 做事，建立信心和行动力。从公益到创业，从编程到创造。",
      "color": "#ec4899",
      "icon": "⭐",
      "episodes": [
        {
          "id": 31,
          "number": "31",
          "title": "用 AI 做公益的少年",
          "duration": "8-10分钟",
          "objective": "看到青少年用 AI 解决社会问题的真实案例",
          "sections": [
            {
              "type": "case",
              "title": "案例1：帮助视障人士的中学生",
              "content": "一个15岁的美国中学生，爷爷是视障人士。她发现爷爷用手机很不方便。<br><br>于是她用 AI 图像识别技术，开发了一个 APP，能告诉视障人士眼前是什么、文字写了什么。<br><br>免费发布，帮助了很多人。"
            },
            {
              "type": "image",
              "title": "用 AI 做公益的少年",
              "content": "youth-ai-good"
            },
            {
              "type": "case",
              "title": "案例2：监测水质的中国少年",
              "content": "一个14岁的中国学生，住在河边。发现河水有时变浑浊，但不知道原因。<br><br>她在学校科学课上学了数据分析，用简单传感器收集水质数据，用 AI 分析数据，找出污染规律。<br><br>报告给环保部门。"
            },
            {
              "type": "case",
              "title": "案例3：减少食物浪费的团队",
              "content": "几个高中生发现学校食堂每天扔掉很多食物。<br><br>他们用 AI 分析每天的用餐人数和食物消耗，预测第二天需要做多少菜。<br><br>减少了30%的食物浪费。"
            },
            {
              "type": "highlight",
              "title": "这些案例的共同点",
              "content": "• 好的 AI 项目来自<b>真实的痛点</b><br>• 不需要是专家，中学生也能做<br>• AI + 公益 = 有意义的行动<br>• 从身边的小问题开始"
            },
            {
              "type": "image",
              "title": "公益AI项目",
              "content": "ai-for-good"
            },
            {
              "type": "image",
              "title": "社区影响力",
              "content": "community-impact"
            }
          ],
          "quiz": [
            {
              "question": "这些公益 AI 项目的共同特点是什么？",
              "options": [
                "都很复杂",
                "来自真实的痛点，解决实际问题",
                "都需要很多钱",
                "都是大公司做的"
              ],
              "correct": 1,
              "explanation": "这些项目的共同特点是它们都来自真实的问题——解决视障人士的困难、监测水质、减少食物浪费。"
            },
            {
              "question": "如果你想用 AI 做一件好事，第一步应该做什么？",
              "options": [
                "买最好的电脑",
                "找到一个真实的问题",
                "学最复杂的编程",
                "找很多钱"
              ],
              "correct": 1,
              "explanation": "好的项目从真实的问题开始。先找到一个你想解决的问题，再想 AI 能怎么帮忙。"
            },
            {
              "question": "这些少年做项目时最大的困难是什么？",
              "options": [
                "没有电脑",
                "技术不够",
                "找到问题和坚持执行",
                "没有时间"
              ],
              "correct": 2,
              "explanation": "最大的困难往往不是技术，而是找到真正值得解决的问题，并坚持执行下去。"
            }
          ],
          "discussion": [
            "这些案例中你最被哪个打动？",
            "如果让你用 AI 做一件好事，你会做什么？"
          ],
            "guides": ["2024年 AI 新闻可能包括：1.更聪明的聊天机器人；2. AI 生成视频更逼真；3. AI 在医疗、教育等领域应用更多；4.各国 AI 监管政策出台。", "2025年预测：1. AI 助手更普及；2. AI 创作工具更强大；3. AI 安全和伦理讨论更多；4. AI 可能在某些专业领域达到人类水平。"],
          "activity": {
            "title": "AI 公益头脑风暴",
            "description": "想一个 AI 公益项目",
            "steps": [
              "列出你身边的问题（至少5个）",
              "用评估表选出最好的3个",
              "为每个问题想一个 AI 解决方案",
              "选一个最有感觉的，写下项目计划",
              "和家人讨论这个计划"
            ]
          ,
            "resources": [{"icon": "📰", "title": "AI 新闻跟踪表", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>时间</b>____</div><div class=\"template-item\"><b>事件</b>____</div><div class=\"template-item\"><b>影响</b>____</div><div class=\"template-item\"><b>我的看法</b>____</div></div>"}, {"icon": "📝", "title": "笔记模板：AI 新闻记录", "content": "<div class=\"note-lines\"><div class=\"note-line\">新闻标题：________________</div><div class=\"note-line\">主要内容：________________</div><div class=\"note-line\">对我的影响：________________</div></div>"}]}
        },
        {
          "id": 32,
          "number": "32",
          "title": "编程少年的 AI 项目",
          "duration": "8-10分钟",
          "objective": "了解从小写代码的孩子们做了什么",
          "sections": [
            {
              "type": "case",
              "title": "案例1：8岁开始编程的女孩",
              "content": "一个8岁的女孩，在学校学了 Scratch 编程。她喜欢小动物，想帮助流浪猫。<br><br>用 Scratch 做了一个“流浪猫助手”小程序，能记录每只猫的名字、位置和健康状况，帮助社区志愿者更好地照顾流浪猫。"
            },
            {
              "type": "image",
              "title": "编程少年的 AI 项目",
              "content": "youth-coder"
            },
            {
              "type": "case",
              "title": "案例2：用 Python 分析篮球的初中生",
              "content": "一个13岁的初中生，自学 Python。他喜欢打篮球，想分析自己的投篮数据。<br><br>用手机录下投篮视频，用 AI 分析投篮姿势，给出改进建议。"
            },
            {
              "type": "case",
              "title": "案例3：参加 AI 比赛的高中生团队",
              "content": "几个高中生组队参加全国 AI 比赛，用 AI 识别校园里的垃圾分类。<br><br>帮助学校提高垃圾分类准确率，获得了全国一等奖。"
            },
            {
              "type": "table",
              "title": "编程学习路径建议",
              "content": [["年龄","推荐工具","学习重点"],["6-8岁","Scratch Jr、Blockly","逻辑思维、动画游戏"],["9-12岁","Scratch、Python基础","项目实践、算法入门"],["13-15岁","Python、JavaScript","数据分析、网页开发"],["16+岁","Python进阶、AI框架","机器学习、深度学习"]]
            },
            {
              "type": "image",
              "title": "编程学习路径",
              "content": "coding-path"
            },
            {
              "type": "image",
              "title": "AI项目架构",
              "content": "ai-project-arch"
            }
          ],
          "quiz": [
            {
              "question": "编程和 AI 有什么关系？",
              "options": [
                "没有关系",
                "编程是实现 AI 的工具",
                "AI 替代了编程",
                "编程更高级"
              ],
              "correct": 1,
              "explanation": "编程是实现 AI 的工具——AI 算法需要用编程语言来实现，学编程是学 AI 的基础。"
            },
            {
              "question": "最适合初学者的编程工具是什么？",
              "options": [
                "C++",
                "Scratch（图形化编程）",
                "汇编语言",
                "Java"
              ],
              "correct": 1,
              "explanation": "Scratch 是图形化编程工具，不需要打字，用拖拽积木块就能编程，最适合初学者。"
            },
            {
              "question": "学编程最重要的品质是什么？",
              "options": [
                "数学好",
                "坚持和好奇心",
                "打字快",
                "有钱"
              ],
              "correct": 1,
              "explanation": "学编程最重要的品质是坚持和好奇心——遇到 bug 不放弃，对解决问题充满兴趣。"
            }
          ],
          "discussion": [
            "你觉得编程难吗？看完这些案例，想法有变化吗？",
            "如果学编程，你想做什么项目？"
          ],
            "guides": ["AI 家教的好处：1.随时可以问问题；2.根据你的水平调整难度；3.不会不耐烦；4.能同时教很多学生。但缺点是：1.不能替代老师的关心；2.可能给错答案；3.缺少同学间的互动。", "好的 AI 家教应该：1.能准确理解问题；2.用你能懂的方式解释；3.知道你的弱点并重点帮助；4.鼓励你思考而不是直接给答案。"],
          "activity": {
            "title": "我的第一个 AI 项目",
            "description": "从简单开始",
            "steps": [
              "如果没接触过编程，下载 Scratch，做一个简单的互动故事",
              "如果有基础，试试用 Python 做一个简单的数据分析",
              "记录遇到的问题和解决方法",
              "完成一个小项目，哪怕很简陋",
              "分享给家人看"
            ]
          ,
            "resources": [{"icon": "📚", "title": "AI 家教功能图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>诊断</b>找到知识漏洞</div><div class=\"template-item\"><b>讲解</b>用你能懂的方式</div><div class=\"template-item\"><b>练习</b>出适合你的题</div><div class=\"template-item\"><b>反馈</b>实时告诉你对错</div></div>"}, {"icon": "📝", "title": "笔记模板：AI 家教体验", "content": "<div class=\"note-lines\"><div class=\"note-line\">我问 AI 的问题：________________</div><div class=\"note-line\">AI 讲解得清楚吗？清楚/不清楚</div><div class=\"note-line\">比真人老师好的地方：________________</div></div>"}]}
        },
        {
          "id": 33,
          "number": "33",
          "title": "14 岁的 AI 创业者",
          "duration": "8-10分钟",
          "objective": "了解年轻人怎么把 AI 变成产品",
          "sections": [
            {
              "type": "case",
              "title": "案例：用 AI 帮助学习的少年",
              "content": "一个14岁的男孩，学习英语很痛苦。他发现背单词很枯燥。<br><br>用 AI 生成个性化的单词卡片，根据他的记忆曲线安排复习。做成了一个 APP，给同学用。后来发展成一个小型创业项目。"
            },
            {
              "type": "image",
              "title": "14 岁的 AI 创业者",
              "content": "young-entrepreneur"
            },
            {
              "type": "highlight",
              "title": "创业思维的核心",
              "content": "<b>痛点</b>：发现一个真实的问题<br><b>方案</b>：用 AI 想到解决办法<br><b>行动</b>：做出来，给人用<br><b>反馈</b>：听取意见，不断改进"
            },
            {
              "type": "text",
              "title": "年轻人创业的优势",
              "content": "• 更了解同龄人的需求<br>• 更敢于尝试新事物<br>• 没有思维定式，更容易接受新想法<br>• 学习能力强，适应快"
            },
            {
              "type": "text",
              "title": "从0到1的路径",
              "content": "1. 发现兴趣：你对 AI 的哪个方面最感兴趣？<br>2. 动手尝试：找一个简单的工具开始<br>3. 做出东西：哪怕是一个小项目<br>4. 分享反馈：给别人看，听取意见<br>5. 迭代改进：不断优化，做得更好"
            },
            {
              "type": "image",
              "title": "创业流程",
              "content": "startup-flow"
            },
            {
              "type": "image",
              "title": "青少年创业",
              "content": "teen-startup"
            }
          ],
          "quiz": [
            {
              "question": "创业最重要的第一步是什么？",
              "options": [
                "找很多钱",
                "发现一个真实的问题",
                "注册公司",
                "雇很多人"
              ],
              "correct": 1,
              "explanation": "创业最重要的第一步是发现真实的问题——所有成功的创业都从解决一个具体痛点开始。"
            },
            {
              "question": "年轻人创业的优势是什么？",
              "options": [
                "经验多",
                "更了解同龄人需求，更敢于尝试",
                "钱多",
                "年纪大"
              ],
              "correct": 1,
              "explanation": "年轻人创业的优势在于更了解同龄人的需求，更敢于尝试新事物，没有思维定式，更容易接受新想法。"
            },
            {
              "question": "从想法到产品的关键是什么？",
              "options": [
                "想很久",
                "行动——做出来给人用",
                "等别人帮忙",
                "写计划书"
              ],
              "correct": 1,
              "explanation": "从想法到产品的关键是行动——先做出来给人用，再根据反馈改进，而不是一直停留在想的阶段。"
            }
          ],
          "discussion": [
            "你觉得创业需要什么条件？",
            "如果你要创业，你想做什么？"
          ],
            "guides": ["AI 作曲的方式：1.学习大量音乐作品的规律；2.分析旋律、节奏、和弦的模式；3.根据你的要求生成新曲子。但它缺少的是：真正的情感和灵感。", "音乐的灵魂来自人的情感和经历。AI 可以模仿风格，但很难创作出真正打动人心的作品。不过，AI 可以成为音乐人的好帮手，帮他们快速尝试不同的想法。"],
          "activity": {
            "title": "迷你创业计划",
            "description": "写一个一页纸的创业计划",
            "steps": [
              "写下你想解决的问题",
              "写下你的 AI 解决方案",
              "写下目标用户是谁",
              "写下第一步要做什么",
              "和家人讨论这个计划"
            ]
          ,
            "resources": [{"icon": "🎵", "title": "AI 作曲流程图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>1. 学习</b>听大量音乐</div><div class=\"template-item\"><b>2. 分析</b>找旋律规律</div><div class=\"template-item\"><b>3. 生成</b>按要求创作</div><div class=\"template-item\"><b>4. 调整</b>优化细节</div></div>"}, {"icon": "📝", "title": "笔记模板：AI 音乐实验", "content": "<div class=\"note-lines\"><div class=\"note-line\">我让 AI 写的音乐类型：________________</div><div class=\"note-line\">听起来像人写的吗？像/不像</div><div class=\"note-line\">最假的地方：________________</div></div>"}]}
        },
        {
          "id": 34,
          "number": "34",
          "title": "学校里的 AI 实验室",
          "duration": "8-10分钟",
          "objective": "了解世界各地学校怎么教 AI",
          "sections": [
            {
              "type": "table",
              "title": "国际 AI 教育案例",
              "content": [["国家/地区","做法","特色"],["芬兰","全民AI素养计划","从小学到大学全覆盖"],["美国","AI4K12倡议","制定中小学AI课程标准"],["中国","AI进入中小学课程","编程课成为必修"],["日本","AI伦理教育","从小培养AI道德意识"]]
            },
            {
              "type": "image",
              "title": "学校里的 AI 实验室",
              "content": "ai-lab-school"
            },
            {
              "type": "highlight",
              "title": "AI 教育的核心能力",
              "content": "<b>计算思维</b>：把问题拆解成步骤<br><b>创造力</b>：想出新的解决方案<br><b>批判性思维</b>：评估 AI 的能力边界<br><b>合作能力</b>：和他人一起完成项目<br><b>沟通能力</b>：表达自己的想法"
            },
            {
              "type": "text",
              "title": "AI 教育的趋势",
              "content": "• AI 课程越来越普及<br>• 从大学下沉到中小学<br>• 从选修课变成必修课<br>• 从理论走向实践"
            },
            {
              "type": "text",
              "title": "你可以做什么",
              "content": "• 在学校提议开设 AI 相关课程或社团<br>• 参加线上的 AI 学习项目<br>• 和同学组成学习小组<br>• 把学到的 AI 知识教给其他人"
            },
            {
              "type": "image",
              "title": "AI实验室设备",
              "content": "ai-lab-equipment"
            },
            {
              "type": "image",
              "title": "实验项目",
              "content": "lab-projects"
            }
          ],
          "quiz": [
            {
              "question": "AI 教育最重要的能力是什么？",
              "options": [
                "打字快",
                "计算思维和批判性思维",
                "数学好",
                "会画画"
              ],
              "correct": 1,
              "explanation": "AI 教育最重要的能力是计算思维（拆解问题）和批判性思维（评估 AI 的能力边界）。"
            },
            {
              "question": "芬兰的 AI 教育有什么特点？",
              "options": [
                "只教精英学生",
                "全民免费，简单有趣",
                "只教编程",
                "只在大学教"
              ],
              "correct": 1,
              "explanation": "芬兰的 AI 教育面向全民，简单有趣，不只教精英学生，而是让每个人都能接触和理解 AI。"
            },
            {
              "question": "如果你的学校没有 AI 课程，你可以怎么做？",
              "options": [
                "不管了",
                "自学或和同学组成学习小组",
                "转学",
                "抱怨"
              ],
              "correct": 1,
              "explanation": "如果没有 AI 课程，可以自学（网上有很多资源），或者和同学组成学习小组一起探索。"
            }
          ],
          "discussion": [
            "你学校有 AI 相关的课程或活动吗？",
            "你觉得理想的 AI 课堂应该是什么样的？"
          ],
            "guides": ["AI 和人类合作的例子：1.医生用 AI 辅助诊断；2.设计师用 AI 生成初稿；3.程序员用 AI 写代码；4.科学家用 AI 分析数据。关键是人做决定，AI 做工具。", "未来的理想模式是：AI 处理重复、计算、数据分析等工作，人类专注创造、决策、情感交流。就像汽车代替了步行，但没有代替旅行的意义。"],
          "activity": {
            "title": "AI 课程设计",
            "description": "设计一堂 AI 课",
            "steps": [
              "假设你要给同学上一堂 AI 课",
              "写下课程名称",
              "写下课程内容（3-5个要点）",
              "设计一个互动活动",
              "写下课程目标",
              "和家人分享你的设计"
            ]
          ,
            "resources": [{"icon": "🤝", "title": "人机协作案例图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>医生+AI</b>辅助诊断</div><div class=\"template-item\"><b>设计师+AI</b>生成初稿</div><div class=\"template-item\"><b>程序员+AI</b>写代码</div><div class=\"template-item\"><b>科学家+AI</b>分析数据</div></div>"}, {"icon": "📝", "title": "笔记模板：协作畅想", "content": "<div class=\"note-lines\"><div class=\"note-line\">我想和 AI 协作的事情：________________</div><div class=\"note-line\">我负责：________________</div><div class=\"note-line\">AI 负责：________________</div></div>"}]}
        },
        {
          "id": 35,
          "number": "35",
          "title": "你也可以",
          "duration": "10-12分钟",
          "objective": "从模仿到创造，建立行动的信心",
          "sections": [
            {
              "type": "text",
              "title": "回顾榜样故事",
              "content": "前面4集，我们看到了很多用 AI 做事的同龄人：<br><br>• 用 AI 做公益的少年<br>• 从小写代码的编程少年<br>• 14岁的 AI 创业者<br>• 学校里的 AI 实验室"
            },
            {
              "type": "image",
              "title": "你也可以",
              "content": "you-can-too"
            },
            {
              "type": "highlight",
              "title": "榜样的共同点",
              "content": "<b>好奇心</b>：对 AI 感兴趣，想了解更多<br><b>行动力</b>：不只是想想，而是真的去做<br><b>坚持</b>：遇到困难不放弃<br><b>分享</b>：把学到的教给别人"
            },
            {
              "type": "text",
              "title": "你和他们的共同点",
              "content": "你和他们一样，都是从好奇开始的。<br><br>他们不是天才，只是比别人早一步开始行动。<br><br>你现在就开始，一点都不晚。"
            },
            {
              "type": "text",
              "title": "行动比完美更重要",
              "content": "• 不要等到准备好了才开始——边做边学<br>• 不要怕犯错——每个错误都是学习机会<br>• 不要一个人闷头做——找同伴、找导师<br>• 不要追求完美——完成比完美更重要"
            },
            {
              "type": "image",
              "title": "AI学习工具箱",
              "content": "ai-toolkit"
            },
            {
              "type": "image",
              "title": "从好奇到行动",
              "content": "curiosity-to-action"
            }
          ],
          "quiz": [
            {
              "question": "榜样的共同点不包括哪个？",
              "options": [
                "好奇心",
                "行动力",
                "天赋异禀",
                "坚持"
              ],
              "correct": 2,
              "explanation": "榜样的共同点是好奇心、行动力和坚持，而不是天赋。他们只是比别人早一步开始行动。"
            },
            {
              "question": "面对 AI 学习，最重要的态度是什么？",
              "options": [
                "等到准备好了再开始",
                "先做起来，边做边学",
                "只看不练",
                "等别人教"
              ],
              "correct": 1,
              "explanation": "最重要的态度是先做起来——不要等到准备好了才开始，边做边学，犯错是最好的学习机会。"
            },
            {
              "question": "完成和完美哪个更重要？",
              "options": [
                "完美",
                "完成",
                "一样重要",
                "都不重要"
              ],
              "correct": 1,
              "explanation": "完成比完美更重要——一个粗糙的完成品比一个永远停留在计划阶段的完美构想有价值得多。"
            }
          ],
          "discussion": [
            "回顾前面的榜样，你最佩服谁？为什么？",
            "你现在最想尝试的是什么？"
          ],
            "guides": ["开源 AI 的好处：1.更多人能参与改进；2.透明度高，大家能检查代码；3.可以自由定制；4.促进学术研究。坏处是：可能被滥用；安全性更难保证。", "闭源 AI 的好处：1.公司能控制使用方式；2.安全性更好管理；3.能持续投入研发。坏处是：不够透明，公众难以监督。"],
          "activity": {
            "title": "我的 AI 学习宣言",
            "description": "写下你的行动承诺",
            "steps": [
              "写下你想用 AI 做什么（至少3件事）",
              "写下你不想用 AI 做什么（至少1件事）",
              "写下接下来一周要做的第一件事（越具体越好）",
              "把这张纸贴在书桌上",
              "一周后回来检查：你做到了吗？"
            ]
          ,
            "resources": [{"icon": "🔓", "title": "开源 vs 闭源对比", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>开源 AI</b>代码公开、可自由定制</div><div class=\"template-item\"><b>闭源 AI</b>代码保密、公司控制</div></div>"}, {"icon": "📝", "title": "笔记模板：开源思考", "content": "<div class=\"note-lines\"><div class=\"note-line\">开源的好处：________________</div><div class=\"note-line\">开源的风险：________________</div><div class=\"note-line\">我支持：开源/闭源/都要</div></div>"}]}
        }
      ]
    },
    {
      "id": 6,
      "title": "PBL 创造挑战",
      "description": "动手做一个自己的 AI 项目，从问题到方案到成果。这不是纸上谈兵，而是真的做出一个东西来。",
      "color": "#3b82f6",
      "icon": "🛠️",
      "episodes": [
        {
          "id": 36,
          "number": "36",
          "title": "发现一个真实问题",
          "duration": "10-12分钟",
          "objective": "从生活中找到值得用 AI 解决的问题",
          "sections": [
            {
              "type": "text",
              "title": "好项目来自真实问题",
              "content": "不要凭空想象问题，而是从自己的生活、学校、社区中找到真正困扰你的事。<br><br>问题要小而具体，不要大而空。"
            },
            {
              "type": "image",
              "title": "发现一个真实问题",
              "content": "find-problem"
            },
            {
              "type": "table",
              "title": "问题的三个来源",
              "content": [["来源","怎么找","举例"],["个人困扰","想想让你烦恼的事","背单词太枯燥"],["学校痛点","观察学校里不方便的地方","食堂排队太长"],["社区问题","留心身边人的需求","老人不会用手机挂号"]]
            },
            {
              "type": "highlight",
              "title": "好问题的标准",
              "content": "<b>具体</b>：能用一句话说清楚，不要含糊<br><b>可行</b>：在你的能力和资源范围内能做<br><b>真实</b>：真的有人受这个问题困扰<br><b>有趣</b>：你自己也想知道答案"
            },
            {
              "type": "text",
              "title": "坏问题长什么样",
              "content": "❌ 怎样让世界更美好<br>❌ 如何让所有人都幸福<br>❌ AI 是什么<br><br>这些太大、太模糊，你无法动手去做。好问题应该像“怎么减少学校食堂的食物浪费”这样——具体、可操作、有明确的场景。"
            },
            {
              "type": "image",
              "title": "问题分析方法",
              "content": "problem-analysis"
            },
            {
              "type": "image",
              "title": "需求调研",
              "content": "user-research"
            }
          ],
          "quiz": [
            {
              "question": "以下哪个是好问题？",
              "options": [
                "怎么让世界更美好",
                "怎么减少学校食堂的食物浪费",
                "AI 能做什么",
                "什么是人工智能"
              ],
              "correct": 1,
              "explanation": "好问题应该是具体的、可行的、真实的。"
            },
            {
              "question": "发现问题最好的方式是什么？",
              "options": [
                "坐在家里想",
                "观察自己的生活和周围环境",
                "问 AI",
                "看新闻"
              ],
              "correct": 1,
              "explanation": "最好的方式是观察自己的生活和周围环境——真实的问题就在你身边。"
            },
            {
              "question": "为什么问题要小而具体？",
              "options": [
                "小问题不重要",
                "小问题更容易着手解决",
                "大问题没有价值",
                "小问题更赚钱"
              ],
              "correct": 1,
              "explanation": "小而具体的问题更容易着手解决，而且解决小问题是学习的最好方式。等你有了经验，再挑战更大的问题。"
            }
          ],
          "discussion": [
            "你身边有什么让你觉得不方便的事？",
            "如果你能用 AI 改变一件事，你会选什么？"
          ],
            "guides": ["AI 看病的流程可能是：1.你描述症状；2. AI 分析可能的疾病；3.建议做哪些检查；4.根据检查结果给出诊断建议；5.医生最终确认。AI 是助手，医生是决策者。", "AI 诊断的优势：1.能同时考虑几千种疾病；2.不会因为疲劳出错；3.能快速查阅最新医学文献。但 AI 也需要医生的临床经验和对病人的整体了解。"],
          "activity": {
            "title": "问题头脑风暴",
            "description": "找到你要解决的问题",
            "steps": [
              "用10分钟写下你能想到的所有问题（至少10个）",
              "不用筛选，越多越好",
              "用评估表（具体性、可行性、真实性、AI相关性）选出最好的3个",
              "最终选一个，写下：这个问题困扰谁？AI 能怎么帮忙？"
            ]
          ,
            "resources": [{"icon": "🩺", "title": "AI 辅助诊断流程", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>1. 描述症状</b>告诉 AI 哪里不舒服</div><div class=\"template-item\"><b>2. AI 分析</b>可能的疾病</div><div class=\"template-item\"><b>3. 建议检查</b>做哪些检查</div><div class=\"template-item\"><b>4. 医生确认</b>最终诊断</div></div>"}, {"icon": "📝", "title": "笔记模板：AI 看病体验", "content": "<div class=\"note-lines\"><div class=\"note-line\">我描述的症状：________________</div><div class=\"note-line\">AI 说可能是什么病：________________</div><div class=\"note-line\">我会去看医生吗？会/不会</div></div>"}]}
        },
        {
          "id": 37,
          "number": "37",
          "title": "设计你的方案",
          "duration": "10-12分钟",
          "objective": "把问题转化为具体的方案",
          "sections": [
            {
              "type": "text",
              "title": "方案设计四步法",
              "content": "<b>第一步：明确目标</b>——我想做出什么？<br><b>第二步：选择工具</b>——用什么 AI 工具？<br><b>第三步：画流程图</b>——每一步做什么？<br><b>第四步：列出资源</b>——需要什么材料和帮助？"
            },
            {
              "type": "image",
              "title": "设计你的方案",
              "content": "design-solution"
            },
            {
              "type": "table",
              "title": "AI 工具推荐",
              "content": [["工具","用途","难度"],["ChatGPT","对话、写作、编程","⭐⭐"],["Scratch + AI","可视化AI项目","⭐"],["Teachable Machine","训练图像识别模型","⭐⭐"],["Hugging Face","体验各种AI模型","⭐⭐⭐"]]
            },
            {
              "type": "highlight",
              "title": "方案设计的关键",
              "content": "• 先做<b>最小可用版本</b>，再慢慢完善<br>• 用<b>最简单的工具</b>开始<br>• <b>不要追求完美</b>，做出来就行<br>• <b>边做边学</b>，遇到问题再找解决方案"
            },
            {
              "type": "text",
              "title": "案例：设计一个学习助手",
              "content": "问题：背单词太枯燥<br><br>方案：<br>1. 用 AI 生成个性化单词卡片<br>2. 根据记忆曲线安排复习<br>3. 做成简单的网页<br>4. 让朋友试用，收集反馈"
            },
            {
              "type": "image",
              "title": "方案设计",
              "content": "solution-design"
            },
            {
              "type": "image",
              "title": "思维导图",
              "content": "mind-map"
            }
          ],
          "quiz": [
            {
              "question": "方案设计的第一步是什么？",
              "options": [
                "选工具",
                "明确目标",
                "写代码",
                "找资金"
              ],
              "correct": 1,
              "explanation": "方案设计的第一步是明确目标——你要做出什么？它能帮谁解决什么问题？成功标准是什么？"
            },
            {
              "question": "为什么建议先做最小可用版本？",
              "options": [
                "因为省钱",
                "因为可以快速验证想法，再逐步完善",
                "因为做不了大的",
                "因为这是规定"
              ],
              "correct": 1,
              "explanation": "先做最小可用版本可以快速验证想法是否可行，然后再根据反馈逐步完善，避免浪费时间在不需要的功能上。"
            },
            {
              "question": "选择 AI 工具时最重要的考虑是什么？",
              "options": [
                "哪个最贵",
                "哪个最适合你的需求",
                "哪个最流行",
                "哪个名字最好听"
              ],
              "correct": 1,
              "explanation": "选择工具要根据你的具体需求——不同的工具擅长不同的事情，适合你的才是最好的。"
            }
          ],
          "discussion": [
            "你的方案够具体吗？能一步一步执行吗？",
            "如果遇到困难，有什么备选方案？"
          ],
            "guides": ["AI 未来可能改变的领域：1.教育（个性化学习）；2.医疗（精准诊断）；3.交通（自动驾驶）；4.工作（自动化生产）；5.生活（智能家居）。", "我们应该：1.保持学习，跟上时代；2.培养 AI 做不到的能力（创意、情感、判断）；3.了解 AI 的局限性；4.参与 AI 相关的公共讨论。"],
          "activity": {
            "title": "方案设计",
            "description": "写出你的项目方案",
            "steps": [
              "明确目标：我想做什么？帮谁解决什么问题？",
              "选择工具：用什么 AI 工具？",
              "画流程图：第一步、第二步、第三步做什么？",
              "列出资源：需要什么材料和帮助？",
              "写下时间计划：这周做什么？下周做什么？"
            ]
          ,
            "resources": [{"icon": "🔮", "title": "AI 未来改变预测", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>教育</b>个性化学习</div><div class=\"template-item\"><b>医疗</b>精准诊断</div><div class=\"template-item\"><b>交通</b>自动驾驶</div><div class=\"template-item\"><b>工作</b>自动化生产</div></div>"}, {"icon": "📝", "title": "笔记模板：未来畅想", "content": "<div class=\"note-lines\"><div class=\"note-line\">2030年我的生活会：________________</div><div class=\"note-line\">AI 会帮我做：________________</div><div class=\"note-line\">我最期待的是：________________</div></div>"}]}
        },
        {
          "id": 38,
          "number": "38",
          "title": "动手做原型",
          "duration": "10-15分钟",
          "objective": "用简单工具做出第一个版本",
          "sections": [
            {
              "type": "text",
              "title": "原型 = 第一版",
              "content": "原型不用完美——它是你想法的第一次实现。<br><br>就像画画的草稿、写文章的大纲，原型是粗糙的，但它让想法变成现实。"
            },
            {
              "type": "image",
              "title": "动手做原型",
              "content": "build-prototype"
            },
            {
              "type": "highlight",
              "title": "原型制作三原则",
              "content": "<b>1. 先做核心功能</b><br>不要一开始就想要什么都有，只做最重要的一个功能<br><br><b>2. 用最简单的工具</b><br>能用表格就不用代码，能用现成工具就自己不写<br><br><b>3. 快速迭代</b><br>做出来 → 给人试 → 听反馈 → 改进"
            },
            {
              "type": "case",
              "title": "不同项目的原型示例",
              "content": "<b>项目1：AI 学习助手</b><br>原型：用 ChatGPT 创建一个学习伙伴，写好提示词设定角色<br><br><b>项目2：班级数据分析</b><br>原型：用 Excel 收集和整理数据，用 AI 帮忙分析<br><br><b>项目3：AI 辅助创作</b><br>原型：用 AI 生成内容，自己修改完善"
            },
            {
              "type": "text",
              "title": "48小时原型挑战",
              "content": "规则：<br>• 不能花太多时间——48小时内必须完成<br>• 先做核心功能，不要追求完美<br>• 用最简单的工具<br>• 做完就给人试，不要藏着"
            },
            {
              "type": "image",
              "title": "原型工具",
              "content": "proto-tools"
            },
            {
              "type": "image",
              "title": "MVP构建",
              "content": "mvp-build"
            }
          ],
          "quiz": [
            {
              "question": "原型是什么？",
              "options": [
                "最终产品",
                "想法的第一次实现，不用完美",
                "计划书",
                "PPT"
              ],
              "correct": 1,
              "explanation": "原型是想法的第一次实现——它是粗糙的，但让想法变成现实。就像画画的草稿。"
            },
            {
              "question": "做原型时最重要的原则是什么？",
              "options": [
                "追求完美",
                "先做核心功能，快速迭代",
                "用最贵的工具",
                "花很多时间学习"
              ],
              "correct": 1,
              "explanation": "做原型最重要的原则是先做核心功能，快速迭代——先做出来，再根据反馈改进。"
            },
            {
              "question": "为什么原型要给真实用户试用？",
              "options": [
                "因为无聊",
                "因为需要真实反馈来改进",
                "因为要展示",
                "因为规定"
              ],
              "correct": 1,
              "explanation": "给真实用户试用能获得宝贵的反馈——你觉得好的地方可能用户觉得不好用，你觉得不重要的地方用户可能很在意。"
            }
          ],
          "discussion": [
            "你觉得你的原型应该从哪里开始做？",
            "做原型的过程中，你最担心什么？"
          ],
            "guides": ["AI 作画的进步：从最初的简单图案，到现在能生成照片级的真实图像。2022年 DALL-E、Midjourney 等工具让普通人也能用文字生成图片。", "AI 作画的争议：1.艺术家的版权问题；2. AI 作品算不算艺术；3.会不会让插画师失业；4. AI 学习人类画作是否算抄袭。"],
          "activity": {
            "title": "48小时原型挑战",
            "description": "在48小时内做出第一版",
            "steps": [
              "确定核心功能——只做最重要的一个",
              "选最简单的工具开始",
              "48小时内做出来",
              "找至少一个人试用",
              "记录反馈和遇到的问题",
              "写下下一步要改进的地方"
            ]
          ,
            "resources": [{"icon": "🖼️", "title": "AI 作画技术演进", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>早期</b>简单图案</div><div class=\"template-item\"><b>中期</b>风格模仿</div><div class=\"template-item\"><b>现在</b>照片级真实</div><div class=\"template-item\"><b>未来</b>视频生成</div></div>"}, {"icon": "📝", "title": "笔记模板：AI 作画实验", "content": "<div class=\"note-lines\"><div class=\"note-line\">我描述的画面：________________</div><div class=\"note-line\">AI 画出来了吗？画出来了/画得不像</div><div class=\"note-line\">和我想的一样吗？一样/不一样</div></div>"}]}
        },
        {
          "id": 39,
          "number": "39",
          "title": "测试和改进",
          "duration": "10-12分钟",
          "objective": "让朋友试用，收集反馈，迭代优化",
          "sections": [
            {
              "type": "text",
              "title": "测试不是考试",
              "content": "测试不是来证明你的项目有多好，而是来发现问题、学习改进。<br><br>每一个 bug、每一条差评，都是改进的机会。"
            },
            {
              "type": "image",
              "title": "测试和改进",
              "content": "test-improve"
            },
            {
              "type": "highlight",
              "title": "反馈是礼物",
              "content": "• <b>不要害怕批评</b>：批评意味着对方认真用了<br>• <b>问具体的问题</b>：不要问“你觉得怎么样”，要问“哪里不好用”<br>• <b>记录所有反馈</b>：哪怕很小的问题也要记下来<br>• <b>感谢每一个试用者</b>：他们帮你发现了你自己看不到的问题"
            },
            {
              "type": "text",
              "title": "改进的优先级",
              "content": "• <b>高优先级</b>：核心功能有问题（AI 回答完全不对）<br>• <b>中优先级</b>：用户体验不好（界面太复杂）<br>• <b>低优先级</b>：锦上添花（加个好看的背景）<br><br>先改高优先级的问题，再处理其他的。"
            },
            {
              "type": "text",
              "title": "迭代循环",
              "content": "原型 → 测试 → 反馈 → 分析 → 改进 → 再测试<br><br>这个循环可以转很多轮。每转一圈，你的项目就更好一点。"
            },
            {
              "type": "image",
              "title": "测试方法",
              "content": "testing-methods"
            },
            {
              "type": "image",
              "title": "迭代改进",
              "content": "iteration-improve"
            }
          ],
          "quiz": [
            {
              "question": "收到反馈时，最好的态度是什么？",
              "options": [
                "辩解",
                "先听，再分析，感谢对方",
                "生气",
                "不理"
              ],
              "correct": 1,
              "explanation": "最好的态度是先听，再分析，感谢对方——每一条反馈都是改进的机会。"
            },
            {
              "question": "改进时应该优先处理什么？",
              "options": [
                "好看的设计",
                "核心功能的问题",
                "小细节",
                "所有问题一起改"
              ],
              "correct": 1,
              "explanation": "应该优先处理核心功能的问题——如果核心功能不对，其他改进都没有意义。"
            },
            {
              "question": "为什么要让多个人试用？",
              "options": [
                "为了显示很多人喜欢",
                "因为不同的人会发现不同的问题",
                "因为无聊",
                "因为规定"
              ],
              "correct": 1,
              "explanation": "不同的人有不同的使用习惯和视角，能让多个人试用可以发现更多不同类型的问题。"
            }
          ],
          "discussion": [
            "你收到的反馈中，最让你意外的是什么？",
            "你觉得哪个改进最值得做？"
          ],
            "guides": ["AI 的局限性包括：1.不能真正理解（只是统计规律）；2.会编造信息（幻觉）；3.缺少常识；4.不能处理全新情况；5.需要大量数据和算力。", "未来 AI 可能的发展方向：1.更少的数据就能学习；2.更好的可解释性；3.更强的推理能力；4.更安全可控。但真正的通用人工智能可能还需要很长时间。"],
          "activity": {
            "title": "反馈收集日",
            "description": "收集真实反馈",
            "steps": [
              "找3个不同的人试用你的项目",
              "每人至少10分钟",
              "观察他们怎么用，记录卡住的地方",
              "问具体的问题：哪里不好用？哪里不清楚？",
              "整理反馈，按优先级排序",
              "决定先改什么"
            ]
          ,
            "resources": [{"icon": "🔍", "title": "AI 局限性清单", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>不能真正理解</b>只是统计规律</div><div class=\"template-item\"><b>会编造信息</b>产生幻觉</div><div class=\"template-item\"><b>缺少常识</b>容易犯低级错误</div><div class=\"template-item\"><b>需要大量数据</b>学习成本高</div></div>"}, {"icon": "📝", "title": "笔记模板：AI 局限发现", "content": "<div class=\"note-lines\"><div class=\"note-line\">我发现 AI 最大的局限：________________</div><div class=\"note-line\">具体例子：________________</div><div class=\"note-line\">我怎么避免这个问题：________________</div></div>"}]}
        },
        {
          "id": 40,
          "number": "40",
          "title": "展示你的作品",
          "duration": "15分钟",
          "objective": "做一个展示，回顾整个学习旅程",
          "sections": [
            {
              "type": "text",
              "title": "展示不是炫耀",
              "content": "展示是分享你的学习过程和成果。<br><br>别人看到的不只是你做出来的东西，更是你思考、尝试、犯错、改进的过程。"
            },
            {
              "type": "image",
              "title": "展示你的作品",
              "content": "showcase-work"
            },
            {
              "type": "highlight",
              "title": "展示的四个部分",
              "content": "<b>1. 项目介绍</b>：你解决了什么问题？<br><b>2. 过程回顾</b>：你是怎么做的？遇到了什么困难？<br><b>3. 成果展示</b>：做出来的东西长什么样？<br><b>4. 反思和收获</b>：你学到了什么？"
            },
            {
              "type": "text",
              "title": "学习旅程回顾",
              "content": "在这40集里，你：<br><br>• 了解了 AI 是什么、怎么工作<br>• 理解了 AI 的核心概念<br>• 听了 AI 领域的传奇故事<br>• 看了 AI 在各行业的应用<br>• 认识了用 AI 做事的同龄人<br>• 动手做了一个自己的项目"
            },
            {
              "type": "text",
              "title": "这不是结束",
              "content": "这只是开始。你已经学会了用 AI 看世界，接下来就是用 AI 创造世界。<br><br>保持好奇，保持学习，保持行动。<br><br>未来是你的。"
            },
            {
              "type": "image",
              "title": "展示技巧",
              "content": "presentation-skills"
            },
            {
              "type": "image",
              "title": "项目总结",
              "content": "project-summary"
            }
          ],
          "quiz": [
            {
              "question": "展示最重要的部分是什么？",
              "options": [
                "PPT 做得好看",
                "展示你的思考和学习过程",
                "说很多话",
                "用很多图片"
              ],
              "correct": 1,
              "explanation": "展示最重要的不是结果有多完美，而是展示你的思考过程——你是怎么发现问题、尝试解决、遇到困难、改进方案的。"
            },
            {
              "question": "完成这40集课程后，最重要的下一步是什么？",
              "options": [
                "结束了不用学了",
                "继续探索和实践",
                "等别人来教你",
                "忘记所有内容"
              ],
              "correct": 1,
              "explanation": "课程结束不是终点，而是新的起点。继续探索你感兴趣的 AI 领域，动手实践，不断学习。"
            },
            {
              "question": "你在这门课中最大的收获是什么？",
              "options": [
                "记住了很多知识点",
                "学会了用 AI 思考和解决问题",
                "认识了很多人",
                "得到了很多分数"
              ],
              "correct": 1,
              "explanation": "最大的收获应该是思维方式的改变——学会了用 AI 的视角看问题，用动手实践来学习。"
            }
          ],
          "discussion": [
            "回顾整个学习过程，你最骄傲的是什么？",
            "如果给这40集打分，你会打几分？"
          ],
            "guides": ["这40集让你了解了：AI 是什么、怎么学习、能做什么、有什么局限、有哪些应用、未来会怎样。最重要的是：你要学会和 AI 共处。", "你可以想想：1. AI 最让你惊讶的是什么？2. 你最想用 AI 做什么？3. 你觉得 AI 最需要改进的是什么？把答案写下来，这可能就是你未来的方向。"],
          "activity": {
            "title": "结业仪式",
            "description": "回顾和展望",
            "steps": [
              "做一个简单的展示（口头或书面）",
              "写下你在这门课中学到的3件最重要的事",
              "写下你接下来想探索的 AI 主题",
              "制作一个学习旅程回顾（视频、海报或文字都行）",
              "和家人一起庆祝完成课程！"
            ]
          ,
            "resources": [{"icon": "🎓", "title": "40集学习总结图", "content": "<div class=\"template-grid\"><div class=\"template-item\"><b>AI 是什么</b>让机器变聪明的技术</div><div class=\"template-item\"><b>怎么学习</b>从数据中找规律</div><div class=\"template-item\"><b>能做什么</b>看、听、说、判断</div><div class=\"template-item\"><b>未来怎样</b>人机协作新时代</div></div>"}, {"icon": "📝", "title": "笔记模板：毕业宣言", "content": "<div class=\"note-lines\"><div class=\"note-line\">这40集我学到了：________________</div><div class=\"note-line\">最让我惊讶的是：________________</div><div class=\"note-line\">我最想用 AI 做：________________</div><div class=\"note-line\" style=\"min-height:2rem\">我的 AI 毕业宣言：________________</div></div>"}]}
        }
      ]
    }
  ]
};