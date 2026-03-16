import httpx

from app.config import settings
from app.scanners.base import BaseScanner, ScannerResult


class WebSearchScanner(BaseScanner):
    name = "web_search"
    display_name = "Web Search"
    supported_input_types = ["email", "username", "domain", "name"]

    async def scan(self, query: str, input_type: str) -> ScannerResult:
        if not settings.google_api_key or not settings.google_cse_id:
            return ScannerResult(
                source=self.name,
                data={},
                found=False,
                error="Google API key or CSE ID not configured",
            )

        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    "https://www.googleapis.com/customsearch/v1",
                    params={
                        "key": settings.google_api_key,
                        "cx": settings.google_cse_id,
                        "q": query,
                        "num": 10,
                    },
                    timeout=15,
                )

            if resp.status_code != 200:
                return ScannerResult(
                    source=self.name,
                    data={},
                    found=False,
                    error=f"Google API returned {resp.status_code}",
                )

            data = resp.json()
            items = data.get("items", [])

            results = [
                {
                    "title": item.get("title", ""),
                    "link": item.get("link", ""),
                    "snippet": item.get("snippet", ""),
                    "display_link": item.get("displayLink", ""),
                }
                for item in items
            ]

            return ScannerResult(
                source=self.name,
                data={"results": results, "total": len(results)},
                found=len(results) > 0,
            )

        except httpx.TimeoutException:
            return ScannerResult(source=self.name, data={}, found=False, error="Google search timed out")
        except Exception as e:
            return ScannerResult(source=self.name, data={}, found=False, error=str(e))
