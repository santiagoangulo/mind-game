import type { AppType, AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../theme";
import { trpc } from "../utils/trpc";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
// import {
//   Outlet,
//   RouterProvider,
//   createReactRouter,
//   createRouteConfig,
// } from '@tanstack/react-router'

// const routeConfig = createRouteConfig().createChildren((createRoute) => [
//   createRoute({
//     path: '/',
//     component: Index,
//   }),
//   createRoute({
//     path: 'about',
//     component: About,
//   }),
// ])

const App: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default trpc.withTRPC(App);
