// Global configuration
let silentMode = false;

module.exports = {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',
    sessionPath: 'sesion',
    get silentMode() {
        return silentMode;
    },
    set silentMode(value) {
        silentMode = value;
    }
};
