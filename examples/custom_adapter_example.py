"""
自定义适配器示例

展示如何为其他游戏创建自定义适配器。
"""

import asyncio
import sys
from pathlib import Path
from typing import Optional

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from core import BlockConnectServer, GameAdapter, ConnectionState
from core.events import EventType


class CustomGameAdapter(GameAdapter):
    """
    自定义游戏适配器示例
    
    这里可以实现任何游戏的适配逻辑。
    """
    
    def __init__(self, game_server: str, game_port: int):
        super().__init__("custom_game", "1.0.0")
        self.game_server = game_server
        self.game_port = game_port
        self._connected = False
        
    async def initialize(self) -> None:
        """初始化适配器"""
        self.logger.info(f"初始化自定义游戏适配器: {self.game_server}:{self.game_port}")
        # 这里可以建立连接、加载配置等
        
    async def shutdown(self) -> None:
        """关闭适配器"""
        self.logger.info("关闭自定义游戏适配器")
        self._connected = False
        
    async def tick(self) -> None:
        """每帧更新"""
        # 处理游戏逻辑更新
        pass
        
    async def connect_player(self, player_id: str, **kwargs) -> bool:
        """连接玩家"""
        self.logger.info(f"连接玩家: {player_id}")
        
        # 实现连接逻辑
        self.connected_players[player_id] = {
            "id": player_id,
            "name": kwargs.get("username", player_id)
        }
        
        self.state = ConnectionState.PLAY
        self._connected = True
        
        # 触发连接事件
        self.emit_event(EventType.PLAYER_CONNECT, {
            "player_id": player_id,
            "adapter": self.name
        })
        
        return True
        
    async def disconnect_player(self, player_id: str, reason: str = "") -> None:
        """断开玩家"""
        self.logger.info(f"断开玩家: {player_id}, 原因: {reason}")
        
        if player_id in self.connected_players:
            del self.connected_players[player_id]
            
        self.emit_event(EventType.PLAYER_DISCONNECT, {
            "player_id": player_id,
            "reason": reason
        })
        
    async def send_message(self, player_id: str, message: str) -> None:
        """发送消息"""
        self.logger.info(f"发送消息给 {player_id}: {message}")
        # 实现消息发送逻辑
        
    async def broadcast_message(self, message: str, exclude: Optional[list] = None) -> None:
        """广播消息"""
        self.logger.info(f"广播消息: {message}")
        for player_id in self.connected_players:
            if exclude and player_id in exclude:
                continue
            await self.send_message(player_id, message)
            
    async def teleport_player(self, player_id: str, x: float, y: float, z: float) -> None:
        """传送玩家"""
        self.logger.info(f"传送玩家 {player_id} 到 ({x}, {y}, {z})")
        # 实现传送逻辑
        
    async def set_block(self, x: int, y: int, z: int, block_type: str) -> None:
        """设置方块"""
        self.logger.info(f"设置方块 ({x}, {y}, {z}): {block_type}")
        # 实现方块设置逻辑
        
    async def get_block(self, x: int, y: int, z: int) -> str:
        """获取方块"""
        # 实现方块查询逻辑
        return "custom:air"


async def main():
    """主函数"""
    from core import ServerConfig
    from utils import setup_logger
    
    logger = setup_logger("CustomAdapterExample")
    
    # 创建服务器
    config = ServerConfig(
        host="0.0.0.0",
        port=25566,
        debug_mode=True
    )
    
    server = BlockConnectServer(config)
    
    # 创建自定义适配器
    custom_adapter = CustomGameAdapter(
        game_server="game.example.com",
        game_port=12345
    )
    
    server.register_adapter("custom_game", custom_adapter)
    
    # 设置事件监听
    def on_event(event):
        logger.info(f"收到事件: {event.type.name} - {event.data}")
    
    server.event_bus.on_any(on_event)
    
    # 启动
    await server.start()
    logger.info("自定义适配器服务器已启动")
    
    try:
        # 模拟玩家连接
        await asyncio.sleep(2)
        await custom_adapter.connect_player("player1", username="TestPlayer")
        
        # 模拟聊天
        await asyncio.sleep(1)
        await custom_adapter.broadcast_message("欢迎来到自定义游戏服务器！")
        
        # 保持运行
        while True:
            await asyncio.sleep(1)
            
    except KeyboardInterrupt:
        logger.info("停止服务器...")
    finally:
        await server.stop()


if __name__ == "__main__":
    asyncio.run(main())
