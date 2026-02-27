"""
BlockConnect 核心模块

提供游戏互联的核心功能，包括连接管理、事件系统和状态同步。
"""

from .server import BlockConnectServer
from .adapter import GameAdapter, AdapterManager
from .events import EventBus, Event, EventType
from .state import GameState, StateManager

__all__ = [
    'BlockConnectServer',
    'GameAdapter',
    'AdapterManager',
    'EventBus',
    'Event',
    'EventType',
    'GameState',
    'StateManager',
]
