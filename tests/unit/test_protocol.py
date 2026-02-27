"""
协议模块单元测试
"""

import pytest
import struct

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

from protocol import VarInt, PacketParser, ProtocolTranslator, GameProtocol


class TestVarInt:
    """测试 VarInt 编解码"""
    
    def test_encode_small(self):
        """测试小数值编码"""
        assert VarInt.encode(0) == b'\x00'
        assert VarInt.encode(1) == b'\x01'
        assert VarInt.encode(127) == b'\x7f'
    
    def test_encode_large(self):
        """测试大数值编码"""
        assert VarInt.encode(128) == b'\x80\x01'
        assert VarInt.encode(255) == b'\xff\x01'
        assert VarInt.encode(25565) == b'\xdd\xc7\x01'
    
    def test_decode_small(self):
        """测试小数值解码"""
        assert VarInt.decode(b'\x00') == (0, 1)
        assert VarInt.decode(b'\x01') == (1, 1)
        assert VarInt.decode(b'\x7f') == (127, 1)
    
    def test_decode_large(self):
        """测试大数值解码"""
        assert VarInt.decode(b'\x80\x01') == (128, 2)
        assert VarInt.decode(b'\xff\x01') == (255, 2)
        assert VarInt.decode(b'\xdd\xc7\x01') == (25565, 3)
    
    def test_encode_decode_roundtrip(self):
        """测试编解码往返"""
        test_values = [0, 1, 127, 128, 255, 256, 1000, 25565, 100000]
        for value in test_values:
            encoded = VarInt.encode(value)
            decoded, _ = VarInt.decode(encoded)
            assert decoded == value


class TestPacketParser:
    """测试数据包解析器"""
    
    def test_parse_packet(self):
        """测试解析数据包"""
        parser = PacketParser()
        
        # 构造测试数据包
        packet_id = 0x03
        payload = b'\x0bhello world'
        length = len(payload) + 1
        
        data = VarInt.encode(length) + VarInt.encode(packet_id) + payload
        
        result = parser.parse_packet(data)
        
        assert result["packet_id"] == packet_id
        assert result["payload"] == payload
    
    def test_read_string(self):
        """测试读取字符串"""
        parser = PacketParser()
        
        test_str = "Hello, World!"
        encoded_str = VarInt.encode(len(test_str)) + test_str.encode('utf-8')
        
        result, offset = parser.read_string(encoded_str)
        
        assert result == test_str
        assert offset == len(encoded_str)
    
    def test_read_position(self):
        """测试读取位置坐标"""
        parser = PacketParser()
        
        # 构造位置数据
        x, y, z = 100, 64, -200
        position_value = ((x & 0x3FFFFFF) << 38) | ((z & 0x3FFFFFF) << 12) | (y & 0xFFF)
        data = struct.pack('>Q', position_value)
        
        result, offset = parser.read_position(data)
        
        assert result == (x, y, z)
    
    def test_write_string(self):
        """测试写入字符串"""
        test_str = "Test"
        result = PacketParser.write_string(test_str)
        
        expected = VarInt.encode(len(test_str)) + test_str.encode('utf-8')
        assert result == expected


class TestProtocolTranslator:
    """测试协议翻译器"""
    
    def test_block_mapping(self):
        """测试方块映射"""
        translator = ProtocolTranslator()
        
        # 测试已知映射
        result = translator.translate_block(
            "minecraft:stone",
            GameProtocol.MINECRAFT_JAVA,
            GameProtocol.MINI_WORLD
        )
        assert result == "mini:stone"
    
    def test_unknown_block_mapping(self):
        """测试未知方块映射"""
        translator = ProtocolTranslator()
        
        result = translator.translate_block(
            "minecraft:unknown_block",
            GameProtocol.MINECRAFT_JAVA,
            GameProtocol.MINI_WORLD
        )
        # 未知方块应返回原值
        assert result == "minecraft:unknown_block"
    
    def test_position_translation(self):
        """测试坐标翻译"""
        translator = ProtocolTranslator()
        
        # Minecraft -> MiniWorld 应该翻转 X 轴
        x, y, z = 100, 64, 200
        result = translator.translate_position(
            x, y, z,
            GameProtocol.MINECRAFT_JAVA,
            GameProtocol.MINI_WORLD
        )
        assert result == (-100, 64, 200)
    
    def test_add_block_mapping(self):
        """测试添加方块映射"""
        translator = ProtocolTranslator()
        
        translator.add_block_mapping("custom:block1", "other:block1")
        
        result = translator.translate_block(
            "custom:block1",
            GameProtocol.CUSTOM,
            GameProtocol.CUSTOM
        )
        assert result == "other:block1"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
