from motor.motor_asyncio import AsyncIOMotorClient


class Mongo:
    def __init__(self, url):
        self.client = AsyncIOMotorClient(url)
        self.db = self.client['scrapy']

    @classmethod
    def from_crawler(cls, crawler):
        url = crawler.settings.get('MONGODB_URI')
        return cls(url)
