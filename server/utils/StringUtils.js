const fs = require('fs');

class StringUtils {
    constructor() {
        this.badWords = this.parseBadWordsFile();
    }

    async parseBadWordsFile() {
        await fs.readFile("./utils/banned_words.txt", (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            data = data.toString().split("\n");
            for (let idx = 0; idx < data.length; idx++) {
                data[idx] = data[idx].substring(0, data[idx].indexOf('\r')); // Chomp off \r which gets left there..
            }

            this.badWords = data;
        });
    }

    getBadWords() {
        return this.badWords;
    }

    sanitizeMessage(message, regExp) {
        message = message.replace(regExp, "[CENSORED]");
        return message;
    }
}

module.exports = StringUtils;