from flask import Flask, render_template, url_for

app = Flask(__name__, static_folder='static', template_folder='templates')

REPORTS = [
    {"title": 'Analysis of Marathon Results', "src": '[MTH448 Report 4] Analysis of Marathon Results - Michael Simons.html' },
    { 'title': 'Basic & Convolutional Neural Networks for Income Prediction & Object Classification', 'src': 'Analysis, NN, CNN.html' },
    { 'title': 'k-Nearest Neighbors for Classifying Handwritten Digits','src': '[MTH448 Report 1]  k-NN for Image Classification - Michael Simons.html' },
    { 'title': 'Naive Bayes Classifier For Speaker Prediction', 'src': '[MTH448 Report 3] Naive Bayes Classifier For Speaker Prediction - Michael Simons.html' },
    { 'title': 'Exploratory Data Analysis of Red Wine & Diamond Datasets', 'src': 'Analysis.html' },
    { 'title': 'Regression, Regularization, & Gradient Descent', 'src': 'Regression, Regularization, and Gradient Descent.html' },
    { 'title': 'Tabular Learning Methods & Deep Q-Networks', 'src': 'Exploration of Q-learning & SARSA - Michael Simons.html' },
    { 'title': 'Analysis of False Primes', 'src': '[MTH337 Report 1] Analysis of False Primes - Michael Simons.html' },
    { 'title': 'Analysis of Pythagorean Triplets', 'src': '[MTH337 Report 2] Computation, Visualization, and Analysis of Pythagorean Triplets - Michael Simons.html' },
    { 'title': 'Sudoku Solver','src': '[MTH337 Report 8] Naive Sudoku Solver - Michael Simons.html' },
    { 'title': 'Baby Naming Trends In The United States', 'src': 'bbnt.html' },
    { 'title': 'Image Denoising & Filter Dynamics', 'src': '[MTH337 Report 5] Image Denoising & Filter Dynamics - Michael Simons.html' },
    { 'title': 'Numerical Methods for Root Finding', 'src': '[MTH437 Report 1] Methods for Root Finding - Michael Simons.html' },
    { 'title': 'Numerical Methods for Solving Linear Systems', 'src': '[MTH437 Report 2] Methods for Solving Linear Systems - Michael Simons.html' },
    { 'title': 'Numerical Methods for Polynomial Interpolation', 'src': '[MTH437 Report 3] Methods for Polynomial Interpolation - Michael Simons.html' }
]

@app.route('/')
def index():
    return render_template('indecks.html')


@app.route('/portfolio')
def portfolio():
    return render_template('portfolio.html', reports=REPORTS)



@app.route('/algorithm_visualizer')
def algorithm_visualizer():
    return render_template('algorithm_visualizer.html')


@app.route('/<filename>')
def report(filename):
    return render_template(filename) # Make sure the actual reports HTML exist (report1.html, etc. inside 'templates' folder).


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)