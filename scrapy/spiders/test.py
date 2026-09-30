import json
import scrapy


class Spider(scrapy.Spider):
    name = 'test'

    start_urls = ['https://httpbin.org/anything']

    def parse(self, response):
        print(response.meta)
        print(json.loads(response.text))
