module.exports = {
    filenameHashing: false,
    runtimeCompiler: true,
    chainWebpack: config => {
        config.optimization.splitChunks(false);
    }
};