module.exports = {
    filenameHashing: false,
    chainWebpack: config => {
        config.optimization.splitChunks(false);
    }
};