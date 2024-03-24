from flask import Flask, request, jsonify
import game_logic

app = Flask(__name__)

@app.route('/', methods=['GET'])
def generate_numbers():
    numbers = game_logic.generate_numbers()
    return jsonify(numbers)

@app.route('/submit', methods=['POST'])
def submit_solution():
    data = request.json
    solution = data.get('solution')
    is_correct = game_logic.check_solution(solution)
    if is_correct is True:
        return jsonify({"correct": True})
    else:
        return jsonify({"correct": False, "message": "Solution is incorrect or there was an error in processing."})

if __name__ == '__main__':
    app.run(debug=True)
