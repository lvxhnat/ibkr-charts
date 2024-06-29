import asyncio
import warnings
from ib_insync import *


class IBKRClient(IB):

    def __init__(self):
        super().__init__()
        self.ibkr_port = 7497
        self.ibkr_host = "127.0.0.1"
        self.news_provider_codes = None

    def sync_connect(self):
        super().connect()

    async def connect(self):
        # https://stackoverflow.com/questions/77091861/how-can-i-configure-ib-insync-to-run-in-a-fastapi-app
        while True:
            try:
                if not self.isConnected():
                    await super().connectAsync(self.ibkr_host, self.ibkr_port, 0)
                    if self.isConnected():
                        print("IBKR Instance connected")
            except Exception as e:
                warnings.warn(f"Error occurred while connecting to IBKR Servers. {str(e)}")
            await asyncio.sleep(5)

    def disconnect(self):
        super().disconnect()

    def __exit__(self, exc_type, exc_value, traceback):
        self.disconnect()  # Disconnect when exiting the context
        if exc_type == TimeoutError:
            warnings.warn("IBKR Session unable to run because TWS is not open")


ibkr_client: IBKRClient = IBKRClient()
