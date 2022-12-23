import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router";
import { Canvas } from "./Canvas";
import { ToolBar } from "./ToolBar";

const Layout = () => {
  return (
    <Box
      border='3px solid #000'
      boxShadow='2px 2px 3px 0px rgb(0, 0, 0, 0.25)'
      maxW='1200px'
      mx='auto'
      mt='16'
    >
      <ToolBar />

      <Canvas />

      <Outlet />
    </Box>
  )
}

export { Layout };