#/server/game_logic.py
import random
import re
from collections import Counter
from asteval import Interpreter
import openpyxl
from pprint import pprint
from copy import deepcopy

aeval = Interpreter()


user_sessions = {}

# 预先定义的关卡，每个关卡是一组数字
levels = {
    'easy': [],
    'hard': []
}

def preprocess_input(user_input):
    # 替换用户输入的特殊字符
    user_input = user_input.replace('x', '*').replace('÷', '/')
    # 移除可能的恶意代码
    user_input = re.sub(r"[^\d\+\-\*\/\(\)\s]", "", user_input)
    return user_input

def validate_numbers(user_input, level_numbers):
    input_numbers = [int(num) for num in re.findall(r'\d+', preprocess_input(user_input))]
    input_count = Counter(input_numbers)
    level_count = Counter(level_numbers)
    for num, count in input_count.items():
        if count > level_count.get(num, 0):
            return False
    return True

def check_solution(user_input, level_numbers):
    if not validate_numbers(user_input, level_numbers):
        return False, "數字與題目不符，每個數字僅能出現一次"
    try:
        result = aeval(preprocess_input(user_input))
        return result == 24, "正確!" if result == 24 else "錯誤! 運算結果不是24"
    except Exception as e:
        return False, f"錯誤 {e}"

# 按难度范围组织题目的函数
def organize_levels_by_difficulty(levels):
    # 假设 levels 已经按解题数量从高到低排序
    # 分组的大小
    group_size = 10
    organized_levels = []
    for i in range(0, len(levels), group_size):
        group = levels[i:i+group_size]
        organized_levels.append(group)
    return organized_levels

# 更新 load_levels_from_excel 函数以使用新的组织方式
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
    
    # 排序
    temp_levels.sort(key=lambda x: x[1])
    
    # 使用组织好的难度层次替换 levels['newbie']
    levels['easy'] = organize_levels_by_difficulty([level for level, _ in temp_levels])
    levels['hard'] = organize_levels_by_difficulty([level for level, _ in temp_levels])

def get_random_question(user_id, level):
    if level=="easy":
        load_levels_from_excel('easy.xlsx')
    elif level=="hard":
        load_levels_from_excel('hard.xlsx')
        
    if user_id not in user_sessions:
        user_sessions[user_id] = deepcopy(levels)
    
    if level not in user_sessions[user_id] or not user_sessions[user_id][level]:
        return None, "無此等級"
    
    # 获取当前用户可答的所有题目分组
    difficulty_ranges = user_sessions[user_id][level]
    
    if not difficulty_ranges:
        return None, "所有關卡皆已破關"
    
    # 优先选择解答数量多的题目组
    for questions_in_range in difficulty_ranges:
        if questions_in_range:
            # 从当前题目组随机选择一个题目
            question_index = random.randint(0, len(questions_in_range) - 1)
            question = questions_in_range.pop(question_index)
            # 如果当前题目组为空，则从难度范围列表中移除
            if not questions_in_range:
                difficulty_ranges.remove(questions_in_range)
            return question, "利用四則運算使運算結果為24"
    
    return None, "無此等級"
