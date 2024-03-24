from flask import Flask, request, jsonify
import game_logic
import uuid

app = Flask(__name__)
@app.route('/', methods=['GET'])
def game_intro():
    return jsonify({"message": "Welcome to 24 point game"})

@app.route('/start', methods=['GET'])
def start_game():
    user_id = request.args.get('user_id')
    if not user_id:
        # 为新用户生成一个UUID
        user_id = str(uuid.uuid4())
    level = request.args.get('level', 'newbie')
    question, message = game_logic.get_random_question(user_id, level)
    return jsonify({"user_id": user_id, "numbers": question, "message": message})

@app.route('/submit', methods=['POST'])
def submit_solution():
    data = request.json
    user_id = data.get('user_id')
    solution = data.get('solution')
    numbers = data.get('numbers')
    is_correct, message = game_logic.check_solution(solution, numbers)
    return jsonify({"correct": is_correct, "message": message})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
