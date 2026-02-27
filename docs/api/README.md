# BlockConnect API 文档

## 核心 API

### BlockConnectServer

主服务器类，管理所有游戏连接。

```python
from src.core import BlockConnectServer, ServerConfig

config = ServerConfig(
    host="0.0.0.0",
    port=25565,
    max_connections=100,
    tick_rate=20
)

server = BlockConnectServer(config)
```

#### 方法

##### `register_adapter(name: str, adapter: GameAdapter)`

注册游戏适配器。

**参数：**
- `name`: 适配器名称
- `adapter`: 适配器实例

**示例：**
```python
from src.adapters import MinecraftAdapter

mc_adapter = MinecraftAdapter("localhost", 25565)
server.register_adapter("minecraft", mc_adapter)
```

##### `start() -> None`

启动服务器。

```python
await server.start()
```

##### `stop() -> None`

停止服务器。

```python
await server.stop()
```

##### `get_adapter(name: str) -> Optional[GameAdapter]`

获取指定适配器。

```python
adapter = server.get_adapter("minecraft")
```

---

### GameAdapter

游戏适配器基类，所有游戏适配器必须继承此类。

```python
from src.core import GameAdapter

class MyAdapter(GameAdapter):
    def __init__(self):
        super().__init__("my_game", "1.0.0")
```

#### 抽象方法

##### `initialize() -> None`

初始化适配器，建立游戏连接。

##### `shutdown() -> None`

关闭适配器，清理资源。

##### `tick() -> None`

每帧更新，处理游戏逻辑。

##### `connect_player(player_id: str, **kwargs) -> bool`

连接玩家到游戏。

**参数：**
- `player_id`: 玩家唯一标识
- `**kwargs`: 额外参数（如 username）

**返回：**
- `bool`: 是否连接成功

##### `disconnect_player(player_id: str, reason: str = "") -> None`

断开玩家连接。

##### `send_message(player_id: str, message: str) -> None`

发送聊天消息给指定玩家。

##### `broadcast_message(message: str, exclude: Optional[list] = None) -> None`

广播消息给所有玩家。

##### `teleport_player(player_id: str, x: float, y: float, z: float) -> None`

传送玩家到指定位置。

##### `set_block(x: int, y: int, z: int, block_type: str) -> None`

设置指定位置的方块。

##### `get_block(x: int, y: int, z: int) -> str`

获取指定位置的方块类型。

---

### EventBus

事件总线，用于组件间通信。

```python
from src.core import EventBus, EventType

event_bus = EventBus()
```

#### 方法

##### `on(event_type: EventType, handler: Callable)`

订阅事件。

```python
def on_connect(event):
    print(f"玩家连接: {event.data}")

event_bus.on(EventType.PLAYER_CONNECT, on_connect)
```

##### `off(event_type: EventType, handler: Callable)`

取消订阅。

##### `on_any(handler: Callable)`

订阅所有事件。

##### `emit(event_type: EventType, data: dict, source: str = "system")`

触发事件。

---

### ProtocolTranslator

协议翻译器，处理不同游戏协议间的转换。

```python
from src.protocol import ProtocolTranslator, GameProtocol

translator = ProtocolTranslator()
```

#### 方法

##### `translate_packet(source, target, packet_id, payload) -> Optional[bytes]`

翻译数据包。

##### `translate_block(source_block, source, target) -> str`

翻译方块类型。

##### `translate_position(x, y, z, source, target) -> tuple`

翻译坐标位置。

##### `add_block_mapping(source_block, target_block)`

添加方块映射。

---

## 工具 API

### Config

配置管理器。

```python
from src.utils import Config

config = Config("config.yaml")
```

#### 方法

##### `load(path: str) -> None`

从文件加载配置。

##### `save(path: Optional[str] = None) -> None`

保存配置到文件。

##### `get(key: str, default: Any = None) -> Any`

获取配置值。

```python
host = config.get("server.host", "localhost")
```

##### `set(key: str, value: Any) -> None`

设置配置值。

---

### CryptoManager

加密管理器。

```python
from src.utils import CryptoManager

crypto = CryptoManager()
```

#### 方法

##### `generate_fernet_key() -> bytes`

生成 Fernet 密钥。

##### `encrypt_fernet(data: bytes) -> bytes`

Fernet 加密。

##### `decrypt_fernet(data: bytes) -> bytes`

Fernet 解密。

##### `generate_rsa_keys(key_size: int = 2048) -> Tuple[bytes, bytes]`

生成 RSA 密钥对。

---

## 事件类型

### EventType

```python
from src.core.events import EventType

# 连接事件
EventType.PLAYER_CONNECT
EventType.PLAYER_DISCONNECT

# 游戏事件
EventType.PLAYER_MOVE
EventType.PLAYER_CHAT
EventType.PLAYER_ACTION

# 方块事件
EventType.BLOCK_PLACE
EventType.BLOCK_BREAK
EventType.BLOCK_CHANGE

# 实体事件
EventType.ENTITY_SPAWN
EventType.ENTITY_DESPAWN
EventType.ENTITY_MOVE

# 系统事件
EventType.SERVER_START
EventType.SERVER_STOP
EventType.ERROR
```

---

## 示例代码

### 完整服务器示例

```python
import asyncio
from src.core import BlockConnectServer, ServerConfig, EventType
from src.adapters import MinecraftAdapter
from src.utils import setup_logger

async def main():
    logger = setup_logger("Server")
    
    # 创建服务器
    config = ServerConfig(
        host="0.0.0.0",
        port=25565,
        debug_mode=True
    )
    server = BlockConnectServer(config)
    
    # 添加适配器
    mc = MinecraftAdapter("localhost", 25565)
    server.register_adapter("mc", mc)
    
    # 事件监听
    server.event_bus.on(EventType.PLAYER_CONNECT, 
                       lambda e: logger.info(f"连接: {e.data}"))
    server.event_bus.on(EventType.PLAYER_CHAT,
                       lambda e: logger.info(f"聊天: {e.data}"))
    
    # 启动
    await server.start()
    
    try:
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        await server.stop()

asyncio.run(main())
```
