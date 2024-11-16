# 使用官方的 Python 基礎映像
FROM python:3.10-slim

# 設置工作目錄
WORKDIR /app

# 複製當前目錄內容到容器中的 /app
COPY . .

# 安裝 Flask 和其他依賴
RUN pip install --no-cache-dir Flask

# 對外暴露 80 埠
EXPOSE 8080

# 運行 Flask 應用
CMD ["python", "app.py"]