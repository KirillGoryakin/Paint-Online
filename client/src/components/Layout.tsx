import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router";
import { Canvas } from "./Canvas";
import { ModalWindow } from "./ModalWindow";
import { RoomCode } from "./RoomCode";
import { TopBar } from "./TopBar";
import { Users } from "./Users";

const Layout = () => {
  return (
    <Box
      maxW='1206px'
      mx='auto'
      mt={4}
    >
      <Box
        border='3px solid #000'
        boxShadow='2px 2px 4px 2px rgb(0, 0, 0, 0.25)'
        mb={8}
      >
        <TopBar />

        <Canvas />
      </Box>

      <RoomCode />

      <Users />

      <Outlet />
      
      <ModalWindow />
    </Box>
  )
}

export { Layout };