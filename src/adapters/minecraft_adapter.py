"""
Minecraft 适配器

实现 Minecraft Java 版和 Bedrock 版的适配器。
"""

import asyncio
import struct
import json
from typing import Dict, Optional, Tuple
import logging

from ..core.adapter import GameAdapter, ConnectionState
from ..core.events import EventType


class MinecraftAdapter(GameAdapter):
    """
    Minecraft Java 版适配器
    
    支持 Minecraft Java 1.20.6 协议。
    """
    
    PROTOCOL_VERSION = 766  # 1.20.6
    
    def __init__(self, server_address: str, server_port: int = 25565):
        super().__init__("minecraft_java", "1.20.6")
        self.server_address = server_address
        self.server_port = server_port
        
        self._reader: Optional[asyncio.StreamReader] = None
        self._writer: Optional[asyncio.StreamWriter] = None
        self._compression_threshold = -1
        self._encryption_enabled = False
        
    async def initialize(self) -> None:
        """初始化适配器"""
        self.logger.info(f"初始化 Minecraft Java 适配器: {self.server_address}:{self.server_port}")
        
    async def shutdown(self) -> None:
        """关闭适配器"""
        self.logger.info("关闭 Minecraft Java 适配器")
        if self._writer:
            self._writer.close()
            await self._writer.wait_closed()
            
    async def tick(self) -> None:
        """每帧更新"""
        if self.state == ConnectionState.PLAY and self._reader:
            try:
                # 读取并处理数据包
                packet = await self._read_packet()
                if packet:
                    await self._handle_packet(packet)
            except asyncio.TimeoutError:
                pass
            except Exception as e:
                self.logger.error(f"处理数据包错误: {e}")
                
    async def connect_player(self, player_id: str, username: str, **kwargs) -> bool:
        """
        连接玩家到 Minecraft 服务器
        
        Args:
            player_id: 玩家ID
            username: Minecraft 用户名
            **kwargs: 额外参数
            
        Returns:
            是否连接成功
        """
        try:
            self._reader, self._writer = await asyncio.wait_for(
                asyncio.open_connection(self.server_address, self.server_port),
                timeout=10.0
            )
            
            # 发送握手包
            await self._send_handshake()
            
            # 发送登录包
            await self._send_login_start(username)
            
            self.state = ConnectionState.LOGIN
            self.connected_players[player_id] = {
                "username": username,
                "entity_id": None
            }
            
            self.logger.info(f"玩家 {username} 已连接到 Minecraft 服务器")
            return True
            
        except Exception as e:
            self.logger.error(f"连接失败: {e}")
            return False
            
    async def disconnect_player(self, player_id: str, reason: str = "") -> None:
        """断开玩家连接"""
        if player_id in self.connected_players:
            del self.connected_players[player_id]
            
        if self._writer:
            # 发送断开连接包
            disconnect_packet = self._create_disconnect_packet(reason)
            self._writer.write(disconnect_packet)
            await self._writer.drain()
            
    async def send_message(self, player_id: str, message: str) -> None:
        """发送聊天消息"""
        if self.state != ConnectionState.PLAY:
            return
            
        # 构建聊天包
        chat_packet = self._create_chat_packet(message)
        self._writer.write(chat_packet)
        await self._writer.drain()
        
    async def broadcast_message(self, message: str, exclude: Optional[list] = None) -> None:
        """广播消息"""
        for player_id in self.connected_players:
            if exclude and player_id in exclude:
                continue
            await self.send_message(player_id, message)
            
    async def teleport_player(self, player_id: str, x: float, y: float, z: float) -> None:
        """传送玩家"""
        if self.state != ConnectionState.PLAY:
            return
            
        # 发送传送包
        teleport_packet = self._create_teleport_packet(x, y, z)
        self._writer.write(teleport_packet)
        await self._writer.drain()
        
    async def set_block(self, x: int, y: int, z: int, block_type: str) -> None:
        """设置方块"""
        if self.state != ConnectionState.PLAY:
            return
            
        # 发送方块变更包
        block_packet = self._create_block_change_packet(x, y, z, block_type)
        self._writer.write(block_packet)
        await self._writer.drain()
        
    async def get_block(self, x: int, y: int, z: int) -> str:
        """获取方块类型"""
        # 这里需要实现方块查询逻辑
        return "minecraft:air"
        
    # 私有辅助方法
    
    def _write_varint(self, value: int) -> bytes:
        """写入 VarInt"""
        result = []
        while True:
            byte = value & 0x7F
            value >>= 7
            if value != 0:
                byte |= 0x80
            result.append(byte)
            if value == 0:
                break
        return bytes(result)
        
    def _write_string(self, value: str) -> bytes:
        """写入字符串"""
        encoded = value.encode('utf-8')
        return self._write_varint(len(encoded)) + encoded
        
    async def _send_handshake(self) -> None:
        """发送握手包"""
        packet_id = 0x00
        data = b''
        data += self._write_varint(self.PROTOCOL_VERSION)  # 协议版本
        data += self._write_string(self.server_address)    # 服务器地址
        data += struct.pack('>H', self.server_port)        # 端口
        data += self._write_varint(2)                      # 下一个状态 (login)
        
        packet = self._write_varint(len(data) + 1) + bytes([packet_id]) + data
        self._writer.write(packet)
        await self._writer.drain()
        
    async def _send_login_start(self, username: str) -> None:
        """发送登录开始包"""
        packet_id = 0x00
        data = self._write_string(username)
        
        packet = self._write_varint(len(data) + 1) + bytes([packet_id]) + data
        self._writer.write(packet)
        await self._writer.drain()
        
    async def _read_packet(self) -> Optional[bytes]:
        """读取数据包"""
        try:
            # 读取长度 (VarInt)
            length = await self._read_varint()
            if length <= 0:
                return None
                
            # 读取数据
            data = await self._reader.read(length)
            return data
            
        except Exception as e:
            self.logger.error(f"读取数据包错误: {e}")
            return None
            
    async def _read_varint(self) -> int:
        """读取 VarInt"""
        result = 0
        shift = 0
        while True:
            byte = await self._reader.read(1)
            if not byte:
                raise ConnectionError("连接已关闭")
            byte = byte[0]
            result |= (byte & 0x7F) << shift
            if not (byte & 0x80):
                break
            shift += 7
            if shift >= 35:
                raise ValueError("VarInt 过大")
        return result
        
    async def _handle_packet(self, data: bytes) -> None:
        """处理数据包"""
        if len(data) < 1:
            return
            
        packet_id = data[0]
        payload = data[1:]
        
        # 根据包ID处理不同类型的包
        if packet_id == 0x02:  # 登录成功
            self.state = ConnectionState.PLAY
            self.logger.info("登录成功，进入游戏")
            self.emit_event(EventType.PLAYER_CONNECT, {"adapter": self.name})
            
        elif packet_id == 0x0F:  # 聊天消息
            message = self._parse_chat_message(payload)
            self.emit_event(EventType.PLAYER_CHAT, {
                "adapter": self.name,
                "message": message
            })
            
    def _parse_chat_message(self, data: bytes) -> str:
        """解析聊天消息"""
        # 简化的聊天消息解析
        try:
            length = self._read_varint_from_bytes(data, 0)[0]
            json_str = data[1:1+length].decode('utf-8')
            chat_data = json.loads(json_str)
            return chat_data.get("text", "")
        except:
            return ""
            
    def _read_varint_from_bytes(self, data: bytes, offset: int) -> Tuple[int, int]:
        """从字节读取 VarInt，返回 (值, 新偏移)"""
        result = 0
        shift = 0
        while True:
            byte = data[offset]
            result |= (byte & 0x7F) << shift
            offset += 1
            if not (byte & 0x80):
                break
            shift += 7
        return result, offset
        
    def _create_chat_packet(self, message: str) -> bytes:
        """创建聊天包"""
        packet_id = 0x03
        chat_json = json.dumps({"text": message})
        data = self._write_string(chat_json)
        return self._write_varint(len(data) + 1) + bytes([packet_id]) + data
        
    def _create_disconnect_packet(self, reason: str) -> bytes:
        """创建断开连接包"""
        packet_id = 0x1A
        reason_json = json.dumps({"text": reason})
        data = self._write_string(reason_json)
        return self._write_varint(len(data) + 1) + bytes([packet_id]) + data
        
    def _create_teleport_packet(self, x: float, y: float, z: float) -> bytes:
        """创建传送包"""
        packet_id = 0x38
        data = struct.pack('>ddd', x, y, z)
        data += struct.pack('>ff', 0.0, 0.0)  # yaw, pitch
        data += bytes([0])  # flags
        return self._write_varint(len(data) + 1) + bytes([packet_id]) + data
        
    def _create_block_change_packet(self, x: int, y: int, z: int, block_type: str) -> bytes:
        """创建方块变更包"""
        packet_id = 0x09
        # 简化的方块变更实现
        position = ((x & 0x3FFFFFF) << 38) | ((z & 0x3FFFFFF) << 12) | (y & 0xFFF)
        data = struct.pack('>Q', position)
        data += self._write_varint(1)  # block ID (简化)
        return self._write_varint(len(data) + 1) + bytes([packet_id]) + data


class MinecraftBedrockAdapter(GameAdapter):
    """
    Minecraft Bedrock 版适配器
    
    支持 Minecraft Bedrock 协议。
    """
    
    def __init__(self, server_address: str, server_port: int = 19132):
        super().__init__("minecraft_bedrock", "1.20.0")
        self.server_address = server_address
        self.server_port = server_port
        
    async def initialize(self) -> None:
        """初始化适配器"""
        self.logger.info(f"初始化 Minecraft Bedrock 适配器: {self.server_address}:{self.server_port}")
        
    async def shutdown(self) -> None:
        """关闭适配器"""
        self.logger.info("关闭 Minecraft Bedrock 适配器")
        
    async def tick(self) -> None:
        """每帧更新"""
        pass
        
    async def connect_player(self, player_id: str, **kwargs) -> bool:
        """连接玩家"""
        # Bedrock 协议实现
        self.logger.info(f"Bedrock 玩家 {player_id} 连接")
        return True
        
    async def disconnect_player(self, player_id: str, reason: str = "") -> None:
        """断开玩家"""
        self.logger.info(f"Bedrock 玩家 {player_id} 断开: {reason}")
        
    async def send_message(self, player_id: str, message: str) -> None:
        """发送消息"""
        pass
        
    async def broadcast_message(self, message: str, exclude: Optional[list] = None) -> None:
        """广播消息"""
        pass
        
    async def teleport_player(self, player_id: str, x: float, y: float, z: float) -> None:
        """传送玩家"""
        pass
        
    async def set_block(self, x: int, y: int, z: int, block_type: str) -> None:
        """设置方块"""
        pass
        
    async def get_block(self, x: int, y: int, z: int) -> str:
        """获取方块"""
        return "minecraft:air"
