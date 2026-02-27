"""
BlockConnect 最小示例

展示如何创建一个基本的 BlockConnect 服务器。
"""

import asyncio
import sys
from pathlib import Path

# 添加 src 到路径
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from core import BlockConnectServer, ServerConfig
from adapters import MinecraftAdapter
from utils import setup_logger


async def main():
    """主函数"""
    # 设置日志
    logger = setup_logger("BlockConnect", level=20)  # INFO level
    
    logger.info("=" * 50)
    logger.info("BlockConnect 最小示例")
    logger.info("=" * 50)
    
    # 创建服务器配置
    config = ServerConfig(
        host="0.0.0.0",
        port=25565,
        max_connections=10,
        tick_rate=20,
        debug_mode=True
    )
    
    # 创建服务器
    server = BlockConnectServer(config)
    
    # 创建 Minecraft 适配器
    mc_adapter = MinecraftAdapter(
        server_address="localhost",
        server_port=25565
    )
    
    # 注册适配器
    server.register_adapter("minecraft", mc_adapter)
    
    # 设置事件监听
    def on_player_connect(event):
        logger.info(f"玩家连接: {event.data}")
    
    def on_player_chat(event):
        logger.info(f"玩家聊天: {event.data}")
    
    server.event_bus.on("PLAYER_CONNECT", on_player_connect)
    server.event_bus.on("PLAYER_CHAT", on_player_chat)
    
    # 启动服务器
    try:
        await server.start()
        logger.info("服务器已启动，按 Ctrl+C 停止")
        
        # 保持运行
        while True:
            await asyncio.sleep(1)
            
    except KeyboardInterrupt:
        logger.info("收到停止信号")
    finally:
        await server.stop()
        logger.info("服务器已关闭")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"错误: {e}")
        sys.exit(1)
