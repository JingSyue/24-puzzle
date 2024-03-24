import random
import re
from collections import Counter
from asteval import Interpreter
import openpyxl
from pprint import pprint
from copy import deepcopy

aeval = Interpreter()

# 存储用户的题目状态
user_sessions = {}

# 预先定义的关卡，每个关卡是一组数字
levels = {
    'newbie': [[1, 1, 2, 8], [1, 1, 1, 8], [1, 1, 2, 9], [1, 1, 2, 10]],
    'veteran': [[1, 1, 1, 11], [1, 1, 2, 11], [1, 1, 11, 11]]
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
        return False, "Invalid input: Numbers don't match the question or used too many times."
    try:
        result = aeval(preprocess_input(user_input))
        return result == 24, "Correct!" if result == 24 else "Incorrect. The result is not 24."
    except Exception as e:
        return False, f"There was an error with your input: {e}"

def get_random_question(user_id, level):
    if user_id not in user_sessions:
        user_sessions[user_id] = deepcopy(levels)
    available_questions = user_sessions[user_id][level]
    if not available_questions:
        return None, "No questions available for the selected level."
    question = random.choice(available_questions)
    available_questions.remove(question)
    return question, "Please enter a solution that evaluates to 24."


### to be edit
def load_levels_from_excel(file_path):
    # 打开Excel文件
    workbook = openpyxl.load_workbook(file_path)
    # 选择活动的工作表
    sheet = workbook.active

    # 遍历工作表的每一行
    for row in sheet.iter_rows(min_row=4):  # 假设第一行是标题，从第二行开始读取
        level = []
        # 读取前四列的数据
        
        for cell in row[:4]:
            # 假设我们只关心数值
            if isinstance(cell.value, (int, float)) and row[5] is not None:
                print(row[5])
                level.append(cell.value)
        # 确保该行有四个数字
        if len(level) == 4:
            print(level)  # 在终端打印数组
            levels['newbie'].append(level)  # 可选：添加到levels字典中
            
    for row in sheet.iter_rows(min_row=4):  # 假设第一行是标题，从第二行开始读取
        level = []
        # 读取前四列的数据
        for cell in row[8:12]:
            # 假设我们只关心数值
            if isinstance(cell.value, (int, float)) and row[13] is not None:
                level.append(cell.value)
        # 确保该行有四个数字
        if len(level) == 4:
            print(level)  # 在终端打印数组
            levels['veteran'].append(level)  # 可选：添加到levels字典中
