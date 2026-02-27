"""
加密工具

提供加密/解密功能支持。
"""

from typing import Optional, Tuple
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
import base64
import os


class CryptoManager:
    """加密管理器"""
    
    def __init__(self):
        self._fernet_key: Optional[bytes] = None
        self._private_key = None
        self._public_key = None
        
    def generate_fernet_key(self) -> bytes:
        """生成 Fernet 密钥"""
        self._fernet_key = Fernet.generate_key()
        return self._fernet_key
    
    def load_fernet_key(self, key: bytes) -> None:
        """加载 Fernet 密钥"""
        self._fernet_key = key
    
    def encrypt_fernet(self, data: bytes) -> bytes:
        """
        使用 Fernet 加密数据
        
        Args:
            data: 要加密的数据
            
        Returns:
            加密后的数据
        """
        if not self._fernet_key:
            raise ValueError("Fernet 密钥未设置")
        
        f = Fernet(self._fernet_key)
        return f.encrypt(data)
    
    def decrypt_fernet(self, data: bytes) -> bytes:
        """
        使用 Fernet 解密数据
        
        Args:
            data: 要解密的数据
            
        Returns:
            解密后的数据
        """
        if not self._fernet_key:
            raise ValueError("Fernet 密钥未设置")
        
        f = Fernet(self._fernet_key)
        return f.decrypt(data)
    
    def generate_rsa_keys(self, key_size: int = 2048) -> Tuple[bytes, bytes]:
        """
        生成 RSA 密钥对
        
        Args:
            key_size: 密钥长度
            
        Returns:
            (私钥 PEM, 公钥 PEM)
        """
        self._private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=key_size
        )
        self._public_key = self._private_key.public_key()
        
        private_pem = self._private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )
        
        public_pem = self._public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        
        return private_pem, public_pem
    
    def load_rsa_private_key(self, pem_data: bytes) -> None:
        """加载 RSA 私钥"""
        self._private_key = serialization.load_pem_private_key(pem_data, password=None)
        self._public_key = self._private_key.public_key()
    
    def load_rsa_public_key(self, pem_data: bytes) -> None:
        """加载 RSA 公钥"""
        self._public_key = serialization.load_pem_public_key(pem_data)
    
    def encrypt_rsa(self, data: bytes) -> bytes:
        """
        使用 RSA 加密数据
        
        Args:
            data: 要加密的数据
            
        Returns:
            加密后的数据
        """
        if not self._public_key:
            raise ValueError("RSA 公钥未设置")
        
        return self._public_key.encrypt(
            data,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
    
    def decrypt_rsa(self, data: bytes) -> bytes:
        """
        使用 RSA 解密数据
        
        Args:
            data: 要解密的数据
            
        Returns:
            解密后的数据
        """
        if not self._private_key:
            raise ValueError("RSA 私钥未设置")
        
        return self._private_key.decrypt(
            data,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
    
    @staticmethod
    def encrypt_aes(data: bytes, key: bytes, iv: Optional[bytes] = None) -> Tuple[bytes, bytes]:
        """
        使用 AES-256-CBC 加密数据
        
        Args:
            data: 要加密的数据
            key: 32字节密钥
            iv: 16字节初始向量，如果为None则随机生成
            
        Returns:
            (加密后的数据, iv)
        """
        if iv is None:
            iv = os.urandom(16)
        
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
        encryptor = cipher.encryptor()
        
        # PKCS7 填充
        padding_length = 16 - (len(data) % 16)
        padded_data = data + bytes([padding_length] * padding_length)
        
        encrypted = encryptor.update(padded_data) + encryptor.finalize()
        return encrypted, iv
    
    @staticmethod
    def decrypt_aes(data: bytes, key: bytes, iv: bytes) -> bytes:
        """
        使用 AES-256-CBC 解密数据
        
        Args:
            data: 要解密的数据
            key: 32字节密钥
            iv: 16字节初始向量
            
        Returns:
            解密后的数据
        """
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
        decryptor = cipher.decryptor()
        
        decrypted = decryptor.update(data) + decryptor.finalize()
        
        # 去除 PKCS7 填充
        padding_length = decrypted[-1]
        return decrypted[:-padding_length]
    
    @staticmethod
    def hash_sha256(data: bytes) -> bytes:
        """计算 SHA-256 哈希"""
        digest = hashes.Hash(hashes.SHA256())
        digest.update(data)
        return digest.finalize()
    
    @staticmethod
    def generate_random_bytes(length: int) -> bytes:
        """生成随机字节"""
        return os.urandom(length)
