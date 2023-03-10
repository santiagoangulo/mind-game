import { ChakraProvider } from "@chakra-ui/react";
import { AppType } from "next/app";
import { Layout } from "../components/Layout";
import { useUserId } from "../hooks/useUserId";
import { theme } from "../theme";
import { trpc } from "../utils/trpc";

const App: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
};

export default trpc.withTRPC(App);
