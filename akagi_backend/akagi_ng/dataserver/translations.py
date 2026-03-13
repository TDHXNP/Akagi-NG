"""
中文翻译映射模块
用于将 MJAI 动作和牌型转换为中文
"""

# 动作类型中文映射
ACTION_NAMES_ZH = {
    "dahai": "打",
    "reach": "立直",
    "chi": "吃",
    "pon": "碰",
    "daiminkan": "大明杠",
    "ankan": "暗杠",
    "kakan": "加杠",
    "hora": "和牌",
    "ryukyoku": "流局",
    "nukidora": "拔北",
    "none": "跳过",
}


def tile_to_chinese(tile: str) -> str:
    """
    将麻将牌型转换为中文

    Args:
        tile: 麻将牌型，如 "5m", "1p", "7s", "E", "N"

    Returns:
        中文牌型，如 "五万", "一筒", "七索", "东", "北"
    """
    if not tile:
        return ""

    # 数字中文映射
    numbers = {
        "0": "〇",
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六",
        "7": "七",
        "8": "八",
        "9": "九",
    }

    # 花色中文映射
    suits = {"m": "万", "p": "筒", "s": "索"}

    # 字牌中文映射
    honors = {"E": "东", "S": "南", "W": "西", "N": "北", "P": "白", "F": "发", "C": "中"}

    # 处理字牌
    if tile in honors:
        return honors[tile]

    # 处理数牌
    if len(tile) == 2:
        number = tile[0]
        suit = tile[1]
        if number in numbers and suit in suits:
            return f"{numbers[number]}{suits[suit]}"

    # 处理红宝牌标记
    if tile.endswith("r"):
        base_tile = tile[:-1]
        return tile_to_chinese(base_tile) + "(赤)"

    return tile


def action_to_chinese(action: str, tile: str | None = None, consumed: list[str] | None = None) -> str:
    """
    将动作转换为中文描述

    Args:
        action: 动作类型
        tile: 相关的牌（可选）
        consumed: 消耗的牌（可选）

    Returns:
        中文动作描述
    """
    action_name = ACTION_NAMES_ZH.get(action, action)

    if not tile:
        return action_name

    tile_zh = tile_to_chinese(tile)

    # 特殊处理吃碰杠
    if action in ("chi", "pon", "daiminkan", "ankan", "kakan"):
        if consumed:
            consumed_zh = "".join(tile_to_chinese(t) for t in consumed)
            return f"{action_name} {tile_zh} ({consumed_zh})"
        return f"{action_name} {tile_zh}"

    return f"{action_name} {tile_zh}"
