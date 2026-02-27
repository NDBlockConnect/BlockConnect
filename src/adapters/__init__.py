"""
游戏适配器模块

包含各种游戏的适配器实现。
"""

from .minecraft_adapter import MinecraftAdapter, MinecraftBedrockAdapter

__all__ = [
    'MinecraftAdapter',
    'MinecraftBedrockAdapter',
]
