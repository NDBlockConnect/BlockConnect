"""
配置管理

提供配置文件的加载和管理。
"""

import json
import yaml
from pathlib import Path
from typing import Any, Dict, Optional
from dataclasses import dataclass, asdict


@dataclass
class ServerConfig:
    """服务器配置"""
    host: str = "0.0.0.0"
    port: int = 25565
    max_connections: int = 100
    tick_rate: int = 20
    enable_encryption: bool = True
    debug_mode: bool = False


@dataclass
class AdapterConfig:
    """适配器配置"""
    name: str = ""
    enabled: bool = True
    settings: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.settings is None:
            self.settings = {}


@dataclass
class LoggingConfig:
    """日志配置"""
    level: str = "INFO"
    log_to_file: bool = True
    log_dir: str = "logs"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    backup_count: int = 5


class Config:
    """配置管理器"""
    
    def __init__(self, config_path: Optional[str] = None):
        self.config_path = config_path
        self.server = ServerConfig()
        self.adapters: Dict[str, AdapterConfig] = {}
        self.logging = LoggingConfig()
        self.custom: Dict[str, Any] = {}
        
        if config_path:
            self.load(config_path)
    
    def load(self, path: str) -> None:
        """
        从文件加载配置
        
        Args:
            path: 配置文件路径 (.json 或 .yaml)
        """
        path = Path(path)
        
        if not path.exists():
            raise FileNotFoundError(f"配置文件不存在: {path}")
        
        with open(path, 'r', encoding='utf-8') as f:
            if path.suffix in ['.yaml', '.yml']:
                data = yaml.safe_load(f)
            else:
                data = json.load(f)
        
        # 加载服务器配置
        if 'server' in data:
            self.server = ServerConfig(**data['server'])
        
        # 加载适配器配置
        if 'adapters' in data:
            for name, adapter_data in data['adapters'].items():
                self.adapters[name] = AdapterConfig(name=name, **adapter_data)
        
        # 加载日志配置
        if 'logging' in data:
            self.logging = LoggingConfig(**data['logging'])
        
        # 加载自定义配置
        if 'custom' in data:
            self.custom = data['custom']
    
    def save(self, path: Optional[str] = None) -> None:
        """
        保存配置到文件
        
        Args:
            path: 保存路径，默认使用加载时的路径
        """
        path = Path(path or self.config_path)
        
        data = {
            'server': asdict(self.server),
            'adapters': {name: asdict(adapter) for name, adapter in self.adapters.items()},
            'logging': asdict(self.logging),
            'custom': self.custom
        }
        
        with open(path, 'w', encoding='utf-8') as f:
            if path.suffix in ['.yaml', '.yml']:
                yaml.dump(data, f, default_flow_style=False, allow_unicode=True)
            else:
                json.dump(data, f, indent=2, ensure_ascii=False)
    
    def get(self, key: str, default: Any = None) -> Any:
        """
        获取配置值
        
        Args:
            key: 配置键，支持点号分隔 (如 "server.host")
            default: 默认值
            
        Returns:
            配置值
        """
        keys = key.split('.')
        value = self.custom
        
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default
        
        return value
    
    def set(self, key: str, value: Any) -> None:
        """
        设置配置值
        
        Args:
            key: 配置键
            value: 配置值
        """
        keys = key.split('.')
        target = self.custom
        
        for k in keys[:-1]:
            if k not in target:
                target[k] = {}
            target = target[k]
        
        target[keys[-1]] = value
