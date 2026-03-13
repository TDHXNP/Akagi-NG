import asyncio
from typing import Any
from urllib.parse import quote

import aiohttp

from akagi_ng.dataserver.logger import logger
from akagi_ng.dataserver.translations import action_to_chinese
from akagi_ng.settings import local_settings


class WebhookManager:
    """管理 Webhook 远程推送功能"""

    def __init__(self):
        self.session: aiohttp.ClientSession | None = None
        self.loop: asyncio.AbstractEventLoop | None = None
        self.running = False

    def set_loop(self, loop: asyncio.AbstractEventLoop):
        """设置事件循环引用"""
        self.loop = loop

    async def start(self):
        """启动 Webhook 管理器"""
        if not local_settings.webhook.enabled:
            logger.debug("Webhook is disabled in settings.")
            return

        if not local_settings.webhook.url:
            logger.warning("Webhook is enabled but URL is empty.")
            return

        self.running = True
        timeout = aiohttp.ClientTimeout(total=10)
        self.session = aiohttp.ClientSession(timeout=timeout)
        logger.info(f"Webhook manager started. Target URL template: {local_settings.webhook.url}")

    async def stop(self):
        """停止 Webhook 管理器"""
        self.running = False
        if self.session:
            await self.session.close()
            self.session = None
        logger.info("Webhook manager stopped.")

    def send_webhook(self, event_type: str, data: dict[str, Any]):
        """
        异步发送 Webhook 推送

        Args:
            event_type: 事件类型 (recommendations, notification)
            data: 推送的数据负载
        """
        if not self.running:
            return

        if not local_settings.webhook.enabled or not local_settings.webhook.url:
            return

        if self.loop:
            asyncio.run_coroutine_threadsafe(self._send_webhook_async(event_type, data), self.loop)

    def _format_message(self, event_type: str, data: dict[str, Any]) -> tuple[str, str]:
        """
        格式化消息为 title 和 msg

        Args:
            event_type: 事件类型
            data: 数据负载

        Returns:
            (title, msg) 元组
        """
        if event_type == "recommendations":
            return self._format_recommendations(data)
        elif event_type == "notification":
            return self._format_notification(data)
        return "Akagi-NG", "未知事件"

    def _format_recommendations(self, data: dict[str, Any]) -> tuple[str, str]:
        """
        格式化 AI 推荐消息

        Args:
            data: 推荐数据

        Returns:
            (title, msg) 元组
        """
        title = "AI 推荐"
        recommendations = data.get("recommendations", [])

        if not recommendations:
            return title, "无推荐"

        # 获取置信度最高的推荐
        top_rec = recommendations[0]
        action = top_rec.get("action", "")
        tile = top_rec.get("tile")
        consumed = top_rec.get("consumed", [])
        confidence = top_rec.get("confidence", 0.0)

        # 转换为中文描述
        action_zh = action_to_chinese(action, tile, consumed)
        confidence_pct = f"{confidence * 100:.1f}%"

        msg = f"{action_zh} ({confidence_pct})"

        return title, msg

    def _format_notification(self, data: dict[str, Any]) -> tuple[str, str]:
        """
        格式化系统通知消息

        Args:
            data: 通知数据

        Returns:
            (title, msg) 元组
        """
        title = "系统通知"
        notification_list = data.get("list", [])

        if not notification_list:
            return title, ""

        # 获取第一个通知
        first_notification = notification_list[0]
        code = first_notification.get("code", "")

        # 简单的通知代码中文映射
        code_map = {
            "game_connected": "游戏已连接",
            "game_disconnected": "游戏已断开",
            "model_loaded": "模型已加载",
            "model_load_failed": "模型加载失败",
            "bot_runtime_error": "AI 运行错误",
        }

        msg = code_map.get(code, code)
        return title, msg

    async def _send_webhook_async(self, event_type: str, data: dict[str, Any]):
        """
        内部异步方法：实际执行 HTTP GET 请求

        Args:
            event_type: 事件类型
            data: 数据负载
        """
        if not self.session:
            logger.warning("Webhook session not initialized.")
            return

        url_template = local_settings.webhook.url
        title, msg = self._format_message(event_type, data)

        # URL 编码
        title_encoded = quote(title)
        msg_encoded = quote(msg)

        # 替换占位符
        url = url_template.replace("{title}", title_encoded).replace("{msg}", msg_encoded)

        try:
            async with self.session.get(url) as response:
                if response.status >= 200 and response.status < 300:
                    logger.trace(f"Webhook sent successfully: {event_type} -> {url}")
                else:
                    logger.warning(f"Webhook failed with status {response.status}: {event_type} -> {url}")
        except asyncio.TimeoutError:
            logger.error(f"Webhook timeout: {url}")
        except aiohttp.ClientError as e:
            logger.error(f"Webhook client error: {e}")
        except Exception as e:
            logger.exception(f"Unexpected error sending webhook: {e}")
