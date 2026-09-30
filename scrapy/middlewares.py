import aiohttp
from pipelines import Mongo


def trans_header(d):
    """将 scrapy Request 请求头转换成 aiohttp 请求头"""
    new_dict = {}
    for key, value in d.items():
        new_dict[key.decode('utf-8')] = ''.join([b.decode('utf-8') for b in value])
    return new_dict


class Proxy(Mongo):

    current_proxy = None # 当前代理

    def __init__(self, mongo_url):
        super(Proxy, self).__init__(mongo_url)
        self.collection = self.db['proxy']

    async def process_request(self, request, spider):
        # 判断是否需要更换代理（考虑到并发情况，需判断代理是否已经被其他请求更换过）
        if 'change_proxy' in request.meta and request.meta['change_proxy'] == self.current_proxy:
            self.current_proxy = None

        if self.current_proxy:
            request.meta['proxy'] = self.current_proxy
            return

        request.meta['proxy'] = None # 先初始化 proxy，否则后续会报错：键不存在
        docs = [] # 数据库获取的代理
        if 'proxy_setting' in request.meta:
            cursor = self.collection.aggregate([request.meta['proxy_setting'], {'$sample': {'size': 5}}])
        else:
            cursor = self.collection.aggregate([{'$sample': {'size': 5}}])
        async for doc in cursor:
            docs.append(doc)

        retry = 0  # 重试次数
        async with aiohttp.ClientSession(
            connector=aiohttp.TCPConnector(verify_ssl=False),
            timeout=aiohttp.ClientTimeout(total=15)
        ) as session:
            headers = trans_header(request.headers)
            while retry < len(docs):
                proxy = f'http://{docs[retry]["ip"]}:{docs[retry]["port"]}'
                # 尝试使用代理预访问地址
                try:
                    async with session.get(request.url, headers=headers, proxy=proxy):
                        self.current_proxy = proxy
                        request.meta['proxy'] = proxy
                        break
                except Exception:
                    retry += 1
