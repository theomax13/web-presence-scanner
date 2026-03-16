from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class ScannerResult:
    source: str
    data: dict
    found: bool = True
    error: str | None = None


class BaseScanner(ABC):
    name: str
    display_name: str
    supported_input_types: list[str] = field(default_factory=list)

    @abstractmethod
    async def scan(self, query: str, input_type: str) -> ScannerResult:
        ...

    def supports(self, input_type: str) -> bool:
        return input_type in self.supported_input_types
