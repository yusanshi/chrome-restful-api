#!/usr/bin/env python3
import sys
import json
import logging
import uvicorn
import yaml
import psutil

from fastapi import FastAPI, Response
from pathlib import Path
from signal import SIGTERM
from time import sleep

logging.basicConfig(level=logging.INFO, format="[%(asctime)s] %(message)s")
with open(Path(__file__).parent / 'config.yaml') as f:
    config = yaml.safe_load(f)

app = FastAPI()


def send(data):
    data = json.dumps(data)
    length = len(data)
    length_bytes = length.to_bytes(4, byteorder=sys.byteorder)
    sys.stdout.buffer.write(length_bytes)
    sys.stdout.write(data)
    sys.stdout.flush()


def receive():
    length_bytes = sys.stdin.buffer.read(4)
    length = int.from_bytes(length_bytes, byteorder=sys.byteorder)
    data = sys.stdin.read(length)
    return data


@app.get("/")
def hello():
    return 'Hello from the host'


@app.get("/{path:path}")
def forward(path):
    logging.info(f"Receive: {path}")
    send(path)
    data = receive()
    logging.info(f"Response: {data}")
    # don't `return data` as it will serialize `data` and data is already a serialized string
    return Response(content=data, media_type='application/json')


if __name__ == '__main__':
    # kill the process occupying the target port
    for process in psutil.process_iter():
        try:
            for connections in process.connections(kind='inet'):
                if connections.laddr.port == config['port']:
                    process.send_signal(SIGTERM)
                    sleep(3)  # wait for it to exit
        except psutil.AccessDenied:
            pass

    # disable access_log since it defaults to stdout and will corrupt the native messaging protocol
    uvicorn.run(app, host='127.0.0.1', port=config['port'], access_log=False)
