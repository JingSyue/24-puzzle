import random
import re
from collections import Counter
from asteval import Interpreter
import openpyxl
from copy import deepcopy
import json
import os
from utils import preprocess_input, validate_numbers
from config import levels, USER_SESSIONS_FILE

aeval = Interpreter()

# Load user sessions from a JSON file if it exists
def load_user_sessions():
    try:
        if os.path.exists(USER_SESSIONS_FILE):
            with open(USER_SESSIONS_FILE, 'r') as f:
                return json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error loading JSON file: {e}")
        return {}
    return {}

# Save user sessions to a JSON file
def save_user_sessions():
    with open(USER_SESSIONS_FILE, 'w') as f:
        json.dump(user_sessions, f)

user_sessions = load_user_sessions()

def deep_copy_levels():
    return deepcopy(levels)

def check_solution(user_input, level_numbers):
    if not validate_numbers(user_input, level_numbers):
        return False, "數字與題目不符，每個數字僅能出現一次"
    try:
        result = aeval(preprocess_input(user_input))
        if result == 24:
            return True, "正確!"
        else:
            return False, f"錯誤 {result}"
    except Exception as e:
        return False, f"錯誤 {e}"

def organize_levels_by_difficulty(levels):
    group_size = 10
    organized_levels = []
    for i in range(0, len(levels), group_size):
        group = levels[i:i+group_size]
        organized_levels.append(group)
    return organized_levels

def load_levels_from_excel(file_path):
    workbook = openpyxl.load_workbook(file_path)
    sheet = workbook.active
    temp_levels = []

    for row in sheet.iter_rows(min_row=1):
        level = []
        solutions_count = 0
        for i, cell in enumerate(row[:5]):
            if i < 4 and isinstance(cell.value, (int, float)):
                level.append(cell.value)
            elif i == 4:
                solutions_count = cell.value
        if len(level) == 4 and isinstance(solutions_count, int):
            temp_levels.append((level, solutions_count))

    temp_levels.sort(key=lambda x: x[1])
    levels['easy'] = organize_levels_by_difficulty([level for level, _ in temp_levels])
    levels['hard'] = organize_levels_by_difficulty([level for level, _ in temp_levels])

def get_random_question(user_id, level):
    if level == "easy":
        load_levels_from_excel('easy.xlsx')
    elif level == "hard":
        load_levels_from_excel('hard.xlsx')

    if user_id not in user_sessions:
        user_sessions[user_id] = {'levels': deepcopy(levels), 'history': {}}

    if level not in user_sessions[user_id]['levels'] or not user_sessions[user_id]['levels'][level]:
        return None, "無此等級"

    difficulty_ranges = user_sessions[user_id]['levels'][level]

    if not difficulty_ranges:
        return None, "所有關卡皆已破關"

    for questions_in_range in difficulty_ranges:
        if questions_in_range:
            question_index = random.randint(0, len(questions_in_range) - 1)
            question = questions_in_range.pop(question_index)
            if not questions_in_range:
                difficulty_ranges.remove(questions_in_range)
            save_user_sessions()
            return question, ""

    save_user_sessions()
    return None, "無此等級"
