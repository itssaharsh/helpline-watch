# Helpline Watch — one image, one process: FastAPI serves the API and the built UI.
# Runs in replay mode by default (recorded SerpApi responses, no key, zero credits),
# so a public instance is safe to leave open. Set SERPAPI_API_KEY and HELPLINE_MODE=auto to go live.
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 \
    HELPLINE_MODE=replay HELPLINE_DATA_DIR=/srv/data PORT=8787

WORKDIR /srv
COPY backend/ /srv/backend/
# editable install keeps fixtures/, seeds/ and static/ where the app expects them
RUN pip install --no-cache-dir -e /srv/backend && helpline-watch seed-demo

EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD python -c "import urllib.request,os;urllib.request.urlopen('http://127.0.0.1:%s/api/health'%os.environ.get('PORT','8787'))" || exit 1
CMD ["sh", "-c", "helpline-watch serve --host 0.0.0.0 --port ${PORT:-8787}"]
