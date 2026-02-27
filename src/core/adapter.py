"""
游戏适配器基类和管理器

定义游戏适配器的接口和通用实现。
"""

from abc import ABC, abstractmethod
from typing import Dict, Optional, Callable, Any
from enum import Enum, auto
import logging


class ConnectionState(Enum):
    """连接状态"""
    DISCONNECTED = auto()
    CONNECTING = auto()
    HANDSHAKING = auto()
    LOGIN = auto()
    PLAY = auto()


class GameAdapter(ABC):
    """
    游戏适配器抽象基类
    
    所有游戏适配器必须继承此类并实现抽象方法。
    """
    
    def __init__(self, name: str, version: str):
        self.name = name
        self.version = version
        self.logger = logging.getLogger(f"{__name__}.{name}")
        
        self.state = ConnectionState.DISCONNECTED
        self.connected_players: Dict[str, Any] = {}
        self.on_event: Optional[Callable] = None
        
    @abstractmethod
    async def initialize(self) -> None:
        """初始化适配器"""
        pass
        
    @abstractmethod
    async def shutdown(self) -> None:
        """关闭适配器"""
        pass
        
    @abstractmethod
    async def tick(self) -> None:
        """每帧更新"""
        pass
        
    @abstractmethod
    async def connect_player(self, player_id: str, **kwargs) -> bool:
        """
        连接玩家
        
        Args:
            player_id: 玩家唯一标识
            **kwargs: 额外参数
            
        Returns:
            是否连接成功
        """
        pass
        
    @abstractmethod
    async def disconnect_player(self, player_id: str, reason: str = "") -> None:
        """断开玩家连接"""
        pass
        
    @abstractmethod
    async def send_message(self, player_id: str, message: str) -> None:
        """发送聊天消息"""
        pass
        
    @abstractmethod
    async def broadcast_message(self, message: str, exclude: Optional[list] = None) -> None:
        """广播消息"""
        pass
        
    @abstractmethod
    async def teleport_player(self, player_id: str, x: float, y: float, z: float) -> None:
        """传送玩家"""
        pass
        
    @abstractmethod
    async def set_block(self, x: int, y: int, z: int, block_type: str) -> None:
        """设置方块"""
        pass
        
    @abstractmethod
    async def get_block(self, x: int, y: int, z: int) -> str:
        """获取方块类型"""
        pass
        
    def emit_event(self, event_type: str, data: dict) -> None:
        """发送事件到核心服务器"""
        if self.on_event:
            self.on_event(event_type, data)
            
    def is_connected(self) -> bool:
        """检查是否已连接"""
        return self.state == ConnectionState.PLAY


class AdapterManager:
    """适配器管理器"""
    
    def __init__(self):
        self.adapters: Dict[str, GameAdapter] = {}
        self.logger = logging.getLogger(__name__)
        
    def register(self, name: str, adapter: GameAdapter) -> None:
        """注册适配器"""
        if name in self.adapters:
            self.logger.warning(f"适配器 {name} 已存在，将被覆盖")
        self.adapters[name] = adapter
        
    def get(self, name: str) -> Optional[GameAdapter]:
        """获取适配器"""
        return self.adapters.get(name)
        
    def unregister(self, name: str) -> None:
        """注销适配器"""
        if name in self.adapters:
            del self.adapters[name]
            
    def list_adapters(self) -> list:
        """列出所有适配器"""
        return list(self.adapters.keys())
