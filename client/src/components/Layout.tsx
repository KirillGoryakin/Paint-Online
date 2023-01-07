import { Box } from "@chakra-ui/react";
import { Navigate, Outlet, useParams } from "react-router";
import { Canvas } from "./Canvas";
import { Credits } from "./Credits";
import { ModalWindow } from "./ModalWindow";
import { RoomCode } from "./RoomCode";
import { TopBar } from "./TopBar";
import { Users } from "./Users";

const isRoomId = (roomId: string): boolean => /^\d{5}$/.test(roomId);

type Props = {
  genRoomId: () => number;
};

const Layout: React.FC<Props> = ({ genRoomId }) => {
  const { roomId } = useParams();
  if (roomId && !isRoomId(roomId))
    return <Navigate to={'/' + genRoomId()} />
  
  return (
    <Box
      maxW='1206px'
      mx='auto'
      mt={4}
    >
      <Users />
      
      <Box
        position='relative'
        border='3px solid #000'
        boxShadow='2px 2px 4px 2px rgb(0, 0, 0, 0.25)'
        mb={8}
      >
        <TopBar />

        <Canvas />
      </Box>

      <RoomCode />

      <Credits />

      <Outlet />
      
      <ModalWindow />
    </Box>
  )
}

export { Layout };