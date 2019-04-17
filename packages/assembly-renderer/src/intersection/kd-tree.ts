import { Box } from "../shapes/Box";
import { KDNode } from "./kd-node";

export class KDTree {
  constructor(public bbox: Box, public root: KDNode) {}
}
