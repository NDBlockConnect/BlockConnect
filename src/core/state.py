"""
游戏状态管理

管理游戏世界的同步状态。
"""

from typing import Dict, Any, Optional
from dataclasses import dataclass, field
import asyncio


@dataclass
class PlayerState:
    """玩家状态"""
    player_id: str
    name: str
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0
    yaw: float = 0.0
    pitch: float = 0.0
    health: float = 20.0
    inventory: Dict[int, Dict[str, Any]] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "player_id": self.player_id,
            "name": self.name,
            "position": {"x": self.x, "y": self.y, "z": self.z},
            "rotation": {"yaw": self.yaw, "pitch": self.pitch},
            "health": self.health,
        }


@dataclass
class BlockState:
    """方块状态"""
    x: int
    y: int
    z: int
    block_type: str
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class EntityState:
    """实体状态"""
    entity_id: str
    entity_type: str
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0
    metadata: Dict[str, Any] = field(default_factory=dict)


class GameState:
    """游戏状态"""
    
    def __init__(self):
        self.players: Dict[str, PlayerState] = {}
        self.blocks: Dict[str, BlockState] = {}
        self.entities: Dict[str, EntityState] = {}
        
    def get_player(self, player_id: str) -> Optional[PlayerState]:
        """获取玩家状态"""
        return self.players.get(player_id)
        
    def update_player(self, player: PlayerState) -> None:
        """更新玩家状态"""
        self.players[player.player_id] = player
        
    def remove_player(self, player_id: str) -> None:
        """移除玩家"""
        if player_id in self.players:
            del self.players[player_id]
            
    def get_block(self, x: int, y: int, z: int) -> Optional[BlockState]:
        """获取方块状态"""
        key = f"{x},{y},{z}"
        return self.blocks.get(key)
        
    def set_block(self, block: BlockState) -> None:
        """设置方块"""
        key = f"{block.x},{block.y},{block.z}"
        self.blocks[key] = block
        
    def get_entity(self, entity_id: str) -> Optional[EntityState]:
        """获取实体状态"""
        return self.entities.get(entity_id)
        
    def update_entity(self, entity: EntityState) -> None:
        """更新实体状态"""
        self.entities[entity.entity_id] = entity


class StateManager:
    """状态管理器"""
    
    def __init__(self):
        self.state = GameState()
        self._sync_interval = 0.05  # 20 TPS
        self._last_sync = 0
        
    async def sync(self) -> None:
        """同步状态到所有连接的游戏"""
        # 这里可以实现增量同步逻辑
        pass
        
    def get_state(self) -> GameState:
        """获取当前状态"""
        return self.state
