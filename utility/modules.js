module.exports = {
    formatTime: function (timeMS) {
        const seconds = Math.floor((timeMS / 1000) % 60);
        const minutes = Math.floor((timeMS / (1000 * 60)) % 60);
        const hours = Math.floor((timeMS / (1000 * 60 * 60)) % 24);
        const days = Math.floor(timeMS / (1000 * 60 * 60 * 24));

        let formattedTime = '';
        if (days > 0) {
            formattedTime += `${days}d `;
        }
        if (hours > 0 || days > 0) {
            formattedTime += `${hours}h `;
        }
        if (minutes > 0 || hours > 0 || days > 0) {
            formattedTime += `${minutes}mins `;
        }

        formattedTime += `${seconds}sec `;

        return formattedTime;
    }
};