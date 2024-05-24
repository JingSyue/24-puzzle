import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USER_SESSIONS_FILE = os.path.join(BASE_DIR, 'user_sessions.json')

levels = {
    'easy': [],
    'hard': []
}
