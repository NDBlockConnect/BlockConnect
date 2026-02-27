"""
事件系统

实现发布-订阅模式的事件总线。
"""

from typing import Dict, List, Callable, Any
from enum import Enum, auto
from dataclasses import dataclass
import asyncio


class EventType(Enum):
    """事件类型"""
    # 连接事件
    PLAYER_CONNECT = auto()
    PLAYER_DISCONNECT = auto()
    
    # 游戏事件
    PLAYER_MOVE = auto()
    PLAYER_CHAT = auto()
    PLAYER_ACTION = auto()
    
    # 方块事件
    BLOCK_PLACE = auto()
    BLOCK_BREAK = auto()
    BLOCK_CHANGE = auto()
    
    # 实体事件
    ENTITY_SPAWN = auto()
    ENTITY_DESPAWN = auto()
    ENTITY_MOVE = auto()
    
    # 系统事件
    SERVER_START = auto()
    SERVER_STOP = auto()
    ERROR = auto()


@dataclass
class Event:
    """事件数据类"""
    type: EventType
    source: str  # 来源适配器
    data: Dict[str, Any]
    timestamp: float


class EventBus:
    """事件总线"""
    
    def __init__(self):
        self._handlers: Dict[EventType, List[Callable]] = {event_type: [] for event_type in EventType}
        self._global_handlers: List[Callable] = []
        
    def on(self, event_type: EventType, handler: Callable[[Event], None]) -> None:
        """
        订阅事件
        
        Args:
            event_type: 事件类型
            handler: 事件处理函数
        """
        if event_type not in self._handlers:
            self._handlers[event_type] = []
        self._handlers[event_type].append(handler)
        
    def off(self, event_type: EventType, handler: Callable[[Event], None]) -> None:
        """取消订阅"""
        if event_type in self._handlers and handler in self._handlers[event_type]:
            self._handlers[event_type].remove(handler)
            
    def on_any(self, handler: Callable[[Event], None]) -> None:
        """订阅所有事件"""
        self._global_handlers.append(handler)
        
    def emit(self, event_type: EventType, data: Dict[str, Any], source: str = "system") -> None:
        """
        触发事件
        
        Args:
            event_type: 事件类型
            data: 事件数据
            source: 事件来源
        """
        import time
        event = Event(
            type=event_type,
            source=source,
            data=data,
            timestamp=time.time()
        )
        
        # 调用特定类型处理器
        handlers = self._handlers.get(event_type, [])
        for handler in handlers:
            try:
                if asyncio.iscoroutinefunction(handler):
                    asyncio.create_task(handler(event))
                else:
                    handler(event)
            except Exception as e:
                print(f"事件处理错误: {e}")
                
        # 调用全局处理器
        for handler in self._global_handlers:
            try:
                if asyncio.iscoroutinefunction(handler):
                    asyncio.create_task(handler(event))
                else:
                    handler(event)
            except Exception as e:
                print(f"全局事件处理错误: {e}")
