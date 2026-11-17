#!/usr/bin/env python3
"""
SYNAPSE // QUANT TERMINAL - Local Dev & Preview Server
Run this script: python server.py
"""
import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable caching-free live updates during development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def main():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"============================================================")
        print(f"  SYNAPSE // QUANT TERMINAL v4.8.2-PROD")
        print(f"  Live Server running at: {url}")
        print(f"  Directory: {DIRECTORY}")
        print(f"  Press Ctrl+C to terminate.")
        print(f"============================================================")
        try:
            webbrowser.open(url)
        except Exception:
            pass
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == '__main__':
    main()
