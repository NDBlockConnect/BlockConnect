"""
BlockConnect 服务器核心

实现游戏互联的核心服务器功能。
"""

import asyncio
import logging
from typing import Dict, Optional, Type, Callable
from dataclasses import dataclass

from .adapter import GameAdapter, AdapterManager
from .events import EventBus, EventType
from .state import StateManager


@dataclass
class ServerConfig:
    """服务器配置"""
    host: str = "0.0.0.0"
    port: int = 25565
    max_connections: int = 100
    tick_rate: int = 20  # TPS
    enable_encryption: bool = True
    debug_mode: bool = False


class BlockConnectServer:
    """
    BlockConnect 主服务器类
    
    管理游戏适配器、处理连接、协调协议转换。
    """
    
    def __init__(self, config: Optional[ServerConfig] = None):
        self.config = config or ServerConfig()
        self.logger = logging.getLogger(__name__)
        
        # 核心组件
        self.event_bus = EventBus()
        self.adapter_manager = AdapterManager()
        self.state_manager = StateManager()
        
        # 运行状态
        self._running = False
        self._server = None
        self._tasks = set()
        
    def register_adapter(self, name: str, adapter: GameAdapter) -> None:
        """
        注册游戏适配器
        
        Args:
            name: 适配器名称
            adapter: 适配器实例
        """
        self.adapter_manager.register(name, adapter)
        self.logger.info(f"已注册适配器: {name}")
        
        # 绑定事件
        adapter.on_event = self._handle_adapter_event
        
    def _handle_adapter_event(self, event_type: EventType, data: dict):
        """处理适配器事件"""
        self.event_bus.emit(event_type, data)
        
    async def start(self) -> None:
        """启动服务器"""
        if self._running:
            self.logger.warning("服务器已在运行")
            return
            
        self._running = True
        self.logger.info(f"启动 BlockConnect 服务器: {self.config.host}:{self.config.port}")
        
        # 初始化所有适配器
        for name, adapter in self.adapter_manager.adapters.items():
            await adapter.initialize()
            self.logger.info(f"适配器 {name} 已初始化")
        
        # 启动主循环
        self._tasks.add(asyncio.create_task(self._main_loop()))
        
    async def stop(self) -> None:
        """停止服务器"""
        if not self._running:
            return
            
        self._running = False
        self.logger.info("正在停止服务器...")
        
        # 取消所有任务
        for task in self._tasks:
            task.cancel()
            
        # 关闭适配器
        for adapter in self.adapter_manager.adapters.values():
            await adapter.shutdown()
            
        self.logger.info("服务器已停止")
        
    async def _main_loop(self) -> None:
        """主游戏循环"""
        tick_interval = 1.0 / self.config.tick_rate
        
        while self._running:
            try:
                # 更新所有适配器
                for adapter in self.adapter_manager.adapters.values():
                    await adapter.tick()
                    
                # 同步游戏状态
                await self.state_manager.sync()
                
                await asyncio.sleep(tick_interval)
                
            except Exception as e:
                self.logger.error(f"主循环错误: {e}")
                
    def get_adapter(self, name: str) -> Optional[GameAdapter]:
        """获取指定适配器"""
        return self.adapter_manager.get(name)
