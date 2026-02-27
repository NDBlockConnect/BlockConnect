"""
BlockConnect - 通用游戏互联框架

实现任意游戏与 Minecraft 的无缝互通联机。
"""

__version__ = "0.1.0"
__author__ = "StarsailsClover"
__license__ = "MIT"

from .core import BlockConnectServer, GameAdapter, ServerConfig
from .adapters import MinecraftAdapter, MinecraftBedrockAdapter

__all__ = [
    "BlockConnectServer",
    "GameAdapter",
    "ServerConfig",
    "MinecraftAdapter",
    "MinecraftBedrockAdapter",
]
