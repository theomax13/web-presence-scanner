import httpx

from app.config import settings
from app.scanners.base import BaseScanner, ScannerResult
from app.shared.http_client import get_http_client


class HIBPScanner(BaseScanner):
    name = "hibp"
    display_name = "Have I Been Pwned"
    supported_input_types = ["email"]

    async def scan(self, query: str, input_type: str) -> ScannerResult:
        if not settings.hibp_api_key:
            return ScannerResult(
                source=self.name,
                data={},
                found=False,
                error="HIBP API key not configured",
            )

        try:
            client = await get_http_client()
            resp = await client.get(
                f"https://haveibeenpwned.com/api/v3/breachedaccount/{query}",
                headers={
                    "hibp-api-key": settings.hibp_api_key,
                    "user-agent": "Scopaly",
                },
                params={"truncateResponse": "false"},
            )

            if resp.status_code == 404:
                return ScannerResult(
                    source=self.name, data={"breaches": []}, found=False
                )

            if resp.status_code == 200:
                breaches = resp.json()
                return ScannerResult(
                    source=self.name,
                    data={
                        "breaches": [
                            {
                                "name": b["Name"],
                                "title": b["Title"],
                                "domain": b["Domain"],
                                "breach_date": b["BreachDate"],
                                "data_classes": b["DataClasses"],
                                "description": b["Description"],
                                "is_verified": b["IsVerified"],
                            }
                            for b in breaches
                        ],
                        "total": len(breaches),
                    },
                )

            return ScannerResult(
                source=self.name,
                data={},
                found=False,
                error=f"HIBP API returned {resp.status_code}",
            )

        except httpx.TimeoutException:
            return ScannerResult(
                source=self.name, data={}, found=False, error="HIBP request timed out"
            )
        except Exception as e:
            return ScannerResult(
                source=self.name, data={}, found=False, error=str(e)
            )
