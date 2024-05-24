import re
from collections import Counter

def preprocess_input(user_input):
    # Replace user input special characters
    user_input = user_input.replace('x', '*').replace('÷', '/')
    # Remove potential malicious code
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
