import {
  extendTheme,
  ThemeConfig
} from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    primary: {
      50: "#FAF5FF",
      100: "#E9D8FD",
      200: "#D6BCFA",
      300: "#B794F4",
      400: "#9F7AEA",
      500: "#805AD5",
      600: "#6B46C1",
      700: "#553C9A",
      800: "#44337A",
      900: "#322659",
    },
  },
  components: {
    Input: {
      baseStyle: {
        field: { borderColor: 'gray.100' }
      },
    },
    Button: {
      defaultProps: { colorScheme: 'primary' }
    },
    FormLabel: {
      baseStyle: { fontWeight: 'bold' }
    }
  }
});

export default theme
