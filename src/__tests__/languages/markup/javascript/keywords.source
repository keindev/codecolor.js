function test() {
    ['test', 'keywords'].forEach((name, index) => {
        const regExp = new RegExp(/test/, 'gm');
        var match;

        while (match = regExp.exec(name)) {
            let token = new Token(match[0], match.index);

            if (getTokenIndex(token) >= 0) {
                tokens.splice(token.index, 0, token);
            } else {
                tokens[Math.abs(token.index)] = token;
            }
        }
    });

    return true;
}
