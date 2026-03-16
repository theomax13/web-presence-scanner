from app.scanners.base import BaseScanner


class ScannerRegistry:
    def __init__(self):
        self._scanners: dict[str, BaseScanner] = {}

    def register(self, scanner: BaseScanner):
        self._scanners[scanner.name] = scanner

    def get_all(self) -> list[BaseScanner]:
        return list(self._scanners.values())

    def get_for_input_type(self, input_type: str) -> list[BaseScanner]:
        return [s for s in self._scanners.values() if s.supports(input_type)]


registry = ScannerRegistry()
