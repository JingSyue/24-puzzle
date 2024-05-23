from flask import Flask, request, jsonify
from flask_cors import CORS
import game_logic
import uuid
from copy import deepcopy

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def game_intro():
    return jsonify({"message": "Welcome to 24 point game"})

@app.route('/start', methods=['GET'])
def start_game():
    user_id = request.args.get('user_id')
    if not user_id:
        user_id = str(uuid.uuid4())
    level = request.args.get('level', 'easy')
    question, message = game_logic.get_random_question(user_id, level)
    return jsonify({"user_id": user_id, "numbers": question, "message": message})

@app.route('/submit', methods=['POST'])
def submit_solution():
    try:
        data = request.json
        user_id = data.get('user_id')
        solution = data.get('solution')
        numbers = tuple(data.get('numbers'))
        is_correct, message = game_logic.check_solution(solution, numbers)
        
        # Save user input and result
        if user_id not in game_logic.user_sessions:
            game_logic.user_sessions[user_id] = {'levels': deepcopy(game_logic.levels), 'history': {}}
        
        str_numbers = str(numbers)  # Convert the tuple to a string
        if str_numbers not in game_logic.user_sessions[user_id]['history']:
            game_logic.user_sessions[user_id]['history'][str_numbers] = []
        
        game_logic.user_sessions[user_id]['history'][str_numbers].append({
            'solution': solution,
            'correct': is_correct,
            'message': message
        })
        game_logic.save_user_sessions()
        
        # Retrieve input history for the current question
        input_history = game_logic.user_sessions[user_id]['history'].get(str_numbers, [])
        
        return jsonify({"correct": is_correct, "message": message, "input_history": input_history})
    except Exception as e:
        app.logger.error(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
