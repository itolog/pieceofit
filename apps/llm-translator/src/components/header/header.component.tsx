import React from "react";

import { Text } from "ink";
import Gradient from "ink-gradient";

import { HEADER_BANNER } from "./header.model";

export const Header = () => (
  <Gradient name="vice">
    <Text>{HEADER_BANNER}</Text>
  </Gradient>
);
