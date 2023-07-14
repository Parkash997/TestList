import React from "react";
import { View } from "react-native";
import Screen1 from "./src/Screen1";
import client from "./src/Apollo";
import { ApolloProvider } from "@apollo/client";

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <Screen1 />
      </ApolloProvider>
    </>
  );
}

export default App;