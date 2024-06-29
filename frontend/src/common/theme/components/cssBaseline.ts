const fadeInUp = `
  @keyframes fadeInUp {
    0% {
      opacity: 0;
      margin-top: 100px;
    }
    100% {
      opacity: 1;
      margin-top: 0;
    }
  }
`;

const fadeInUp2 = `
  @keyframes fadeInUp2 {
    0% {
      opacity: 0;
      margin-top: 260px;
    }
    100% {
      opacity: 1;
      margin-top: 160px;
    }
  }
`;

const shortFadeInUp = `
  @keyframes shortFadeInUp {
    0% {
      opacity: 0;
      margin-top: 24px;
    }
    100% {
      opacity: 1;
      margin-top: 0;
    }
  }
`;

export const cssBaselineTheme = {
  MuiCssBaseline: {
    styleOverrides: `
      ${fadeInUp}
      ${fadeInUp2}
      ${shortFadeInUp}

      .intercom-lightweight-app {
        z-index: 4000 !important;
      }
    `,
  },
};
