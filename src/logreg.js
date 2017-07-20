const {Matrix} = require('ml-matrix');
const LogisticRegressionTwoClasses = require('./logreg_2classes');

function transform_classes_for_one_vs_all(Y, oneClass){
    y = Y.to1DArray();
    for (var i = 0; i < y.length; i++){
        if (y[i] == oneClass) {
            y[i] = 0;
        } else {
            y[i] = 1;
        }
    }
    return Matrix.columnVector(y);
}

class LogisticRegression {

    constructor(options) {
        options = options || {};
        this.numSteps = options. numSteps || 500000;
        this.learningRate = options.learningRate || 5e-4;
        this.classifiers = [];
        this.numberClasses = 0;
    }

    train(X, Y) {
        this.numberClasses = new Set(Y).size;
        this.classifiers = new Array(this.numberClasses);

        // train the classifiers
        for (var i = 0; i < this.numberClasses; i++){
            this.classifiers[i] = new LogisticRegressionTwoClasses({numSteps: this.numSteps, learningRate: this.learningRate});
            var y = Y.clone();
            y = transform_classes_for_one_vs_all(y, i);
            this.classifiers[i].train(X,y);
        }
    }

    test(Xtest) {
        var resultsOneClass = new Array(this.numberClasses).fill(0);
        for (var i = 0; i < this.numberClasses; i++){
            resultsOneClass[i]= this.classifiers[i].testScores(Xtest);
        }
        var finalResults = new Array(Xtest.rows).fill(0);
        for (var i = 0; i < Xtest.rows; i++){
            var minimum = 100000;
            for (var j = 0; j < this.numberClasses; j++){
                if (resultsOneClass[j][i] < minimum) {
                    minimum = resultsOneClass[j][i];
                    finalResults[i] = j;
                }
            }
        }
        return finalResults;
    }
}

module.exports = LogisticRegression;
