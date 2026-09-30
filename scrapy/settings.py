from os import getenv

# 最大并发请求
# CONCURRENT_REQUESTS = 16

# 每个域最大并发请求
# CONCURRENT_REQUESTS_PER_DOMAIN = 8

# 下载超时
DOWNLOAD_TIMEOUT = 30

# 导出编码格式
FEED_EXPORT_ENCODING = 'utf-8'

LOG_FORMATTER = 'log.PoliteLogFormatter'

# 日志等级，可选值：'CRITICAL' 'ERROR' 'WARNING' 'INFO' 'DEBUG'
LOG_LEVEL = 'WARNING'

# 内存统计
MEMUSAGE_ENABLED = False

# 重定向最大次数
REDIRECT_MAX_TIMES = 5

# 爬虫所在目录
SPIDER_MODULES = ['spiders']

# 是否启动 Telnet
TELNETCONSOLE_ENABLED = False

TWISTED_REACTOR = 'twisted.internet.asyncioreactor.AsyncioSelectorReactor'

# 用户代理头
USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'

# Mongo 数据库
MONGODB_URI = getenv('MONGODB_URI')
