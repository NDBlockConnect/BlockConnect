"""
数据包解析器

实现 Minecraft 协议的数据包解析功能。
"""

import struct
from typing import Tuple, Optional, BinaryIO
from io import BytesIO


class VarInt:
    """VarInt 编码/解码工具类"""
    
    @staticmethod
    def encode(value: int) -> bytes:
        """
        将整数编码为 VarInt
        
        Args:
            value: 要编码的整数
            
        Returns:
            VarInt 字节
        """
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
    
    @staticmethod
    def decode(data: bytes, offset: int = 0) -> Tuple[int, int]:
        """
        从字节解码 VarInt
        
        Args:
            data: 字节数据
            offset: 起始偏移
            
        Returns:
            (值, 新偏移)
        """
        result = 0
        shift = 0
        while True:
            if offset >= len(data):
                raise ValueError("数据不足")
            byte = data[offset]
            result |= (byte & 0x7F) << shift
            offset += 1
            if not (byte & 0x80):
                break
            shift += 7
            if shift >= 35:
                raise ValueError("VarInt 过大")
        return result, offset
    
    @staticmethod
    def decode_from_stream(stream: BinaryIO) -> int:
        """从流中解码 VarInt"""
        result = 0
        shift = 0
        while True:
            byte = stream.read(1)
            if not byte:
                raise ValueError("流已结束")
            byte = byte[0]
            result |= (byte & 0x7F) << shift
            if not (byte & 0x80):
                break
            shift += 7
            if shift >= 35:
                raise ValueError("VarInt 过大")
        return result


class PacketParser:
    """数据包解析器"""
    
    def __init__(self, protocol_version: int = 766):
        """
        初始化解析器
        
        Args:
            protocol_version: 协议版本号
        """
        self.protocol_version = protocol_version
        self.compression_threshold = -1
        
    def parse_packet(self, data: bytes) -> dict:
        """
        解析数据包
        
        Args:
            data: 原始数据包字节
            
        Returns:
            解析后的数据包字典
        """
        stream = BytesIO(data)
        
        # 读取包长度
        length = VarInt.decode_from_stream(stream)
        
        # 读取包ID
        packet_id = VarInt.decode_from_stream(stream)
        
        # 读取剩余数据
        payload = stream.read()
        
        return {
            "length": length,
            "packet_id": packet_id,
            "payload": payload
        }
    
    def read_string(self, data: bytes, offset: int = 0) -> Tuple[str, int]:
        """
        读取字符串
        
        Args:
            data: 字节数据
            offset: 起始偏移
            
        Returns:
            (字符串, 新偏移)
        """
        length, offset = VarInt.decode(data, offset)
        string_bytes = data[offset:offset + length]
        return string_bytes.decode('utf-8'), offset + length
    
    def read_int(self, data: bytes, offset: int = 0) -> Tuple[int, int]:
        """读取 32 位整数"""
        value = struct.unpack('>i', data[offset:offset + 4])[0]
        return value, offset + 4
    
    def read_long(self, data: bytes, offset: int = 0) -> Tuple[int, int]:
        """读取 64 位整数"""
        value = struct.unpack('>q', data[offset:offset + 8])[0]
        return value, offset + 8
    
    def read_short(self, data: bytes, offset: int = 0) -> Tuple[int, int]:
        """读取 16 位整数"""
        value = struct.unpack('>h', data[offset:offset + 2])[0]
        return value, offset + 2
    
    def read_unsigned_short(self, data: bytes, offset: int = 0) -> Tuple[int, int]:
        """读取无符号 16 位整数"""
        value = struct.unpack('>H', data[offset:offset + 2])[0]
        return value, offset + 2
    
    def read_float(self, data: bytes, offset: int = 0) -> Tuple[float, int]:
        """读取 32 位浮点数"""
        value = struct.unpack('>f', data[offset:offset + 4])[0]
        return value, offset + 4
    
    def read_double(self, data: bytes, offset: int = 0) -> Tuple[float, int]:
        """读取 64 位浮点数"""
        value = struct.unpack('>d', data[offset:offset + 8])[0]
        return value, offset + 8
    
    def read_bool(self, data: bytes, offset: int = 0) -> Tuple[bool, int]:
        """读取布尔值"""
        return data[offset] != 0, offset + 1
    
    def read_byte_array(self, data: bytes, offset: int = 0) -> Tuple[bytes, int]:
        """读取字节数组"""
        length, offset = VarInt.decode(data, offset)
        return data[offset:offset + length], offset + length
    
    def read_position(self, data: bytes, offset: int = 0) -> Tuple[Tuple[int, int, int], int]:
        """
        读取位置坐标 (x, y, z)
        
        Returns:
            ((x, y, z), 新偏移)
        """
        value = struct.unpack('>Q', data[offset:offset + 8])[0]
        x = (value >> 38) & 0x3FFFFFF
        if x >= 2**25:
            x -= 2**26
        y = value & 0xFFF
        if y >= 2**11:
            y -= 2**12
        z = (value >> 12) & 0x3FFFFFF
        if z >= 2**25:
            z -= 2**26
        return (x, y, z), offset + 8
    
    def read_uuid(self, data: bytes, offset: int = 0) -> Tuple[str, int]:
        """读取 UUID"""
        uuid_bytes = data[offset:offset + 16]
        # 转换为标准 UUID 格式
        uuid_str = uuid_bytes.hex()
        formatted = f"{uuid_str[:8]}-{uuid_str[8:12]}-{uuid_str[12:16]}-{uuid_str[16:20]}-{uuid_str[20:]}"
        return formatted, offset + 16
    
    def read_nbt(self, data: bytes, offset: int = 0) -> Tuple[dict, int]:
        """
        读取 NBT 数据 (简化实现)
        
        Returns:
            (NBT字典, 新偏移)
        """
        # 这里需要完整的 NBT 解析实现
        # 简化版本：假设是空 NBT
        if data[offset] == 0:
            return {}, offset + 1
        return {}, offset
    
    @staticmethod
    def write_string(value: str) -> bytes:
        """写入字符串"""
        encoded = value.encode('utf-8')
        return VarInt.encode(len(encoded)) + encoded
    
    @staticmethod
    def write_int(value: int) -> bytes:
        """写入 32 位整数"""
        return struct.pack('>i', value)
    
    @staticmethod
    def write_long(value: int) -> bytes:
        """写入 64 位整数"""
        return struct.pack('>q', value)
    
    @staticmethod
    def write_float(value: float) -> bytes:
        """写入 32 位浮点数"""
        return struct.pack('>f', value)
    
    @staticmethod
    def write_double(value: float) -> bytes:
        """写入 64 位浮点数"""
        return struct.pack('>d', value)
    
    @staticmethod
    def write_position(x: int, y: int, z: int) -> bytes:
        """写入位置坐标"""
        value = ((x & 0x3FFFFFF) << 38) | ((z & 0x3FFFFFF) << 12) | (y & 0xFFF)
        return struct.pack('>Q', value)
