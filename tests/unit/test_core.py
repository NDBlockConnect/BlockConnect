"""
核心模块单元测试
"""

import pytest
import asyncio
from unittest.mock import Mock, AsyncMock

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

from core import BlockConnectServer, ServerConfig, GameAdapter, ConnectionState
from core.events import EventBus, EventType, Event


class TestServerConfig:
    """测试服务器配置"""
    
    def test_default_config(self):
        config = ServerConfig()
        assert config.host == "0.0.0.0"
        assert config.port == 25565
        assert config.max_connections == 100
        assert config.tick_rate == 20
        assert config.enable_encryption is True
        assert config.debug_mode is False
    
    def test_custom_config(self):
        config = ServerConfig(
            host="127.0.0.1",
            port=25566,
            max_connections=50,
            debug_mode=True
        )
        assert config.host == "127.0.0.1"
        assert config.port == 25566
        assert config.max_connections == 50
        assert config.debug_mode is True


class TestEventBus:
    """测试事件总线"""
    
    def test_event_subscribe(self):
        bus = EventBus()
        handler = Mock()
        
        bus.on(EventType.PLAYER_CONNECT, handler)
        bus.emit(EventType.PLAYER_CONNECT, {"player_id": "test"})
        
        handler.assert_called_once()
    
    def test_event_unsubscribe(self):
        bus = EventBus()
        handler = Mock()
        
        bus.on(EventType.PLAYER_CONNECT, handler)
        bus.off(EventType.PLAYER_CONNECT, handler)
        bus.emit(EventType.PLAYER_CONNECT, {"player_id": "test"})
        
        handler.assert_not_called()
    
    def test_global_handler(self):
        bus = EventBus()
        handler = Mock()
        
        bus.on_any(handler)
        bus.emit(EventType.PLAYER_CHAT, {"message": "hello"})
        
        handler.assert_called_once()


class MockAdapter(GameAdapter):
    """测试用适配器"""
    
    def __init__(self):
        super().__init__("mock", "1.0.0")
        self.initialize_called = False
        self.shutdown_called = False
        self.tick_called = False
    
    async def initialize(self):
        self.initialize_called = True
    
    async def shutdown(self):
        self.shutdown_called = True
    
    async def tick(self):
        self.tick_called = True
    
    async def connect_player(self, player_id, **kwargs):
        self.connected_players[player_id] = {}
        return True
    
    async def disconnect_player(self, player_id, reason=""):
        if player_id in self.connected_players:
            del self.connected_players[player_id]
    
    async def send_message(self, player_id, message):
        pass
    
    async def broadcast_message(self, message, exclude=None):
        pass
    
    async def teleport_player(self, player_id, x, y, z):
        pass
    
    async def set_block(self, x, y, z, block_type):
        pass
    
    async def get_block(self, x, y, z):
        return "mock:air"


class TestBlockConnectServer:
    """测试 BlockConnect 服务器"""
    
    @pytest.mark.asyncio
    async def test_register_adapter(self):
        server = BlockConnectServer()
        adapter = MockAdapter()
        
        server.register_adapter("test", adapter)
        
        assert server.get_adapter("test") == adapter
    
    @pytest.mark.asyncio
    async def test_adapter_initialization(self):
        server = BlockConnectServer()
        adapter = MockAdapter()
        
        server.register_adapter("test", adapter)
        await server.start()
        
        assert adapter.initialize_called is True
        
        await server.stop()
    
    @pytest.mark.asyncio
    async def test_adapter_shutdown(self):
        server = BlockConnectServer()
        adapter = MockAdapter()
        
        server.register_adapter("test", adapter)
        await server.start()
        await server.stop()
        
        assert adapter.shutdown_called is True


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
