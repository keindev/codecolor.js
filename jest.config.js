module.exports = {
    bail: true,
    verbose: true,
    collectCoverage: true,
    coverageReporters: ["text-summary"],
    transform: {
        "^.+\\.js$": "babel-jest"
    },
};
