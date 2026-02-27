# 贡献指南

感谢您对 BlockConnect 项目的关注！我们欢迎各种形式的贡献。

## 如何贡献

### 报告问题

如果您发现了 bug 或有功能建议，请通过 GitHub Issues 提交：

1. 检查是否已有相关 issue
2. 创建新 issue，提供详细信息：
   - 问题描述
   - 复现步骤
   - 预期行为
   - 实际行为
   - 环境信息（Python版本、操作系统等）

### 提交代码

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码规范

- 遵循 PEP 8 规范
- 使用类型注解
- 编写单元测试
- 更新相关文档

### 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/StarsailsClover/BlockConnect.git
cd BlockConnect

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate  # Windows

# 安装开发依赖
pip install -r requirements.txt
pip install pytest black flake8 mypy

# 运行测试
pytest tests/

# 代码格式化
black src tests

# 代码检查
flake8 src tests
mypy src
```

## 项目结构

```
BlockConnect/
├── src/              # 源代码
├── tests/            # 测试代码
├── docs/             # 文档
├── examples/         # 示例代码
└── tools/            # 开发工具
```

## 联系方式

- GitHub Issues: [https://github.com/StarsailsClover/BlockConnect/issues](https://github.com/StarsailsClover/BlockConnect/issues)
- Email: SailsHuang@gmail.com

## 行为准则

- 尊重所有参与者
- 欢迎新手，耐心指导
- 专注于建设性讨论
- 接受不同观点

再次感谢您的贡献！
