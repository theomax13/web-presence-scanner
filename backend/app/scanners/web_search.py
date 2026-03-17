import logging

import httpx

from app.config import settings
from app.scanners.base import BaseScanner, ScannerResult
from app.shared.http_client import get_http_client

logger = logging.getLogger(__name__)


class WebSearchScanner(BaseScanner):
    name = "web_search"
    display_name = "Online Profiles & Mentions"
    supported_input_types = ["email", "username", "domain", "name"]

    def _build_query(self, query: str, input_type: str) -> str:
        if input_type == "email":
            return f'"{query}"'
        if input_type == "username":
            clean = query.lstrip("@")
            return f'"{clean}" OR "@{clean}"'
        if input_type == "domain":
            return f'"{query}"'
        return f'"{query}"'

    async def scan(self, query: str, input_type: str) -> ScannerResult:
        if not settings.searlo_api_key:
            return ScannerResult(
                source=self.name,
                data={},
                found=False,
                error="Searlo API key not configured",
            )

        search_query = self._build_query(query, input_type)
        params = {"q": search_query, "limit": 10}
        logger.info("Searlo request: GET /api/v1/search/web params=%s", params)

        try:
            client = await get_http_client()
            resp = await client.get(
                "https://api.searlo.tech/api/v1/search/web",
                params=params,
                headers={"x-api-key": settings.searlo_api_key},
            )

            logger.info(
                "Searlo response: %s body=%s", resp.status_code, resp.text[:500]
            )

            if resp.status_code != 200:
                body = resp.text
                logger.error("Searlo API %s: %s", resp.status_code, body)
                return ScannerResult(
                    source=self.name,
                    data={},
                    found=False,
                    error=f"Searlo API {resp.status_code}: {body}",
                )

            data = resp.json()
            items = data.get("organic", [])

            results = [
                {
                    "title": item.get("title", ""),
                    "link": item.get("link", ""),
                    "snippet": item.get("snippet", ""),
                    "display_link": item.get(
                        "displayedLink", item.get("domain", "")
                    ),
                }
                for item in items
            ]

            return ScannerResult(
                source=self.name,
                data={"results": results, "total": len(results)},
                found=len(results) > 0,
            )

        except httpx.TimeoutException:
            return ScannerResult(
                source=self.name, data={}, found=False, error="Search timed out"
            )
        except Exception as e:
            return ScannerResult(
                source=self.name, data={}, found=False, error=str(e)
            )
