module.exports = {
  cache: {
    cacheId: "Mozo ICO",
    runtimeCaching: [{
      handler: "fastest",
      urlPattern: "\/$"
    }],
    staticFileGlobs: ['dist/**/*']
  },
  manifest: {
    background: "#FFFFFF",
    title: "Mozo ICO",
    short_name: "PWA",
    theme_color: "#FFFFFF"
  }
};
