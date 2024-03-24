import random
import openpyxl
from pprint import pprint
from asteval import Interpreter
from copy import deepcopy

aeval = Interpreter()

# 预先定义的关卡，每个关卡是一组数字
levels = {
    'newbie': [[1,1,2,8],[1,1,1,8],[1,1,2,9],[1,1,2,10]],
    'veteran': [[1,1,1,11],[1,1,2,11],[1,1,11,11]]
}

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
    


def check_solution(user_input, level_numbers):
    user_input = preprocess_input(user_input)  # 预处理用户输入
    try:
        result = aeval(user_input)
        if result == 24:
            print("Correct!")
            return True
        else:
            print("Incorrect. The result is not 24.")
            return False
    except Exception as e:
        print("There was an error with your input: ", e)
        return False

def preprocess_input(user_input):
    # 替换用户输入的特殊字符
    return user_input.replace('x', '*').replace('÷', '/')


def start_game():
    # 为当前玩家复制一份独立的关卡列表
    player_levels = deepcopy(levels)

    for level in ['newbie', 'veteran']:
        questions = random.sample(player_levels[level], k=3 if level == 'newbie' else 2)
        for question in questions:
            print(f"The numbers are: {question}. Please enter a solution that evaluates to 24.")
            attempts = 0
            user_inputs = []

            while attempts < 3:
                user_input = input("Your solution: ")
                user_inputs.append(user_input)
                if check_solution(user_input, question):
                    break
                attempts += 1

            if attempts == 3:
                print("You've used all your attempts. The attempted solutions were: ")
                print(user_inputs)
                print("Moving to the next question...")

            # 不需要从player_levels中移除题目，因为每个玩家有独立的副本

# 每次一个新玩家开始游戏，就调用start_game()
start_game()



