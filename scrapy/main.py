import argparse
import os
from scrapy.utils.project import get_project_settings
from scrapy.crawler import CrawlerProcess

def parse_args():
    parser = argparse.ArgumentParser(description=__doc__)

    parser.add_argument('--mongodb_url', default=os.getenv('MONGODB_URI'), help='Mongo 数据库连接地址')
    _args = parser.parse_args()

    if not _args.mongodb_url:
        parser.error('未提供 Mongo 数据库连接地址')
    return _args

if '__main__' == __name__:
    settings = get_project_settings()

    args = parse_args()
    settings.set('MONGODB_URI', args.mongodb_url)

    process = CrawlerProcess(settings)

    process.crawl('lolicon')

    process.start()
