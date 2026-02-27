# 快速开始指南

## 安装

### 环境要求

- Python 3.9+
- pip 包管理器

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/StarsailsClover/BlockConnect.git
cd BlockConnect
```

2. 安装依赖
```bash
pip install -r requirements.txt
```

3. 验证安装
```bash
python -c "from src.core import BlockConnectServer; print('安装成功')"
```

## 基础使用

### 1. 创建最小服务器

```python
import asyncio
from src.core import BlockConnectServer, ServerConfig
from src.adapters import MinecraftAdapter

async def main():
    # 配置服务器
    config = ServerConfig(
        host="0.0.0.0",
        port=25565,
        max_connections=100
    )
    
    # 创建服务器
    server = BlockConnectServer(config)
    
    # 添加 Minecraft 适配器
    mc_adapter = MinecraftAdapter(
        server_address="localhost",
        server_port=25565
    )
    server.register_adapter("minecraft", mc_adapter)
    
    # 启动服务器
    await server.start()
    
    # 保持运行
    try:
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        await server.stop()

if __name__ == "__main__":
    asyncio.run(main())
```

### 2. 运行示例

```bash
python examples/minimal_example.py
```

## 配置服务器

### 使用配置文件

创建 `config.yaml`:

```yaml
server:
  host: "0.0.0.0"
  port: 25565
  max_connections: 100
  tick_rate: 20
  enable_encryption: true
  debug_mode: false

adapters:
  minecraft:
    enabled: true
    settings:
      server_address: "localhost"
      server_port: 25565
      version: "1.20.6"

logging:
  level: "INFO"
  log_to_file: true
  log_dir: "logs"
```

加载配置:

```python
from src.utils import Config

config = Config("config.yaml")
server = BlockConnectServer(config.server)
```

## 事件处理

### 监听玩家连接

```python
def on_player_connect(event):
    print(f"玩家连接: {event.data['player_id']}")

server.event_bus.on(EventType.PLAYER_CONNECT, on_player_connect)
```

### 监听聊天消息

```python
def on_chat(event):
    message = event.data['message']
    player = event.data['player_id']
    print(f"[{player}] {message}")

server.event_bus.on(EventType.PLAYER_CHAT, on_chat)
```

## 开发自定义适配器

### 基础适配器模板

```python
from src.core import GameAdapter, ConnectionState
from src.core.events import EventType

class MyGameAdapter(GameAdapter):
    def __init__(self, server_host, server_port):
        super().__init__("my_game", "1.0.0")
        self.server_host = server_host
        self.server_port = server_port
    
    async def initialize(self):
        # 连接游戏服务器
        pass
    
    async def connect_player(self, player_id, **kwargs):
        # 实现玩家连接
        self.connected_players[player_id] = {...}
        self.emit_event(EventType.PLAYER_CONNECT, {
            "player_id": player_id
        })
        return True
    
    async def send_message(self, player_id, message):
        # 发送聊天消息
        pass
    
    # ... 实现其他方法
```

### 注册自定义适配器

```python
my_adapter = MyGameAdapter("game.example.com", 12345)
server.register_adapter("my_game", my_adapter)
```

## 常见问题

### Q: 连接失败怎么办？

A: 检查以下几点：
1. 目标服务器地址和端口是否正确
2. 防火墙是否允许连接
3. 游戏版本是否匹配

### Q: 如何调试？

A: 启用调试模式：
```python
config = ServerConfig(debug_mode=True)
```

### Q: 支持哪些 Minecraft 版本？

A: 当前主要支持 Minecraft Java 1.20.6，Bedrock 版本正在开发中。

## 下一步

- 阅读 [API 文档](../api/README.md)
- 查看 [适配器开发指南](adapter-development.md)
- 了解 [协议规范](protocol-spec.md)
